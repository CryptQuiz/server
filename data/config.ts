export const INDEV =
  process.env.NODE_ENV === 'development' || process.env.TS_NODE_DEV === 'true'

export const {
  DB_HOST = 'dpg-ckkkcusl4vmc73alu1sg-a.frankfurt-postgres.render.com',
  DB_PORT = 5432,
  DB_USER = 'crypto_quiz_user',
  DB_PASSWORD = 'E2iBtEstTNGl2sB7m22iohB1gJJa3S7S',
  DB_DATABASE = 'crypto_quiz',
  DB_SSL = true,

  // REDIS_HOST = INDEV ? 'localhost' : 'redis',
  // REDIS_PORT = 6379,
} = process.env

export const Config = {
  port: Number(process.env.PORT) || 32500,
  swagger: {
    swagger: {
      info: {
        title: 'CrytQuiz Backend Swagger',
        description: 'CrytQuiz Backend Swagger API',
        version: '0.1.0',
      },
      tags: [
        { name: 'Default', description: 'Default' },
        { name: 'User', description: 'User' },
      ],
    },
  },
  swaggerUI: {
    routePrefix: '/docs',
  },
  jwtSecret: 'Atesh',
  db: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    ssl: true,
  },
}

export default Config
