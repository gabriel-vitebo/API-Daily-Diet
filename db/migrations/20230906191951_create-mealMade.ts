import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('mealMade', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('user.id')
    table.text('name').notNullable()
    table.text('description')
    table.decimal('date', 10, 2).notNullable()
    table.decimal('hour', 10, 2).notNullable()
    table.boolean('onDiet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('mealMade')
}
