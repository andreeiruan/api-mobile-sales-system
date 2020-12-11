import Bull from 'bull'
import { redisConfig } from '@config/redis'

import * as Jobs from '../jobs'
import { appLogger } from '@helpers/Logger'

interface IQueue{
  bull: Bull.Queue
  name: string
  handle: (data: any) => Promise<any>
}

export class Queue {
  private static _instance: Queue | null = null
  queues: IQueue[]

  private constructor () {
    this.queues = Object.values(Jobs).map(job => ({
      bull: new Bull(job.key, { redis: redisConfig }),
      name: job.key,
      handle: job.handle
    }))
  }

  static instance (): Queue {
    if (Queue._instance === null) {
      Queue._instance = new Queue()
    }

    return Queue._instance
  }

  add (name: string, data: any) {
    const queue = this.queues.find(queue => queue.name === name)
    return queue.bull.add(data)
  }

  process () {
    return this.queues.forEach(async queue => {
      queue.bull.process(queue.handle)

      queue.bull.on('failed', (job, err) => {
        appLogger.logError({ error: { msg: 'Job failed', err: err.message }, name: job.name, data: job.data })
      })
    })
  }
}
