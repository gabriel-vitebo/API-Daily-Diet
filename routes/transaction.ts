import { FastifyInstance } from 'fastify'
import { knex } from '../src/database'
import { randomUUID } from 'crypto'

export async function mealMadeRoutes(app: FastifyInstance) {
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
}
