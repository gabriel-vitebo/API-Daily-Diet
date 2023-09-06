import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/test', async () => {
  const test = await knex('user').select('*')

  return test
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port 3333')
  })
