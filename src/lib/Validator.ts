import validatorAdapter, { ValidateFunction, ValidationError, ValidatorAdapter } from './ValidatorAdapter'

type SchemaMap = { [key: string]: ValidateFunction }

class Validator {
  private validator: ValidatorAdapter
  private readonly schemaMap: SchemaMap
  constructor() {
    this.validator = validatorAdapter
    this.schemaMap = {}
  }

  public addSchema(key: string, schema: object): void {
    this.schemaMap[key] = this.validator.compile(schema)
  }

  public validate(key: string, data: unknown): void {
    const validate = this.schemaMap[key]

    if (!validate) {
      throw new Error(`Schema with key '${key}' not found`)
    }

    if (!validate(data)) {
      throw new ValidationError(validate.errors || [])
    }
  }
}

export default Validator
