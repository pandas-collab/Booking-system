exports.up = function(knex) {
  return knex.schema.createTable('hotels', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('country').notNullable();
    table.string('postal_code');
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.string('phone');
    table.string('email');
    table.string('website');
    table.integer('star_rating').defaultTo(0);
    table.decimal('price_per_night', 10, 2);
    table.string('currency', 3).defaultTo('USD');
    table.json('amenities');
    table.json('images');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['city', 'state', 'country']);
    table.index(['latitude', 'longitude']);
    table.index('star_rating');
    table.index('price_per_night');
    table.index('is_active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('hotels');
};