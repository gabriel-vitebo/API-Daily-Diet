// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    mealMade: {
      id: string
      name: string
      description?: string
      date: string
      hour: string
      onDiet: boolean
    }
  }
}
