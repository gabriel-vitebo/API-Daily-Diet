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

    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i

    if (emailRegex.test(email)) {
      await knex('user').insert({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
      })
    } else {
      return reply.status(401).send({
        error: 'Algo deu errado, verifique se o email é valido',
      })
    }

    return reply.status(201).send()
  })
}
