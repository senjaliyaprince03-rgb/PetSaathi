import { MongoClient } from 'mongodb';

/**
 * Production Audit Trail
 * Persists high-level request/event metadata to MongoDB.
 * 
 * NEVER stores: raw prompts, model responses, API keys, tokens, retrieved document contents.
 * ALWAYS stores: request metadata, outcome, model used, timing, flags.
 */

let _client = null;
let _collection = null;

async function getCollection() {
  if (_collection) return _collection;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DATABASE || 'petsaathi';

  _client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await _client.connect();

  const db = _client.db(dbName);
  _collection = db.collection('audit_logs');

  // TTL index: retain audit records for 90 days by default
  const retentionDays = parseInt(process.env.AUDIT_RETENTION_DAYS || '90', 10);
  await _collection.createIndex(
    { timestamp: 1 },
    { expireAfterSeconds: retentionDays * 24 * 60 * 60, background: true }
  );

  return _collection;
}

/**
 * Write one audit record for a completed request.
 * @param {object} record
 */
export async function writeAuditRecord(record) {
  // Unit and offline smoke tests opt out explicitly; production stays audited by default.
  if (process.env.AI_AUDIT_ENABLED === 'false') return;

  const {
    requestId,
    durationMs,
    outcome,        // 'success' | 'blocked_security' | 'blocked_governance' | 'error'
    model,
    task,
    fallbackCount,
    toolCount,
    ragUsed,
    degradationMode,
    qualityFlags,
    governanceOutcome,
    eventSummary    // array of { eventType, durationMs, success }
  } = record;

  const doc = {
    requestId,
    timestamp: new Date(),
    durationMs: typeof durationMs === 'number' ? durationMs : null,
    outcome,
    model: model || null,
    task: task || null,
    fallbackCount: typeof fallbackCount === 'number' ? fallbackCount : 0,
    toolCount: typeof toolCount === 'number' ? toolCount : 0,
    ragUsed: ragUsed === true,
    degradationMode: degradationMode || null,
    qualityFlags: Array.isArray(qualityFlags) ? qualityFlags : [],
    governanceOutcome: governanceOutcome || null,
    eventSummary: Array.isArray(eventSummary) ? eventSummary : []
  };

  try {
    const collection = await getCollection();
    await collection.insertOne(doc);
  } catch (err) {
    // Audit failures must not block the user response
    console.error('[Audit] Failed to write audit record:', err.message);
  }
}

/**
 * Query aggregate metrics for the dashboard.
 * @param {{ windowMs?: number }} options
 */
export async function getAuditMetrics(options = {}) {
  const windowMs = options.windowMs || 60 * 60 * 1000; // Default: last 1 hour
  const since = new Date(Date.now() - windowMs);

  try {
    const collection = await getCollection();

    const [metrics] = await collection.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          successCount: { $sum: { $cond: [{ $eq: ['$outcome', 'success'] }, 1, 0] } },
          errorCount: { $sum: { $cond: [{ $eq: ['$outcome', 'error'] }, 1, 0] } },
          blockedSecurityCount: { $sum: { $cond: [{ $eq: ['$outcome', 'blocked_security'] }, 1, 0] } },
          blockedGovernanceCount: { $sum: { $cond: [{ $eq: ['$outcome', 'blocked_governance'] }, 1, 0] } },
          ragUsedCount: { $sum: { $cond: ['$ragUsed', 1, 0] } },
          avgDurationMs: { $avg: '$durationMs' },
          p95DurationMs: { $percentile: { input: '$durationMs', p: [0.95], method: 'approximate' } },
          fallbacks: { $sum: '$fallbackCount' },
          tools: { $sum: '$toolCount' }
        }
      }
    ]).toArray();

    if (!metrics) {
      return { windowMs, since, totalRequests: 0 };
    }

    return {
      windowMs,
      since,
      totalRequests: metrics.totalRequests,
      successRate: metrics.successCount / (metrics.totalRequests || 1),
      errorRate: metrics.errorCount / (metrics.totalRequests || 1),
      governanceRejectionRate: metrics.blockedGovernanceCount / (metrics.totalRequests || 1),
      securityBlockRate: metrics.blockedSecurityCount / (metrics.totalRequests || 1),
      ragHitRate: metrics.ragUsedCount / (metrics.totalRequests || 1),
      avgDurationMs: Math.round(metrics.avgDurationMs || 0),
      p95DurationMs: Math.round((metrics.p95DurationMs || [0])[0] || 0),
      totalFallbacks: metrics.fallbacks,
      totalToolCalls: metrics.tools
    };
  } catch (err) {
    console.error('[Audit] getAuditMetrics error:', err.message);
    return { windowMs, error: err.message };
  }
}
