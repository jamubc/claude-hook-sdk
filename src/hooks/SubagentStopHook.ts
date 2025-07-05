import { Hook } from '../core/Hook'
import { HookPayload } from '../utils/stdin-json'

export class SubagentStopHook extends Hook {
  private _stopHookActive: boolean

  constructor(data: HookPayload) {
    super(data)
    this._stopHookActive = data.stop_hook_active || false
  }

  eventName(): string {
    return 'SubagentStop'
  }

  stopHookActive(): boolean {
    return this._stopHookActive
  }
}