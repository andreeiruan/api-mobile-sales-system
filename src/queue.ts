import 'dotenv/config'
import { Queue } from './app/providers/Queue'

const queue = Queue.instance()
queue.process()
