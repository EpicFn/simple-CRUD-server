const express = require('express');
const app = express();

const template = require('./template');
const fs = require('fs');

// app 구축

app.use(express.static('css templates'));
app.use(express.static('Data'));

app.use(express.urlencoded({extended: true}));


app.get('/', function(req,res){
    res.send(template.board(1));
});

app.get('/board', function(req,res){
    var pageNum = req.query.page;

    
    if(pageNum == '1'){
        res.redirect(`/`);
    }
    else{
        res.send(template.board(Number(pageNum)));
    }
})

app.get('/post', function(req, res){
    res.send(template.post(req.query.id));
})

app.get('/create', function(req, res){
    res.send(template.create());
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

app.listen(3000);