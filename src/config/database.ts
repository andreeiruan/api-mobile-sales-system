import 'dotenv/config'
import path from 'path'

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env

const commonConfig = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB
  // logging: true
}

const srcConfig = {
  entities: [
    'src/app/entities/*.ts'
  ],
  migrations: [
    'src/database/migrations/*.ts'
  ],
  cli: {
    migrationsDir: 'src/database/migrations'
  }
}

const distConfig = {
  entities: [
    'dist/app/entities/*.js'
  ],
  migrations: [
    'dist/database/migrations/*.js'
  ],
  cli: {
    migrationsDir: 'dist/database/migrations'
  }
}

let envConfig: any
if (path.basename(__filename).includes('.ts')) {
  envConfig = srcConfig
} else {
  envConfig = distConfig
}

const config = {
  ...commonConfig,
  ...envConfig
}

export { config }
