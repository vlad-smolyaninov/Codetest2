import App from './App'
import Logger from './lib/Logger'

const app: App = new App()
const logger = Logger.getInstance()

app.init().catch((err: Error) => {
  logger.log({
    level: 'error',
    name: err.name,
    message: err.message,
    stack: err.stack,
  })
})
