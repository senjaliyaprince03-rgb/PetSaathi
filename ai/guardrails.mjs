import { toolRegistry } from './tool-registry.mjs';

/**
 * Validates a tool call against security, schema, and permission guardrails.
 * Throws a specific Error message if a guardrail fails, which the executor catches.
 */
export function runGuardrails(toolCall, taskContext) {
  const toolName = toolCall.function.name;
  const argsStr = toolCall.function.arguments;
  
  // 1. Tool exists?
  const tool = toolRegistry.find(t => t.name === toolName);
  if (!tool) {
    throw new Error(`TOOL_NOT_FOUND: Tool '${toolName}' is not registered or unknown.`);
  }

  // 2. Schema valid?
  let args;
  try {
    args = JSON.parse(argsStr || '{}');
  } catch (e) {
    throw new Error(`INVALID_ARGUMENTS: Tool arguments must be valid JSON.`);
  }
  
  if (tool.schema && tool.schema.required) {
    for (const req of tool.schema.required) {
      if (args[req] === undefined || args[req] === null) {
        throw new Error(`INVALID_ARGUMENTS: Missing required argument '${req}'.`);
      }
    }
  }

  // Check argument types against schema
  if (tool.schema && tool.schema.properties) {
    for (const [key, propSchema] of Object.entries(tool.schema.properties)) {
      const val = args[key];
      if (val !== undefined && val !== null) {
        if (propSchema.type === "string" && typeof val !== "string") {
          throw new Error(`INVALID_ARGUMENTS: Argument '${key}' must be a string.`);
        }
        if (propSchema.type === "number" && typeof val !== "number") {
          throw new Error(`INVALID_ARGUMENTS: Argument '${key}' must be a number.`);
        }
        if (propSchema.type === "boolean" && typeof val !== "boolean") {
          throw new Error(`INVALID_ARGUMENTS: Argument '${key}' must be a boolean.`);
        }
        if (propSchema.type === "object" && (typeof val !== "object" || Array.isArray(val))) {
          throw new Error(`INVALID_ARGUMENTS: Argument '${key}' must be an object.`);
        }
      }
    }
  }

  // 3. Read-only allowed?
  // In Phase 5A, all executed tools MUST be marked read-only.
  if (!tool.permissions || !tool.permissions.readOnly) {
    throw new Error(`TOOL_NOT_PERMITTED: Only read-only tools are permitted for this agent.`);
  }

  // 4. Additional Permission allowed? 
  // (Extensible check for user roles, task constraints, etc.)
  
  return { tool, args };
}
