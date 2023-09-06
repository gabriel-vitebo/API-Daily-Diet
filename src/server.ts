import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/meal', async () => {
  const createUser = await knex('mealMade').select('*')

  return createUser
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port 3333')
  })
