export interface HasToolInputInterface {
  toolInput(): Record<string, any>
  toolInput<T = any>(key: string): T | undefined
  toolInput<T = any>(key: string, defaultValue: T): T
}

export class HasToolInputMixin {
  protected _toolInput: Record<string, any> = {}

  toolInput(): Record<string, any>
  toolInput<T = any>(key: string): T | undefined
  toolInput<T = any>(key: string, defaultValue: T): T
  toolInput<T = any>(key?: string, defaultValue?: T): T | Record<string, any> | undefined {
    if (key === undefined) {
      return this._toolInput
    }
    
    const value = this._toolInput[key]
    return value !== undefined ? value : defaultValue
  }

  public setToolInput(toolInput: Record<string, any>): void {
    this._toolInput = toolInput || {}
  }
}