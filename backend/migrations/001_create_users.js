module.exports = {
up: async (queryInterface, Sequelize) => {
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username', 50).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100);
    table.string('last_name', 100);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('email_verified_at');
    table.timestamp('last_login_at');
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['username']);
    table.index(['is_active']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
},
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  }
};
