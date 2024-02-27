var express = require('express');
var app = express();

var template = require('./template');

// app 구축

app.use(express.static('css templates'));
app.use(express.static('Data'));


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
    var id = req.query.id;

    res.send(template.post(id));
})


app.listen(3000);