import { AwsS3 } from '@providers/AwsS3'
import winston from 'winston'

class AppLogger {
  private readonly _optionsInfo = {
    file: {
      filename: `${__dirname}/../../temp/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      colorize: false
    }
  }

  private readonly _awsS3: AwsS3

  private readonly logger: winston.Logger
  constructor (awsS3: AwsS3) {
    this._awsS3 = awsS3
    this.logger = winston.createLogger({
      defaultMeta: { date: new Date().toLocaleString() },
      transports: [
        new winston.transports.File(this._optionsInfo.file)
      ]
    })
  }

  logInfo (data: any) {
    this.logger.info(data)
    if (process.env.NODE_ENV === 'production') {
      this._awsS3.uploadObj(this._optionsInfo.file.filename, process.env.BUCKET_LOGS)
    }
  }

  logError (data: any) {
    this.logger.error(data)
    if (process.env.NODE_ENV === 'production') {
      this._awsS3.uploadObj(this._optionsInfo.file.filename, process.env.BUCKET_LOGS)
    }
  }

  logWarn (data: any) {
    this.logger.warn(data)
    if (process.env.NODE_ENV === 'production') {
      this._awsS3.uploadObj(this._optionsInfo.file.filename, process.env.BUCKET_LOGS)
    }
  }
}

const appLogger = new AppLogger(new AwsS3())

export { appLogger }
