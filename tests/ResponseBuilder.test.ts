import { describe, it, expect, vi } from 'vitest'
import { ResponseBuilder } from '../src/core/ResponseBuilder'

describe('ResponseBuilder', () => {
  it('should build approve response', () => {
    const builder = new ResponseBuilder()
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    const mockStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    try {
      builder.approve('Test approval').continue()
    } catch (e) {
      // Expected - process.exit() throws in tests
    }

    expect(mockStdout).toHaveBeenCalledWith(
      JSON.stringify({
        response: {
          decision: 'approve',
          reason: 'Test approval',
          continue: true
        }
      }, null, 2)
    )

    mockExit.mockRestore()
    mockStdout.mockRestore()
  })

  it('should build block response', () => {
    const builder = new ResponseBuilder()
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
    const mockStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    try {
      builder.block('Test block reason').continue()
    } catch (e) {
      // Expected - process.exit() throws in tests
    }

    expect(mockStdout).toHaveBeenCalledWith(
      JSON.stringify({
        response: {
          decision: 'block',
          reason: 'Test block reason',
          continue: true
        }
      }, null, 2)
    )

    mockExit.mockRestore()
    mockStdout.mockRestore()
  })

  it('should chain methods fluently', () => {
    const builder = new ResponseBuilder()
    const result = builder
      .approve('Test')
      .suppressOutput()
      .merge({ custom: 'value' })

    expect(result).toBeInstanceOf(ResponseBuilder)
  })
})