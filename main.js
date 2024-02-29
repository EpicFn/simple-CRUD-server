const express = require('express');
const app = express();

const template = require('./template');
const fs = require('fs');

var postId = null;

// app 구축

app.use(express.static('css templates'));
app.use(express.static('Data'));

app.use(express.urlencoded({extended: true}));


app.get('/', function(req,res){
    postId = null;
    res.send(template.board(1));
});

app.get('/board', function(req,res){
    var pageNum = req.query.page;
    postId = null;
    
    if(pageNum == '1'){
        res.redirect(`/`);
    }
    else{
        res.send(template.board(Number(pageNum)));
    }
})

app.get('/post', function(req, res){
    postId = req.query.id;
    console.log(postId);
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