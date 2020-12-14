import 'dotenv/config'
import { Queue } from './app/providers/Queue'
import cluster from 'cluster'
import os from 'os'

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }

  cluster.on('exit', () => {
    cluster.fork()
  })
} else {
  const queue = Queue.instance()
  queue.process()
  console.log('Queue processing')
}
