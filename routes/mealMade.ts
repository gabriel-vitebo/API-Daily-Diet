import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../src/database'
import { randomUUID } from 'crypto'

export async function mealMadeRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      hour: z.string(),
      onDiet: z.boolean(),
    })

    const { name, description, date, hour, onDiet } =
      createMealBodySchema.parse(request.body)

    await knex('mealMade').insert({
      id: randomUUID(),
      name,
      description,
      date,
      hour,
      onDiet,
    })

    return reply.status(201).send()
  })
}
