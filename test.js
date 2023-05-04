console.log("ça marche");

import mysql from "mysql";

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: "4306",
  database: "blog",
});
test;

//const myQuery = "SELECT * FROM `testRomain` WHERE id= '1' "

//const myQuery = "INSERT INTO `testRomain` (id, title, surname) VALUES (null, 'toto', 'popopo') ";

const myQuery = "UPDATE `testRomain` SET title = 'laurette' WHERE id = '2'";

connection.connect(function (err) {
  connection.query(myQuery, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(JSON.stringify(result));

    connection.end();
  });
});
