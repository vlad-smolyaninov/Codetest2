import { ValidationError } from 'ajv'
import Validator from '../../../src/lib/Validator'

describe('Validator', () => {
  let validator: Validator

  beforeEach(() => {
    validator = new Validator()
  })

  describe('addSchema', () => {
    it('should add the schema to the schema map', () => {
      const schemaKey = 'test1'
      const schema = { type: 'string' }

      validator.addSchema(schemaKey, schema)

      expect(Object.keys(validator['schemaMap'])).toContain(schemaKey)
    })
  })

  describe('validate', () => {
    it('should throw an error if the schema is not found', () => {
      const schemaKey = 'test2'
      const data = 'test'

      expect(() => validator.validate(schemaKey, data)).toThrowError(`Schema with key '${schemaKey}' not found`)
    })

    it('should throw a validation error if the data is invalid', () => {
      const schemaKey = 'test3'
      const data = 123
      const schema = { type: 'string' }

      validator.addSchema(schemaKey, schema)

      expect(() => validator.validate(schemaKey, data)).toThrowError(ValidationError)
    })

    it('should not throw an error if the data is valid', () => {
      const schemaKey = 'test4'
      const data = 'test'
      const schema = { type: 'string' }

      validator.addSchema(schemaKey, schema)

      expect(() => validator.validate(schemaKey, data)).not.toThrowError()
    })
  })
})
