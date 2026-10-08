module.exports = {
up: async (queryInterface, Sequelize) => {
exports.up = function(knex) {
  return knex.schema.createTable('reviews', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('booking_id').unsigned().nullable();
    table.integer('package_id').unsigned().nullable();
    table.integer('rating').notNullable();
    table.text('comment').nullable();
    table.string('title').nullable();
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_approved').defaultTo(false);
    table.boolean('is_featured').defaultTo(false);
    table.timestamp('moderated_at').nullable();
    table.integer('moderated_by').unsigned().nullable();
    table.text('moderation_notes').nullable();
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('booking_id').references('id').inTable('bookings').onDelete('CASCADE');
    table.foreign('package_id').references('id').inTable('packages').onDelete('CASCADE');
    table.foreign('moderated_by').references('id').inTable('users').onDelete('SET NULL');

    table.check('?? >= 1 AND ?? <= 5', ['rating', 'rating']);
    table.check('?? IS NOT NULL OR ?? IS NOT NULL', ['booking_id', 'package_id']);

    table.index(['user_id']);
    table.index(['booking_id']);
    table.index(['package_id']);
    table.index(['rating']);
    table.index(['is_approved']);
    table.index(['is_featured']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reviews');
};
},
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Reviews");
  }
};
