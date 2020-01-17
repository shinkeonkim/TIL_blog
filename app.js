const express = require('express')
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const hljs = require('highlight.js')
const md = require('markdown-it') ({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: "lanuage-",
    linkify: true,
    typographer: true,
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre class="hljs"><code>' +
              hljs.highlight(lang, str, true).value +
              "</code></pre>"
            );
          } catch (__) {}
        }
    
        return (
          '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
        );
      }
});

var app =express()

var postDirectoryPath = path.join(__dirname + "/posts")
var postFiles = fs.readdirSync(postDirectoryPath)

getHtmlFileName = file => {
    return file.slice(0,file.indexOf(".")).toLowerCase();
}

const deployDir = '/deploy';
if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir);
}
const deployFiles = [];


const articleHtmlFormat = fs.readFileSync(
    "./views/article_format.ejs",
    "utf8"
)

const postHtmlFormat = fs.readFileSync(
    "./views/post_format.ejs",
    "utf8"
)


app.listen(3030,function(){
    console.log("server on port 3030");
})

app.use(express.static('deploy'))
app.use(express.static('public'))
app.use(express.static('style'))
app.use(express.static('node_modules'))

app.get('/',function(request,response){
    response.sendFile(__dirname + "/public/index.html")
    
})





postFiles.map(file => {
    const body = fs.readFileSync(`./posts/${file}`,"utf8");
    const convertBody = md.render(body);
    const articleHtml = ejs.render(articleHtmlFormat, {
        body: convertBody
    })
    
    const postHtml = ejs.render(postHtmlFormat,{
        title: "happykoa",
        content: articleHtml
    });
    const fileName = getHtmlFileName(file);
    fs.writeFileSync(`./deploy/${fileName}.html`,postHtml);
    deployFiles.push(fileName); 
});