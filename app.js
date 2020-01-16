var express = require('express')

var app =express()

app.listen(3030,function(){
    console.log("server on port 3030");
})

app.use(express.static('public'))
app.use(express.static('style'))

app.get('/',function(request,response){
    response.sendFile(__dirname + "/public/index.html")
})