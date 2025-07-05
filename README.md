# Claude Hook SDK (TypeScript)

A TypeScript SDK for building Claude Code hooks, providing a clean and fluent API for handling hook events and responses.

## Installation

```bash
npm install claude-hook-sdk
```

## Quick Start

### Basic Usage

```typescript
import { createHook } from 'claude-hook-sdk'

// Create a hook from stdin
const hook = await createHook()

// Build a response
hook.response()
  .approve('Tool usage approved')
  .continue()
```

### Hook Types

The SDK supports all Claude Code hook events:

- **PreToolUse**: Executed before tool calls
- **PostToolUse**: Executed after tool calls  
- **Notification**: Handles notification events
- **Stop**: Handles stop events
- **SubagentStop**: Handles subagent stop events

### Example Hook Script

```typescript
#!/usr/bin/env node
import { createHook, PreToolUseHook } from 'claude-hook-sdk'

async function main() {
  const hook = await createHook()
  
  if (hook instanceof PreToolUseHook) {
    const toolName = hook.toolName()
    const toolInput = hook.toolInput()
    
    // Block dangerous operations
    if (toolName === 'Bash' && toolInput.command?.includes('rm -rf')) {
      hook.response()
        .block('Dangerous command blocked')
        .continue()
      return
    }
  }
  
  // Default: approve
  hook.response()
    .approve('Tool usage approved')
    .continue()
}

main()
```

## API Reference

### Factory Functions

- `createHook(): Promise<AnyHook>` - Create hook from stdin
- `createHookFromString(json: string): AnyHook` - Create hook from JSON string
- `createHookFromPayload(payload: HookPayload): AnyHook` - Create hook from parsed payload

### Hook Classes

#### Base Hook Class

All hooks inherit from the base `Hook` class:

```typescript
abstract class Hook {
  getSessionId(): string
  getTranscriptPath(): string
  getRawData(): HookPayload
  transcript(): any[]
  response(): ResponseBuilder
  error(message: string): never
  success(message: string): never
  abstract eventName(): string
}
```

#### PreToolUseHook

```typescript
class PreToolUseHook extends Hook {
  toolName(): string
  toolInput(): Record<string, any>
  toolInput<T>(key: string): T | undefined
  toolInput<T>(key: string, defaultValue: T): T
  estimatedTokens(): number
}
```

#### PostToolUseHook

```typescript
class PostToolUseHook extends Hook {
  toolName(): string
  toolInput(): Record<string, any>
  toolInput<T>(key: string): T | undefined  
  toolInput<T>(key: string, defaultValue: T): T
  toolResponse(): Record<string, any>
  toolResponse<T>(key: string): T | undefined
  toolResponse<T>(key: string, defaultValue: T): T
}
```

#### NotificationHook

```typescript
class NotificationHook extends Hook {
  message(): string
  title(): string
}
```

#### StopHook & SubagentStopHook

```typescript
class StopHook extends Hook {
  stopHookActive(): boolean
}

class SubagentStopHook extends Hook {
  stopHookActive(): boolean
}
```

### ResponseBuilder

Fluent API for building hook responses:

```typescript
class ResponseBuilder {
  approve(reason?: string): this
  block(reason: string): this
  suppressOutput(): this
  merge(fields: Record<string, any>): this
  continue(): never  // Exits with code 0
  stop(reason: string): never  // Exits with code 1
}
```

## CLI Tools

### Basic Hook Runner

```bash
echo '{"session_id":"test","transcript_path":"/tmp/test.jsonl","hook_event_name":"Notification","message":"Hello"}' | claude-hook
```

### Deterministic Router

The SDK includes a deterministic router that routes large operations to Gemini CLI:

```bash
echo '{"session_id":"test","transcript_path":"/tmp/test.jsonl","hook_event_name":"PreToolUse","tool_name":"Read","tool_input":{"files":["large-file.txt"]}}' | deterministic-router
```

## Configuration

Example Claude Code settings for using the deterministic router:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "matcher": "mcp__gemini-cli__.*",
      "command": "deterministic-router"
    }
  ]
}
```

## Testing

```bash
npm test          # Run tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
```

## Development

```bash
npm run build    # Build TypeScript
npm run dev      # Watch mode
```

## License

MIT