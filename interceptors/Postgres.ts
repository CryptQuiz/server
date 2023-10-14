import fs from 'fs'
import { FastifyInstance } from 'fastify'
import Config, { INDEV } from '../data/config'
import Pgp from 'pg-promise'
import { spawn } from 'child_process'
import process from 'node:process'

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
  receive: ((data: any[], result: any, ctx: any) => {
    const camelised = cameliseColumnNames1(data)
    if (camelised) {
      result.rows = camelised
    }

    // result.rows = cameliseColumnNames1(data)
  }) as any,
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
  if (INDEV && !process.env.DB_HOST) {
    const ssh = spawn('ssh', [
      '-p 64022',
      '-NTM',
      'root@172.104.253.64',
      '-L',
      '5432:pmc_postgres:5432',
      // '-L',
      // '6379:tfb_v3_redis:6379',
    ])

    await new Promise<void>((resolve) => {
      ssh.stdout.on('end', () => {
        console.table({
          DEV_SSH_FORWARD: 'Connected',
        })
        resolve()
      })
    })

    const exitHandler = (options, exitCode) => {
      console.log('Killing SSH tunnel...')
      ssh.kill(9)
      // if (options.cleanup) {
      //   console.log('cleaning up')
      // }
      // if (exitCode || exitCode === 0) console.log(exitCode)
      if (options.exit) process.exit()
    }

    // do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }))

    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }))

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }))
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }))

    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }))
  }

  const pg = (app.pg = pgInstance())
}

export default Postgres
