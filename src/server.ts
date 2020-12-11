import cluster from 'cluster'
import os from 'os'
import http from 'http'

import app from './app'
if (cluster.isMaster) {
  console.log(`Mater ${process.pid} is running`)
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
  })
} else {
  app.get('/cluster', (req, res) => {
    const worker = cluster.worker.id
    return res.json({ workerId: worker })
  })
  app.listen(3333, () => console.log('Server is running!'))
}
