# Care report, closure and payout runbook

This workflow separates service completion, quality review, booking closure and money movement. A sitter cannot close their own booking or make their payout eligible merely by submitting a report.

## Lifecycle

1. An authorised active Saathi records check-out. The booking moves to `REPORT_PENDING` and live tracking ends.
2. The Saathi submits a structured report. The assignment and booking move to `COMPLETED`; the report starts at `PENDING` review. A payout record is created from the immutable accepted service price's `sitterPaise`, never from a client amount or environment percentage.
3. Operations opens `/admin/reports` and records one decision with evidence:
   - `APPROVED`: closes the booking and changes the capacity reservation from `HELD` to `CONSUMED`.
   - `CORRECTION_REQUIRED`: holds the payout and returns a review note to the Saathi. The corrected submission becomes a new report version; prior evidence is retained.
   - `ESCALATED`: holds the payout, keeps the booking completed and sends the record to the safety queue.
4. Concern-flagged reports require Safety or Super Admin approval. Any open incident blocks approval and booking closure.
5. Finance can approve, process or mark a payout paid only after the latest report is `APPROVED` and the booking is `CLOSED`.

## Role boundaries

| Decision | Allowed roles |
| --- | --- |
| Submit or correct report | Assigned Saathi only |
| Routine report approval/correction/escalation | Operations, Safety, Super Admin |
| Concern-flagged approval | Safety or Super Admin |
| Payout hold/approval/processing/payment | Finance or Super Admin |
| Incident closure | Safety or Super Admin |

Every report decision and payout transition requires a reason and creates an audit record. A paid payout also requires a provider reference and sends an in-app notification to the Saathi.

## Failure and recovery

- If report submission fails, the transaction leaves assignment, booking and payout unchanged. The Saathi can retry safely.
- If correction is requested, never overwrite the old report. Submit a new version from the assignment workspace.
- If a report contains a safety concern, use escalation and open/continue the incident workflow. Do not approve while an incident is open.
- If payout is held for a non-report finance reason, report approval does not silently release it. Finance must review and transition it explicitly.
- If booking closure fails because its capacity hold is absent or inconsistent, do not edit counters manually. Open an engineering/operations incident and reconcile the booking, quote and reservation records transactionally.

## Verification evidence

The PostgreSQL integration suite covers initial report submission, payout creation, correction holding, versioned resubmission, final approval, booking closure and capacity consumption. Migration constraints reject non-pending report decisions that omit reviewer, review timestamp or decision note.
