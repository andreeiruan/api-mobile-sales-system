import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'

export class AwsS3 {
  // @ts-ignore
  private readonly s3:AWS.S3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: process.env.DEFAULT_REGION,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  })

  uploadObj (file: string, bucket: string) {
    const fileStream = fs.createReadStream(file)
    fileStream.on('error', (err) => {
      console.debug(`File Error ${err}`)
    })
    const uploadParams = {
      Bucket: bucket, Key: path.basename(file), Body: fileStream
    }

    this.s3.upload(uploadParams, (err) => {
      if (err) {
        console.debug('Error on upload object to s3 ')
      }
    })
  }
}
