module.exports = {
up: async (queryInterface, Sequelize) => {
exports.up = function(knex) {
  return knex.schema.createTable('activities', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('category').notNullable();
    table.integer('destination_id').unsigned().notNullable();
    table.integer('package_id').unsigned().nullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('currency', 3).defaultTo('USD');
    table.integer('duration_minutes').nullable();
    table.string('difficulty_level').nullable();
    table.integer('min_participants').defaultTo(1);
    table.integer('max_participants').nullable();
    table.string('location').nullable();
    table.json('included_items').nullable();
    table.json('excluded_items').nullable();
    table.json('requirements').nullable();
    table.text('cancellation_policy').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.foreign('destination_id').references('id').inTable('destinations').onDelete('CASCADE');
    table.foreign('package_id').references('id').inTable('packages').onDelete('SET NULL');
    
    table.index(['destination_id']);
    table.index(['package_id']);
    table.index(['category']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('activities');
};
},
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Activities");
  }
};
