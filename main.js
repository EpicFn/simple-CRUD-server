const express = require('express');
const app = express();

const template = require('./template');
const fs = require('fs');

var postId = null;

const DB_meta_Data = {
    host     : 'localhost',
    user     : 'root',
    password : '583327',
    database : 'simple_crud'
};



// app 구축

app.use(express.static('css templates'));
app.use(express.static('Data'));

app.use(express.urlencoded({extended: true}));


app.get('/', async function(req,res){
    postId = null;

    try {
        res.send(await template.board(1, DB_meta_Data));
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send('Internal Server Error');
    }
    
});

app.get('/board', async function(req,res){
    var pageNum = req.query.page;
    postId = null;
    
    if(pageNum == '1'){
        res.redirect(`/`);
    }
    else{
        try {
            res.send(await template.board(Number(pageNum), DB_meta_Data));
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).send('Internal Server Error');
        }
    }
})

app.get('/post', async function(req, res){
    postId = req.query.id;
    res.send(await template.post(req.query.id, DB_meta_Data));
})

app.get('/create', async function(req, res){
    res.send(await template.inputForm('create'));
})

app.post('/create_process', async function(req, res){
    

    var mysql = require('mysql2/promise');
    try {
        // MySQL 연결 설정
        const DB = await mysql.createConnection({
            host     : DB_meta_Data.host,
            user     : DB_meta_Data.user,
            password : DB_meta_Data.password,
            database : DB_meta_Data.database
        });
    
        // 쿼리 실행
        var query = `INSERT INTO posts(title, description, created_time, writter)
                    VALUES (?, ?, NOW(), ?)`;
        var [posts] = await DB.execute(query, [req.body.title, req.body.description, req.body.writter]);
                
    
        // MySQL 연결 종료
        await DB.end();
    } catch (error) {
        console.error('Error:', error);
        return '';
    }

    res.redirect(`/`);
})

app.get('/update', async function(req,res){
    if(req.query.id == postId)
        res.send(await template.inputForm('update', req.query.id, DB_meta_Data));
    else{
        res.send('잘못된 접근');
    }
})

app.post('/update_process', async function(req,res){
    
    var mysql = require('mysql2/promise');
    try {
        // MySQL 연결 설정
        const DB = await mysql.createConnection({
            host     : DB_meta_Data.host,
            user     : DB_meta_Data.user,
            password : DB_meta_Data.password,
            database : DB_meta_Data.database
        });
    
        // 쿼리 실행
        var query = `UPDATE posts
                    SET title = ?, description = ?, writter = ?
                    WHERE id = ?`
        var [posts] = await DB.execute(query, 
            [req.body.title, req.body.description, req.body.writter, req.body.id]);
                
        // MySQL 연결 종료
        await DB.end();
    } catch (error) {
        console.error('Error:', error);
        return '';
    }

    res.redirect(`/post?id=${req.body.id}`);
})

app.get('/delete', async function(req,res){
    if(req.query.id == postId){
        fs.unlink(`Data/${req.query.id}`, function (err) {
            if (err) throw err;
        });

        res.redirect(`/`);
    }
    else{
        res.send('잘못된 접근');
    }

    
})


app.post('/delete', function(req,res){
    if(req.body.id == postId){
        var mysql = require('mysql2');
        var DB = mysql.createConnection({
            host : DB_meta_Data.host,
            user : DB_meta_Data.user,
            password : DB_meta_Data.password,
            database : DB_meta_Data.database
        });
        DB.connect();

        DB.query(`DELETE FROM posts WHERE id = ?`,[req.body.id], function(err, result){
            if(err) throw err;
            res.redirect(`/`);
        });
        
    }
    else{
        res.send('잘못된 접근');
    }
})

app.listen(3000);