import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { compare } from 'bcrypt'
import { authConfig } from '../configs/auth'
import { sign } from 'jsonwebtoken'

export async function session(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createSessionBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createSessionBodySchema.parse(request.body)

    const user = await knex('user').where({ email }).first()

    if (!user) {
      return reply.status(401).send({
        error: 'Incorrect email and/or password',
      })
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      return reply.status(401).send({
        error: 'Incorrect email and/or password',
      })
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return reply.status(201).send({ user, token })
  })
}
