var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'jsb:test@localhost:5432/dictate';

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
                    
var contact = 'CREATE TABLE contact (' +
                'user1 serial NOT NULL, ' +
                'user2 serial NOT NULL, ' +
                'PRIMARY KEY(user1,user2), ' +
                'FORIEGN KEY(user1) REFERENCES user(id), ' +
                'FORIEGN KEY(user2) REFERENCES user(id));'

var query = client.query(reset + user + contact);
query.on('end', function() {
  client.end();
});
