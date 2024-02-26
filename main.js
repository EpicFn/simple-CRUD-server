var express = require('express');
var app = express();

var template = require('./template');

// app 구축

app.use(express.static('css templates'));

app.get('/', function(req,res){
    res.send(template.board(1));
});

app.get('/:page', function(req,res){
    var params = req.params;
    
    if(params.page == '1'){
        res.redirect(`/`);
    }
    else{
        res.send(template.board(Number(params.page)));
    }
})

app.listen(3000);