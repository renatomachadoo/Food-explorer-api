exports.up = knex => knex.schema.createTable('favorite_dishes', table => {
    table.increments('id')

    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id').onDelete('CASCADE');

    table.integer('dish_id').unsigned().notNullable();
    table.foreign('dish_id').references('dishes.id').onDelete('CASCADE');
  
    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  });
  
  exports.down = knex => knex.schema.dropTable("favorite_dishes");
  