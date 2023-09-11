import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('mealMade', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description')
    table.date('date').notNullable()
    table.time('hour').notNullable()
    table.boolean('onDiet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('mealMade')
}
