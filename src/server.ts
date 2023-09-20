import fastify from 'fastify'
import { env } from './env'
import { mealMadeRoutes } from './routes/mealMade'
import { user } from './routes/user'
import { session } from './routes/session'
import { metrics } from './routes/metrics'

const app = fastify()

app.register(user, {
  prefix: 'user',
})

app.register(session, {
  prefix: 'session',
})

app.register(mealMadeRoutes, {
  prefix: 'meal',
})

app.register(metrics, {
  prefix: 'metrics',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}`)
  })
