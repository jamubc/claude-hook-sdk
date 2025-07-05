#!/usr/bin/env node
import { createHook, PreToolUseHook } from '../index'
import { statSync } from 'fs'

async function main() {
  try {
    const hook = await createHook()

    if (hook instanceof PreToolUseHook) {
      const args = hook.toolInput()
      const files = Array.isArray(args.files) ? args.files : []
      
      // Calculate total file size
      let totalSize = 0
      for (const file of files) {
        try {
          const stats = statSync(file)
          totalSize += stats.size
        } catch (error) {
          // Skip files that can't be read
        }
      }
      
      const estimatedTokens = hook.estimatedTokens()
      const maxFileSize = 10 * 1024 * 1024 // 10MB
      const maxFiles = 3
      const maxTokens = 50000

      // Check thresholds
      if (files.length > maxFiles || totalSize > maxFileSize || estimatedTokens > maxTokens) {
        hook.response()
          .approve('Routing to Gemini CLI')
          .merge({ delegate: 'gemini-cli' })
          .continue()
        return
      }
    }

    // Default: continue with original tool
    hook.response().continue()
  } catch (error) {
    console.error('Error in deterministic router:', error)
    process.exit(2)
  }
}

main()