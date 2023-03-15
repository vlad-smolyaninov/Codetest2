import Ajv, { ValidateFunction, ValidationError, JSONSchemaType } from 'ajv'

export { ValidateFunction, ValidationError, JSONSchemaType }
export class ValidatorAdapter {
  private static instance: ValidatorAdapter | null = null
  private readonly ajv: Ajv

  private constructor() {
    this.ajv = new Ajv()
  }

  public static getInstance(): ValidatorAdapter {
    if (!ValidatorAdapter.instance) {
      ValidatorAdapter.instance = new ValidatorAdapter()
    }
    return ValidatorAdapter.instance
  }

  public compile(schema: object): ValidateFunction {
    return this.ajv.compile(schema)
  }
}

export default ValidatorAdapter.getInstance()
