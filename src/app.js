const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require('https');
const http = require('http');
const console = require("JrModules/jrConsole");
const fs = require("fs-extra");

const siteBuilder = require("./modules/siteBuilder").load();




let options = null;
if(true){ // if testing at home with laptop running test server
    console.test("Test mode");
    isTestMode = true;
}else{
    options = {
        cert: fs.readFileSync('fullchain.pem'),
        key: fs.readFileSync('privkey.pem')
    }
}




/***********************************************************
** Server Setup
************************************************************/

// setup the express server
const app = express();
app.use(bodyParser.json({limit: '8mb'}));

// Allows access to the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true , limit: '8mb'}));

// Build the routing
for(let pageData of siteBuilder.options.pages){
    // Build the page
    pageData.page = new siteBuilder.page(pageData);

    app.route(`/${pageData.link}`).get((req, res) => {

        // Remove me
        pageData.page.reload();
    
        res.type('.html');
        res.send(pageData.page.build());
    });
}




/***********************************************************
** Run Server
************************************************************/

// Create the Https server
https.createServer(options, app).listen(443);

// Create the http server
if(isTestMode){
    console.log("Starting server on port 80");
    http.createServer(app).listen(80);
}else{
    console.log("Forwarding 80 to 443");
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80);
}

console.log('Server started!');

