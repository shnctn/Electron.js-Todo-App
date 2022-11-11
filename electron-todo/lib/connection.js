// const { pg } = require('pg')
// const connection= pg.createConnection({
//     host:"localhost",
//     user:"postgres",
//     password:"0508",
//     database:"todo",
//     port:"5433"
// });

// connection.connect();

// module.exports={
//     db:connection
// }


var pg = require('pg');
var conString = "pg://postgres:0508@localhost:5433/todo";
var client = new pg.Client(conString);
client.connect();
module.exports={
    db : client
}