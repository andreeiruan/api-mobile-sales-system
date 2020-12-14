import cluster from 'cluster'
import os from 'os'

import app from './app'

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }

  cluster.on('exit', () => {
    cluster.fork()
  })
} else {
  app.get('/cluster', (req, res) => {
    const worker = cluster.worker.id
    return res.json({ workerId: worker })
  })
  app.listen(3333, () => console.log('Server is running!'))
}
