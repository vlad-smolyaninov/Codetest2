import { Request, Response } from 'express'
import { ValidationError } from 'ajv'
import ErrorHandler from '../../../src/middleware/ErrorHandler'
import statusCodes from 'http-status-codes'

describe('ErrorHandler', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
  })

  describe('handle', () => {
    it('should return a 403 error if a validation error occurs', () => {
      const validationError: ValidationError = new ValidationError([{ message: 'Error message' }])
      ErrorHandler.handle(validationError, mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(statusCodes.FORBIDDEN)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'validation failed' })
    })

    it('should return a 500 error for any other error', () => {
      const error = new Error('Internal Server Error')
      ErrorHandler.handle(error, mockRequest as Request, mockResponse as Response, nextFunction)

      expect(mockResponse.status).toHaveBeenCalledWith(statusCodes.INTERNAL_SERVER_ERROR)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' })
    })
  })
})
