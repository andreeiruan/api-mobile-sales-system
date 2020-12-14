declare namespace Express {
  export interface Request {
    loggedId?: string
    io?: SocketIO
  }
}
