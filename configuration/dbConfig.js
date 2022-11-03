

// // const { Pool, Client } = require('pg')
// // const pool = new Pool({
// //   user: 'postgres',
// //   host: 'localhost',
// //   database: 'postgres',
// //   password: 'int@123',
// //   port: 5432,
// // })
// // pool.query('SELECT NOW()', (err, res) => {
// // //   console.log(err, res)
// //   pool.end()
// // })

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'int@123',
//   port: 5432
// })
// client
//   .connect()
//   .then(() => console.log("connected to the database"))
//   .catch((err) => console.log("err==>", err.message));
// module.exports = client;
// // const client = new Client({
// //   user: 'dbuser',
// //   host: 'database.server.com',
// //   database: 'mydb',
// //   password: 'secretpassword',
// //   port: 3211,
// // })
// // client.connect()
// // client.query('SELECT NOW()', (err, res) => {
// //   console.log(err, res)
// //   client.end()
// // })



const Promise = require("bluebird");
const Config = require("./config");
const initOptions = {
  promiseLib: Promise,
  query(e) {
    // console.log(e.query); // SATYAJIT
  },
  error(error, e) {
    if (e.cn) {
      console.log("CN:", e.cn);
      console.log("EVENT:", error.message || error);
    }
  },
};
const pgp = require("pg-promise")(initOptions);

const cn = {
  host: Config.db.host, // 'localhost' is the default;
  port: Config.db.port, // 5432 is the default;
  database: Config.db.database,
  user: Config.db.user,
  password: Config.db.password,
};

pgp.pg.types.setTypeParser(1114, (s) => s);

const db = pgp(cn); 

db.connect()
  .then((obj) => {
    obj.done();
     console.log("db connection established");
  })
  .catch((error) => {
    console.log("ERROR:", error.message || error);
  });

module.exports = db;

