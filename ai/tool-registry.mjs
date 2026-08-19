import fs from 'fs';
import path from 'path';
import { validateNoSqlFilters } from './security.mjs';

// Enforce project root boundary for file_read
const PROJECT_ROOT = path.resolve(process.cwd());

export const toolRegistry = [
  {
    name: "search",
    description: "Search the web for current information.",
    schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query."
        }
      },
      required: ["query"]
    },
    permissions: {
      readOnly: true
    },
    handler: async (args, context) => {
      // Stub implementation for Phase 5A
      return {
        results: [
          {
            title: "Simulated Search Result",
            snippet: `This is a stubbed search result for query: ${args.query}`,
            url: "https://example.com"
          }
        ]
      };
    }
  },
  {
    name: "database_read",
    description: "Read data from the PetSaathi database using structured queries.",
    schema: {
      type: "object",
      properties: {
        entity: {
          type: "string",
          description: "The entity to query (e.g., 'pets', 'users', 'appointments')"
        },
        filters: {
          type: "object",
          description: "Key-value pairs to filter the results."
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (max 50)."
        }
      },
      required: ["entity"]
    },
    permissions: {
      readOnly: true
    },
    handler: async (args, context) => {
      // Strict NoSQL injection boundary
      if (args.filters && !validateNoSqlFilters(args.filters)) {
        throw new Error("SECURITY_VIOLATION: Invalid database filters. MongoDB operators (starting with '$') are completely prohibited.");
      }

      // Stub implementation for Phase 5A
      const limit = Math.min(args.limit || 10, 50);
      return {
        message: `Simulated database read for entity: ${args.entity}`,
        filtersApplied: args.filters || {},
        limit,
        results: [] // empty for stub
      };
    }
  },
  {
    name: "file_read",
    description: "Read the contents of a file from the project repository.",
    schema: {
      type: "object",
      properties: {
        filepath: {
          type: "string",
          description: "The relative path to the file to read (e.g., 'src/middleware.ts')"
        }
      },
      required: ["filepath"]
    },
    permissions: {
      readOnly: true
    },
    handler: async (args, context) => {
      const inputPath = args.filepath;
      
      // Prevent null byte injection
      if (inputPath.indexOf('\0') !== -1) {
        throw new Error("SECURITY_VIOLATION: Null bytes are not allowed in file paths.");
      }

      const resolvedPath = path.resolve(PROJECT_ROOT, inputPath);
      
      // Resource boundary check: MUST be inside PROJECT_ROOT exactly
      if (!resolvedPath.startsWith(PROJECT_ROOT + path.sep) && resolvedPath !== PROJECT_ROOT) {
        throw new Error("SECURITY_VIOLATION: Path traversal violation. File must be inside the project root.");
      }

      const basename = path.basename(resolvedPath);
      
      // Explicitly reject hidden files (starting with .) except perhaps explicitly allowed ones if any, but .env is blocked.
      if (basename.startsWith('.')) {
        throw new Error("SECURITY_VIOLATION: Cannot read hidden files or unauthorized paths.");
      }

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`File not found: ${inputPath}`);
      }

      const stat = fs.statSync(resolvedPath);
      if (!stat.isFile()) {
        throw new Error(`Path is not a file: ${inputPath}`);
      }
      
      // Limit to 50KB to prevent blowing up the context window
      if (stat.size > 50 * 1024) {
        throw new Error(`File is too large (${Math.round(stat.size / 1024)}KB). Maximum allowed is 50KB.`);
      }

      const content = fs.readFileSync(resolvedPath, 'utf8');
      return {
        filepath: inputPath,
        content
      };
    }
  },
  {
    name: "repository_search",
    description: "Search the codebase repository for specific strings or patterns.",
    schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The string or pattern to search for."
        }
      },
      required: ["query"]
    },
    permissions: {
      readOnly: true
    },
    handler: async (args, context) => {
      // Simple, safe grep-like implementation using Node.js for JS/TS/JSON files
      const query = args.query.toLowerCase();
      let matches = [];
      let filesSearched = 0;
      
      function searchDir(dir) {
        if (filesSearched > 500 || matches.length >= 20) return;
        
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (filesSearched > 500 || matches.length >= 20) break;
          
          if (entry.isDirectory()) {
            if (!['node_modules', '.git', 'dist', '.next'].includes(entry.name)) {
              searchDir(path.join(dir, entry.name));
            }
          } else if (entry.isFile()) {
            if (/\.(js|mjs|ts|tsx|json|md)$/.test(entry.name)) {
              filesSearched++;
              const filePath = path.join(dir, entry.name);
              try {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                  if (lines[i].toLowerCase().includes(query)) {
                    matches.push({
                      file: path.relative(PROJECT_ROOT, filePath),
                      line: i + 1,
                      snippet: lines[i].trim().substring(0, 150) // limit snippet size
                    });
                    if (matches.length >= 20) break; // Limit total results
                  }
                }
              } catch (e) {
                // ignore unreadable files
              }
            }
          }
        }
      }

      searchDir(PROJECT_ROOT);
      
      return {
        query: args.query,
        matches
      };
    }
  },
  {
    name: "retrieve_documents",
    description: "Search the PetSaathi knowledge base for relevant information using semantic search.",
    schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to run against the knowledge base."
        }
      },
      required: ["query"]
    },
    permissions: {
      readOnly: true
    },
    handler: async (args, context) => {
      // Dynamic import to avoid circular dependencies if any
      const { retrieveDocuments } = await import('./retrieval.mjs');
      const results = await retrieveDocuments(args.query, { telemetryContext: context.telemetryContext });
      return {
        query: args.query,
        documents: results
      };
    }
  }
];

/**
 * Strips handler and permissions to provide a clean payload for the NVIDIA API
 */
export function getAvailableToolsForModel() {
  return toolRegistry.map(t => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.schema
    }
  }));
}
