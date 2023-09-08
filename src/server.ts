import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { randomUUID } from 'crypto'

const app = fastify()

app.get('/meal', async () => {
  await knex('mealMade')
    .insert({
      id: randomUUID(),
      name: 'test',
      description: 'teste tambem',
      date: 10,
      hour: 30,
      onDiet: false,
    })
    .returning('*')
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}`)
  })
