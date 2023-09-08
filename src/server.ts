import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/meal', async () => {
  const createUser = await knex('mealMade').select('*')

  return createUser
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}`)
  })
