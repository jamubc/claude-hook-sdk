import { describe, it, expect } from 'vitest'
import { spawn } from 'child_process'
import { join } from 'path'

describe('Integration Tests', () => {
  it('should handle Notification hook via CLI', async () => {
    const testPayload = {
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'Notification',
      message: 'Test message',
      title: 'Test title'
    }

    const result = await runCLI(JSON.stringify(testPayload))
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('response')
    expect(result.stdout).toContain('decision')
    expect(result.stdout).toContain('approve')
  })

  it('should handle PreToolUse hook via deterministic router', async () => {
    const testPayload = {
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'PreToolUse',
      tool_name: 'Read',
      tool_input: { files: ['small-file.txt'] }
    }

    const result = await runRouter(JSON.stringify(testPayload))
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('response')
    expect(result.stdout).toContain('continue')
  })

  it('should route large operations to Gemini CLI', async () => {
    const testPayload = {
      session_id: 'test-session',
      transcript_path: '/tmp/test.jsonl',
      hook_event_name: 'PreToolUse',
      tool_name: 'Read',
      tool_input: { files: ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'] } // > 3 files
    }

    const result = await runRouter(JSON.stringify(testPayload))
    
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('delegate')
    expect(result.stdout).toContain('gemini-cli')
  })
})

async function runCLI(input: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn('node', [join(__dirname, '../dist/cli.js')], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      resolve({ exitCode: code || 0, stdout, stderr })
    })

    child.stdin.write(input)
    child.stdin.end()
  })
}

async function runRouter(input: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn('node', [join(__dirname, '../dist/hooks/deterministic-router.js')], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      resolve({ exitCode: code || 0, stdout, stderr })
    })

    child.stdin.write(input)
    child.stdin.end()
  })
}