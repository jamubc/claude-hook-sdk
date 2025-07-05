import { stdin } from 'process'

export interface HookPayload {
  session_id: string
  transcript_path: string
  hook_event_name: string
  [key: string]: any
}

export async function readStdinJson(): Promise<HookPayload> {
  return new Promise((resolve, reject) => {
    let data = ''
    
    stdin.setEncoding('utf8')
    
    stdin.on('data', (chunk) => {
      data += chunk
    })
    
    stdin.on('end', () => {
      try {
        const parsed = JSON.parse(data)
        
        if (!parsed.session_id) {
          throw new Error('Missing session_id in input data')
        }
        
        if (!parsed.transcript_path) {
          throw new Error('Missing transcript_path in input data')
        }
        
        if (!parsed.hook_event_name) {
          throw new Error('Missing hook_event_name in input data')
        }
        
        resolve(parsed as HookPayload)
      } catch (error) {
        if (error instanceof SyntaxError) {
          reject(new Error(`Invalid JSON data provided: ${error.message}`))
        } else {
          reject(error)
        }
      }
    })
    
    stdin.on('error', (error) => {
      reject(new Error(`Error reading stdin: ${error.message}`))
    })
  })
}

export function parseJsonString(jsonString: string): HookPayload {
  try {
    const parsed = JSON.parse(jsonString)
    
    if (!parsed.session_id) {
      throw new Error('Missing session_id in input data')
    }
    
    if (!parsed.transcript_path) {
      throw new Error('Missing transcript_path in input data')
    }
    
    if (!parsed.hook_event_name) {
      throw new Error('Missing hook_event_name in input data')
    }
    
    return parsed as HookPayload
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON data provided: ${error.message}`)
    } else {
      throw error
    }
  }
}