import fastify from 'fastify'
import { env } from './env'
import { mealMadeRoutes } from '../routes/mealMade'

const app = fastify()

app.register(mealMadeRoutes, {
  prefix: 'meal',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}`)
  })
