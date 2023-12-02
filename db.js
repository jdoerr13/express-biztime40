/** Database setup for BizTime. */

const { Client } = require("pg");// pg is a library similar to psycopg2 with python

let DB_URI;

// If we're running in test "mode", use our test db
// Make sure to create both databases!
if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///biztime_test";//ALLOW US TO HAVE TWO DIFFERENT DB FOR TESTING
} else {
  DB_URI = "postgresql:///biztime";
}

let db = new Client({//what we imported from PG
  connectionString: DB_URI //NEED to pass in an object to configure it. connectionString is the property name
});

db.connect();

module.exports = db;//import db from some other file