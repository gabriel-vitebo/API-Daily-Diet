import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { ensureAuthenticate } from '../middleware/ensureAuthenticate'

export async function mealMadeRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [ensureAuthenticate],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        hour: z.string(),
        onDiet: z.boolean(),
      })

      const { name, description, date, hour, onDiet } =
        createMealBodySchema.parse(request.body)

      const userId = request.user?.id

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
          user_id: userId,
        })
      } else {
        throw new Error(
          'please check that all data is in the correct format, remembering that the date can be in the format "dd/mm/yyyy", "dd.mm.yyyy", "dd-mm-yyyy" or "dd_mm_yy" and the time hh:mm (hours from 00 to 23 and minutes from 00 to 59)',
        )
      }

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    {
      preHandler: [ensureAuthenticate],
    },
    async (request, reply) => {
      const userId = request.user?.id

      const mealMade = await knex('mealMade').select().where('user_id', userId)

      return reply.status(201).send({ mealMade })
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [ensureAuthenticate],
    },
    async (request, reply) => {
      const getMealMadeParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const userId = request.user?.id

      const { id } = getMealMadeParamsSchema.parse(request.params)

      const uniqueMealMade = await knex('mealMade').where('id', id).first()

      if (uniqueMealMade?.user_id !== userId) {
        return reply.status(401).send({
          error: 'You are not authorized to view the item',
        })
      }

      return reply.status(201).send({ uniqueMealMade })
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [ensureAuthenticate],
    },
    async (request, reply) => {
      const updateMealMadeParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const updateMealMadeBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        hour: z.string(),
        onDiet: z.boolean(),
      })

      const { id } = updateMealMadeParamsSchema.parse(request.params)
      const { name, description, date, hour, onDiet } =
        updateMealMadeBodySchema.parse(request.body)

      const userId = request.user?.id

      const verifyMeal = await knex('mealMade').where('id', id).first()

      if (verifyMeal?.user_id !== userId) {
        return reply.status(401).send({
          error: 'you do not have permission to update this meal',
        })
      }

      await knex('mealMade').where({ id }).update({
        name,
        description,
        date,
        hour,
        onDiet,
      })

      return reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [ensureAuthenticate],
    },
    async (request, reply) => {
      const deleteIdParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = deleteIdParamsSchema.parse(request.params)
      const userId = request.user?.id

      const verifyMeal = await knex('mealMade').where('id', id).first()

      if (verifyMeal?.user_id !== userId) {
        return reply.status(401).send({
          error: 'you do not have permission to update this meal',
        })
      }
      await knex('mealMade').where({ id }).delete()

      return reply.status(201).send()
    },
  )
}
