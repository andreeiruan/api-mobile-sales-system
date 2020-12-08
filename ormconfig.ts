import 'dotenv/config'

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env

export = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [
    'src/app/enities/*{.ts,.js}'
  ],
  migrations: [
    'src/database/migrations/*.ts'
  ],
  cli: {
    migrationsDir: 'src/database/migrations'
  }
}
