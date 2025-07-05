import { describe, it, expect } from 'vitest'
import { createHookFromString, PreToolUseHook, PostToolUseHook, NotificationHook, StopHook, SubagentStopHook } from '../src/index'

describe('Hook Factory', () => {
  it('should create PreToolUseHook from JSON string', () => {
    const json = JSON.stringify({
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'PreToolUse',
      tool_name: 'Read',
      tool_input: { file_path: '/test/file.txt' }
    })

    const hook = createHookFromString(json)
    expect(hook).toBeInstanceOf(PreToolUseHook)
    expect(hook.eventName()).toBe('PreToolUse')
    expect((hook as PreToolUseHook).toolName()).toBe('Read')
  })

  it('should create PostToolUseHook from JSON string', () => {
    const json = JSON.stringify({
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'PostToolUse',
      tool_name: 'Write',
      tool_input: { file_path: '/test/file.txt' },
      tool_response: { success: true }
    })

    const hook = createHookFromString(json)
    expect(hook).toBeInstanceOf(PostToolUseHook)
    expect(hook.eventName()).toBe('PostToolUse')
    expect((hook as PostToolUseHook).toolName()).toBe('Write')
    expect((hook as PostToolUseHook).toolResponse('success')).toBe(true)
  })

  it('should create NotificationHook from JSON string', () => {
    const json = JSON.stringify({
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'Notification',
      message: 'Test message',
      title: 'Test title'
    })

    const hook = createHookFromString(json)
    expect(hook).toBeInstanceOf(NotificationHook)
    expect(hook.eventName()).toBe('Notification')
    expect((hook as NotificationHook).message()).toBe('Test message')
    expect((hook as NotificationHook).title()).toBe('Test title')
  })

  it('should create StopHook from JSON string', () => {
    const json = JSON.stringify({
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'Stop',
      stop_hook_active: true
    })

    const hook = createHookFromString(json)
    expect(hook).toBeInstanceOf(StopHook)
    expect(hook.eventName()).toBe('Stop')
    expect((hook as StopHook).stopHookActive()).toBe(true)
  })

  it('should create SubagentStopHook from JSON string', () => {
    const json = JSON.stringify({
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'SubagentStop',
      stop_hook_active: false
    })

    const hook = createHookFromString(json)
    expect(hook).toBeInstanceOf(SubagentStopHook)
    expect(hook.eventName()).toBe('SubagentStop')
    expect((hook as SubagentStopHook).stopHookActive()).toBe(false)
  })

  it('should throw error for unknown hook event type', () => {
    const json = JSON.stringify({
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'UnknownEvent'
    })

    expect(() => createHookFromString(json)).toThrow('Unknown hook event type: UnknownEvent')
  })

  it('should throw error for missing required fields', () => {
    const json = JSON.stringify({
      hook_event_name: 'PreToolUse'
    })

    expect(() => createHookFromString(json)).toThrow('Missing session_id in input data')
  })
})