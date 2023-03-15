export interface ILogObject {
  level: 'info' | 'error'
  name: string
  message: string
  stack?: string
}

export class Logger {
  private static instance: Logger

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public log(logData: ILogObject) {
    console.log(logData)
  }
}

export default Logger.getInstance()
