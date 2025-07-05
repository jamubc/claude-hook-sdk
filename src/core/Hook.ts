import { readFileSync, existsSync } from 'fs'
import { ResponseBuilder } from './ResponseBuilder'
import { HookPayload } from '../utils/stdin-json'

export abstract class Hook {
  protected data: HookPayload
  protected sessionId: string
  protected transcriptPath: string
  protected response_data: Record<string, any> = {}
  private responseInstance: ResponseBuilder | null = null

  constructor(data: HookPayload) {
    this.data = data
    this.sessionId = data.session_id
    this.transcriptPath = data.transcript_path
  }

  getSessionId(): string {
    return this.sessionId
  }

  getTranscriptPath(): string {
    return this.transcriptPath
  }

  getRawData(): HookPayload {
    return this.data
  }

  transcript(): any[] {
    if (!existsSync(this.transcriptPath)) {
      return []
    }

    try {
      const content = readFileSync(this.transcriptPath, 'utf8')
      const lines = content.trim().split('\n')
      const result: any[] = []

      for (const line of lines) {
        if (line.trim()) {
          try {
            result.push(JSON.parse(line))
          } catch (error) {
            // Skip invalid JSON lines
          }
        }
      }

      return result
    } catch (error) {
      return []
    }
  }

  toJson(): string {
    return JSON.stringify(this.data, null, 2)
  }

  response(): ResponseBuilder {
    if (!this.responseInstance) {
      this.responseInstance = new ResponseBuilder()
    }
    return this.responseInstance
  }

  error(message: string): never {
    process.stderr.write(message + '\n')
    process.exit(2)
  }

  success(message: string = ''): never {
    if (message) {
      process.stdout.write(message + '\n')
    }
    process.exit(0)
  }

  abstract eventName(): string
}