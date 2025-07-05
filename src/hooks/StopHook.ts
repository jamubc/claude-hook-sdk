import { Hook } from '../core/Hook'
import { HookPayload } from '../utils/stdin-json'

export class StopHook extends Hook {
  private _stopHookActive: boolean

  constructor(data: HookPayload) {
    super(data)
    this._stopHookActive = data.stop_hook_active || false
  }

  eventName(): string {
    return 'Stop'
  }

  stopHookActive(): boolean {
    return this._stopHookActive
  }
}