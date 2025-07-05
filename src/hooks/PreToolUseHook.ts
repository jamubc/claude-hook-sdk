import { Hook } from '../core/Hook'
import { HasToolInputMixin, HasToolInputInterface } from '../core/HasToolInput'
import { HookPayload } from '../utils/stdin-json'

export class PreToolUseHook extends Hook implements HasToolInputInterface {
  private toolInputMixin: HasToolInputMixin
  private _toolName: string

  constructor(data: HookPayload) {
    super(data)
    this.toolInputMixin = new HasToolInputMixin()
    this._toolName = data.tool_name || ''
    this.toolInputMixin.setToolInput(data.tool_input || {})
  }

  eventName(): string {
    return 'PreToolUse'
  }

  toolName(): string {
    return this._toolName
  }

  toolInput(): Record<string, any>
  toolInput<T = any>(key: string): T | undefined
  toolInput<T = any>(key: string, defaultValue: T): T
  toolInput<T = any>(key?: string, defaultValue?: T): T | Record<string, any> | undefined {
    return this.toolInputMixin.toolInput(key as any, defaultValue as any)
  }

  estimatedTokens(): number {
    // Simple estimation based on tool input size
    const inputStr = JSON.stringify(this.toolInput())
    return Math.ceil(inputStr.length / 4) // Rough estimate: 4 characters per token
  }
}