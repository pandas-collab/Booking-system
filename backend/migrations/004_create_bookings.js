module.exports = {
up: async (queryInterface, Sequelize) => {
exports.up = function(knex) {
  return knex.schema.createTable('bookings', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('package_id').unsigned().notNullable();
    table.enum('status', ['pending', 'confirmed', 'cancelled', 'completed']).defaultTo('pending');
    table.date('booking_date').notNullable();
    table.integer('number_of_people').unsigned().notNullable().defaultTo(1);
    table.decimal('total_amount', 10, 2).notNullable();
    table.text('special_requirements');
    table.string('contact_phone');
    table.string('emergency_contact');
    table.timestamps(true, true);
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('package_id').references('id').inTable('packages').onDelete('CASCADE');
    
    table.index(['user_id']);
    table.index(['package_id']);
    table.index(['status']);
    table.index(['booking_date']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bookings');
};
},
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Bookings");
  }
};
