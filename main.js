var express = require('express');
var app = express();


app.use(express.static('css templates'));


app.get('/', function(req,res){

    res.sendFile(__dirname + "/html templates/boardTemplate.html");
});

app.get('/:page', function(req,res){
    var params = req.params;
    
    if(params.page == '1'){
        res.redirect(`/`);
    }
    else
        res.send('success');
})

app.listen(3000);