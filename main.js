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

app.get('/post', function(req, res){
    postId = req.query.id;
    res.send(template.post(req.query.id));
})

app.get('/create', function(req, res){
    res.send(template.inputForm('create'));
})

app.post('/create_process', function(req, res){
    var title = req.body.title;
    var line = req.body.line;

    fs.writeFile(`Data/${title}`, line, function(err){
        if(err){
            console.err(err);
        }
    })

    res.redirect(`/`);
})

app.get('/update', function(req,res){
    if(req.query.id == postId)
        res.send(template.inputForm('update', req.query.id));
    else{
        res.send('잘못된 접근');
    }
})

app.post('/update_process', function(req,res){
    var title = req.body.title;
    var line = req.body.line;

    fs.writeFile(`Data/${title}`, line, function(err){
        if(err){
            console.err(err);
        }
    })

    res.redirect(`/post?id=${title}`);
})

app.get('/delete', function(req,res){
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

app.listen(3000);