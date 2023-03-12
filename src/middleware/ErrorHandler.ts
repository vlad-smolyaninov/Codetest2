import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'ajv'
import statusCodes from 'http-status-codes'

class ErrorHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static handle(err: Error | ValidationError, req: Request, res: Response, next: NextFunction): void {
    // Handle validation error
    if (err instanceof ValidationError) {
      res.status(statusCodes.FORBIDDEN).json({ message: err.message })
      return
    }

    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' })
  }
}

export default ErrorHandler
