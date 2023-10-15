import fs from 'fs'
import { FastifyInstance } from 'fastify'
import Config, { INDEV } from '../data/config'
import Pgp from 'pg-promise'

declare module 'fastify' {
  interface FastifyInstance {
    pg: any
  }
}

function cameliseColumnNames1(data) {
  const tmp = data[0]
  for (let prop in tmp) {
    const camel = pgp.utils.camelize(prop)
    if (!(camel in tmp)) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        d[camel] = d[prop]
        delete d[prop]
      }
    }
  }

  return data
}

// pg-promise
const pgp = Pgp({
  capSQL: true,
  receive: (e) => {
    const data = e.data
    const result = e.result as any
    const camelised = cameliseColumnNames1(data)
    if (camelised) {
      result.rows = camelised
    }
  },
})

// pg-promise connection
export const pg = pgp(Config.db)

export const pgInstance = () => {
  if (pg) {
    return pg
  }

  return pgp(Config.db)
}

export const Postgres = async function (app: FastifyInstance) {
  const pg = (app.pg = pgInstance())

  if (pg && fs.existsSync('dist/data/migrations') && INDEV) {
  }
}

export default Postgres
