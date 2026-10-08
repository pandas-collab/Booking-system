module.exports = {
up: async (queryInterface, Sequelize) => {
exports.up = function(knex) {
  return knex.schema.createTable('packages', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('destination_id').unsigned().notNullable();
    table.foreign('destination_id').references('id').inTable('destinations').onDelete('CASCADE');
    table.integer('duration_days').notNullable();
    table.decimal('base_price', 10, 2).notNullable();
    table.decimal('adult_price', 10, 2).notNullable();
    table.decimal('child_price', 10, 2).notNullable();
    table.decimal('infant_price', 10, 2).defaultTo(0);
    table.integer('max_capacity').notNullable();
    table.integer('available_spots').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.json('inclusions');
    table.json('exclusions');
    table.json('itinerary');
    table.string('difficulty_level');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('packages');
};
},
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Packages");
  }
};
