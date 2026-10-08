exports.up = function(knex) {
  return knex.schema.createTable('flights', function(table) {
    table.increments('id').primary();
    table.string('flight_number').notNullable();
    table.string('airline').notNullable();
    table.string('departure_airport', 10).notNullable();
    table.string('arrival_airport', 10).notNullable();
    table.datetime('departure_time').notNullable();
    table.datetime('arrival_time').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('aircraft_type');
    table.integer('available_seats').notNullable();
    table.integer('total_seats').notNullable();
    table.string('status').defaultTo('scheduled');
    table.json('amenities');
    table.timestamps(true, true);

    // Indexes for search optimization
    table.index(['departure_airport', 'arrival_airport'], 'idx_flights_route');
    table.index(['departure_time'], 'idx_flights_departure_time');
    table.index(['arrival_time'], 'idx_flights_arrival_time');
    table.index(['airline'], 'idx_flights_airline');
    table.index(['flight_number'], 'idx_flights_number');
    table.index(['price'], 'idx_flights_price');
    table.index(['status'], 'idx_flights_status');
    table.index(['available_seats'], 'idx_flights_available_seats');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('flights');
};