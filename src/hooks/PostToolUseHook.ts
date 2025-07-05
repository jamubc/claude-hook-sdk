import { Hook } from '../core/Hook'
import { HasToolInputMixin, HasToolInputInterface } from '../core/HasToolInput'
import { HookPayload } from '../utils/stdin-json'

export class PostToolUseHook extends Hook implements HasToolInputInterface {
  private toolInputMixin: HasToolInputMixin
  private _toolName: string
  private _toolResponse: Record<string, any>

  constructor(data: HookPayload) {
    super(data)
    this.toolInputMixin = new HasToolInputMixin()
    this._toolName = data.tool_name || ''
    this.toolInputMixin.setToolInput(data.tool_input || {})
    this._toolResponse = data.tool_response || {}
  }

  eventName(): string {
    return 'PostToolUse'
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

  toolResponse(): Record<string, any>
  toolResponse<T = any>(key: string): T | undefined
  toolResponse<T = any>(key: string, defaultValue: T): T
  toolResponse<T = any>(key?: string, defaultValue?: T): T | Record<string, any> | undefined {
    if (key === undefined) {
      return this._toolResponse
    }
    
    const value = this._toolResponse[key]
    return value !== undefined ? value : defaultValue
  }
}