exports.up = knex => knex.schema.createTable('ingredients', table => {
  table.increments('id');
  table.text('name').notNullable();
  
  table.integer('dish_id').unsigned().notNullable();
  table.foreign('dish_id').references('dishes.id').onDelete('CASCADE');

  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('ingredients');
