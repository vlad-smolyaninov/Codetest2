import Ajv, { ValidateFunction, ValidationError } from 'ajv'

type SchemaMap = { [key: string]: ValidateFunction }

class Validator {
  private ajv: Ajv
  private readonly schemaMap: SchemaMap

  constructor() {
    this.ajv = new Ajv()
    this.schemaMap = {}
  }

  public addSchema(key: string, schema: object): void {
    this.schemaMap[key] = this.ajv.compile(schema)
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
