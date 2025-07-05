#!/usr/bin/env node
import { createHook } from './index'

async function main() {
  try {
    const hook = await createHook()
    
    // Default behavior: continue with approval
    hook.response().approve('Hook processed successfully').continue()
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error')
    process.exit(2)
  }
}

main()