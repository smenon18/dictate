var pg = require('pg');
var connectionString = 'jsb:test@localhost:5432/dictate';

var client = new pg.Client(connectionString);

/**
 * User
 * id SERIAL
 * username VARCHAR(32)
 * pass VARCHAR(128)
 * salt VARCHAR(8)
 */

var reset = 'drop schema public cascade; create schema public; ';

var user = 'CREATE TABLE user (id SERIAL PRIMARY KEY, ' +
            'username VARCHAR(32) NOT NULL UNIQUE, ' +
				    'pass VARCHAR(128) NOT NULL, ' +
				    'salt VARCHAR(8) NOT NULL);';

var query = client.query(reset + user);
query.on('end', function() {
  client.end();
});
