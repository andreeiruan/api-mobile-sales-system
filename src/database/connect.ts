import { createConnection } from 'typeorm'
import { config } from '@config/database'

createConnection(config)
