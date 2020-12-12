module.exports = [
  {
    name: "sever",
    cwd: "dist",
    exec_mode: "cluster",
    instances: "max",
    script: "server.js",
    watch: false
  },
  {
    name: "queue",
    cwd: "dist",
    script: "queue.js",
    watch: false
  }
]
