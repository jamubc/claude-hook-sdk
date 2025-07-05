import { readStdinJson, parseJsonString, HookPayload } from './utils/stdin-json'
import { Hook } from './core/Hook'
import { ResponseBuilder } from './core/ResponseBuilder'
import { PreToolUseHook } from './hooks/PreToolUseHook'
import { PostToolUseHook } from './hooks/PostToolUseHook'
import { NotificationHook } from './hooks/NotificationHook'
import { StopHook } from './hooks/StopHook'
import { SubagentStopHook } from './hooks/SubagentStopHook'

export type AnyHook = PreToolUseHook | PostToolUseHook | NotificationHook | StopHook | SubagentStopHook

const eventMap: Record<string, new (data: HookPayload) => Hook> = {
  'PreToolUse': PreToolUseHook,
  'PostToolUse': PostToolUseHook,
  'Notification': NotificationHook,
  'Stop': StopHook,
  'SubagentStop': SubagentStopHook
}

export async function createHook(): Promise<AnyHook> {
  const payload = await readStdinJson()
  return createHookFromPayload(payload)
}

export function createHookFromString(jsonString: string): AnyHook {
  const payload = parseJsonString(jsonString)
  return createHookFromPayload(payload)
}

export function createHookFromPayload(payload: HookPayload): AnyHook {
  const eventType = payload.hook_event_name
  const HookClass = eventMap[eventType]
  
  if (!HookClass) {
    throw new Error(`Unknown hook event type: ${eventType}`)
  }
  
  return new HookClass(payload) as AnyHook
}

// Export all classes and types
export {
  Hook,
  ResponseBuilder,
  PreToolUseHook,
  PostToolUseHook,
  NotificationHook,
  StopHook,
  SubagentStopHook,
  HookPayload,
  readStdinJson,
  parseJsonString
}