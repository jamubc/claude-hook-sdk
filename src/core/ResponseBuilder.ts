export class ResponseBuilder {
  private data: Record<string, any> = {}
  private exitCode: number = 0

  approve(reason?: string): this {
    this.data.decision = 'approve'
    if (reason) {
      this.data.reason = reason
    }
    return this
  }

  block(reason: string): this {
    this.data.decision = 'block'
    this.data.reason = reason
    return this
  }

  suppressOutput(): this {
    this.data.suppress_output = true
    return this
  }

  merge(fields: Record<string, any>): this {
    Object.assign(this.data, fields)
    return this
  }

  continue(): never {
    this.data.continue = true
    this.send()
  }

  stop(reason: string): never {
    this.data.continue = false
    this.data.reason = reason
    this.exitCode = 1
    this.send()
  }

  private send(): never {
    const output = {
      response: this.data
    }
    
    process.stdout.write(JSON.stringify(output, null, 2))
    process.exit(this.exitCode)
  }
}