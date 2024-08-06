import mysql from 'mysql'
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0911947299Aa",
  database: 'user'
});
export default con