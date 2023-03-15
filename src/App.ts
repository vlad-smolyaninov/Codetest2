import express from 'express'
import routes from './routes'
import ErrorHandler from './middleware/ErrorHandler'
import Environment from './lib/Environment'

export default class App {
  public env: Environment
  public express: express.Application

  public constructor() {
    this.env = new Environment()
    this.express = express()
  }

  public init(): void {
    // json body parser
    this.express.use(express.json())

    // register the all routes
    this.express.use('/', routes())

    // Global error handler
    this.express.use(ErrorHandler.handle)

    // Start the server
    this.express.listen(this.env.port)
  }
}
