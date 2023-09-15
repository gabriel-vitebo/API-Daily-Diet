import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('mealMade', (table) => {
    table.text('user_id').references('user.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('mealMade')
}
