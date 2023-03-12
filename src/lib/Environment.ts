import dotenv from 'dotenv'

interface IEnvironment {
  port: number
}

class Environment implements IEnvironment {
  public port: number

  constructor() {
    dotenv.config()

    this.port = Number(process.env.PORT) || 8888
  }
}

export default Environment
