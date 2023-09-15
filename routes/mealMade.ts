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

    const regexDate =
      /^(0[1-9]|[12][0-9]|3[01])[./\-_](0[1-9]|1[0-2])[./\-_]\d{4}$/g

    const regexTime = /^([01]\d|2[0-3]):[0-5]\d$/g

    if (regexDate.test(date) && regexTime.test(hour)) {
      await knex('mealMade').insert({
        id: randomUUID(),
        name,
        description,
        date,
        hour,
        onDiet,
      })
    } else {
      throw new Error(
        'please check that all data is in the correct format, remembering that the date can be in the format "dd/mm/yyyy", "dd.mm.yyyy", "dd-mm-yyyy" or "dd_mm_yy" and the time hh:mm (hours from 00 to 23 and minutes from 00 to 59)',
      )
    }

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const mealMade = await knex('mealMade').select()

    return { mealMade }
  })

  app.get('/:id', async (request) => {
    const getMealMadeParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealMadeParamsSchema.parse(request.params)

    const mealMade = await knex('mealMade').where('id', id).first()

    return { mealMade }
  })
}
