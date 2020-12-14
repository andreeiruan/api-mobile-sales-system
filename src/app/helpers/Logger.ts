import { AwsS3 } from '@providers/AwsS3'
import winston from 'winston'

class AppLogger {
  private readonly _awsS3: AwsS3
  private logger: winston.Logger
  private readonly _optionsLog = {
    file: {
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false
    }
  }

  constructor (awsS3: AwsS3) {
    this._awsS3 = awsS3
  }

  logInfo (data: any) {
    this.logger = winston.createLogger({
      defaultMeta: { date: new Date().toLocaleString() },
      transports: [
        new winston.transports.File({ filename: `${__dirname}/../../temp/logs/info.log`, ...this._optionsLog.file })
      ]
    })

    this.logger.info(data)
    if (process.env.NODE_ENV === 'production') {
      this._awsS3.uploadObj(`${__dirname}/../../temp/logs/info.log`, process.env.BUCKET_LOGS)
    }
  }

  logError (data: any) {
    this.logger = winston.createLogger({
      defaultMeta: { date: new Date().toLocaleString() },
      transports: [
        new winston.transports.File({ filename: `${__dirname}/../../temp/logs/error.log`, ...this._optionsLog.file })
      ]
    })

    this.logger.error(data)
    if (process.env.NODE_ENV === 'production') {
      this._awsS3.uploadObj(`${__dirname}/../../temp/logs/error.log`, process.env.BUCKET_LOGS)
    }
  }

  logJobError (data: any) {
    this.logger = winston.createLogger({
      defaultMeta: { date: new Date().toLocaleString() },
      transports: [
        new winston.transports.File({ filename: `${__dirname}/../../temp/logs/jobError.log`, ...this._optionsLog.file })
      ]
    })

    this.logger.error(data)
    if (process.env.NODE_ENV === 'production') {
      this._awsS3.uploadObj(`${__dirname}/../../temp/logs/error.log`, process.env.BUCKET_LOGS)
    }
  }

  logWarn (data: any) {
    this.logger = winston.createLogger({
      defaultMeta: { date: new Date().toLocaleString() },
      transports: [
        new winston.transports.File({ filename: `${__dirname}/../../temp/logs/warn.log`, ...this._optionsLog.file })
      ]
    })
    this.logger.warn(data)
    if (process.env.NODE_ENV === 'production') {
      this._awsS3.uploadObj(`${__dirname}/../../temp/logs/warn.log`, process.env.BUCKET_LOGS)
    }
  }
}

const appLogger = new AppLogger(new AwsS3())

export { appLogger }
