import { FastifyInstance } from 'fastify'
import { ensureAuthenticate } from '../middleware/ensureAuthenticate'
import { knex } from '../database'

export async function metrics(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [ensureAuthenticate],
    },
    async (request, reply) => {
      const userId = request.user?.id

      const allMealRegister = await knex('mealMade')
        .select()
        .where('user_id', userId)

      const allMealOnDiet = await knex('mealMade')
        .select('onDiet')
        .where('user_id', userId)

      const countMealsOnDiet = allMealOnDiet.filter(
        (meal) => Number(meal.onDiet) === 1,
      ).length

      const countMealsOutOfDiet = allMealOnDiet.filter(
        (meal) => Number(meal.onDiet) === 0,
      ).length

      return reply.status(201).send({
        allMealRegister: allMealRegister.length,
        mealOnDiet: countMealsOnDiet,
        mealOutDiet: countMealsOutOfDiet,
      })
    },
  )
}
