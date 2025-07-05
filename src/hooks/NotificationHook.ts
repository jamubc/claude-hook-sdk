import { Hook } from '../core/Hook'
import { HookPayload } from '../utils/stdin-json'

export class NotificationHook extends Hook {
  private _message: string
  private _title: string

  constructor(data: HookPayload) {
    super(data)
    this._message = data.message || ''
    this._title = data.title || ''
  }

  eventName(): string {
    return 'Notification'
  }

  message(): string {
    return this._message
  }

  title(): string {
    return this._title
  }
}