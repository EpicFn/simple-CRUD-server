var mysql      = require('mysql2');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '583327',
    database : 'simple_crud'
});

connection.connect();


for(var i=15; i<19; i++){
    connection.query(`INSERT INTO posts(title, description, created_time, writter) VALUES ('ex${i}','example${i}', NOW(), 'MUN')`, function (error, results, fields) {
        if (error) throw error;
    });
}


connection.end();