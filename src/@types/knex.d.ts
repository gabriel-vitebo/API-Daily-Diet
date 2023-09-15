// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    mealMade: {
      id: string
      user_id: string
      name: string
      description?: string
      date: string
      hour: string
      onDiet: boolean
      created_at: string
    }

    user: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
    }
  }
}
