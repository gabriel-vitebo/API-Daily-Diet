import { verify } from 'jsonwebtoken'
import { authConfig } from '../configs/auth'
import { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
    }
  }
}

export function ensureAuthenticate(
  request: FastifyRequest,
  reply: FastifyReply,
  next: () => void,
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({
      error: 'JWT Token invalid',
    })
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: userId } = verify(token, authConfig.jwt.secret) as {
      sub: string
    }

    request.user = {
      id: userId,
    }

    return next()
  } catch (err) {
    return reply.status(401).send({
      error: 'JWT Token invalid',
    })
  }
}
