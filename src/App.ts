import express from 'express'
import http from 'http'
import routes from './routes'
import ErrorHandler from './middleware/ErrorHandler'
import Environment from './lib/Environment'

export default class App {
  public env: Environment
  public express: express.Application

  public httpServer: http.Server

  public constructor() {
    this.env = new Environment()
    this.express = express()
    this.httpServer = http.createServer(this.express)
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
