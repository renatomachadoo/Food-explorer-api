exports.up = knex => knex.schema.createTable('dishes', table => {
  table.increments('id');
  table.text('name').notNullable();
  table.text('description').notNullable();
  table.text('image');
  table.decimal('price', 8, 2).defaultTo(0.00);
  
  table.integer('category_id').unsigned().notNullable();
  table.foreign('category_id').references('categories.id');

  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('dishes');
