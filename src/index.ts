import App from './App'
import logger from './lib/Logger'

const app: App = new App()

try {
  app.init()
} catch (err: unknown) {
  if (err instanceof Error)
    logger.log({
      level: 'error',
      name: err.name,
      message: err.message,
      stack: err.stack,
    })
}
