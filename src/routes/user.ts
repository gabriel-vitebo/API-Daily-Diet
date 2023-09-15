import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { hash } from 'bcrypt'

export async function user(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const hashedPassword = await hash(password, 8)

    // verificar se o email é valido com a regex

    await knex('user').insert({
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
    })

    return reply.status(201).send()

    // criar uma rota para autentificar o usuario com token
  })
}
