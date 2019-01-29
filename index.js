//console.log('Hello World');
/*windows.alert('Hello World');
document.write('Hello World');
innerHTML='HELLO WORLD';*/

//depoendencies

var http = require ('http');
var https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
var config = require ('./config');
var fs = require('fs');
const _data = require('./lib/data');

//Testing
//@TODO delete this

 _data.read('test', 'newFile', function (err){
  console.log('this was the error', err);
});



//The server should  respond to all request with a string
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);

});

httpServer.listen (config.httpPort, function(){
  console.log ("Server is listened on port "  +config.httpPort+  "  mode");
});


//initiate HTTPS Server
var httpsServerOptions ={
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function(req,res){
  unifiedServer(req,res);

});


//HTTps server
httpsServer.listen (config.httpsPort, function(){
  console.log ("Server is listened on port "  +config.httpsPort+ "  mode");
});

//

//All server logic for http and https server:

var unifiedServer = function (req,res) {

  var parsedUrl = url.parse(req,url,true);
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  var queryStringObject = parsedUrl.query;

  //Http method
  var method = req.method.toLowerCase();

  //get the header as object;
  var headers =req.headers;


  //payload if any
  var decoder = new StringDecoder('utf-8');
  var buffer ='';
  req.on ('data', function (data){
    buffer +=decoder.write(data);
  });
  req.on('end', function () {
    buffer +=decoder.end();
  });

  var choseHandler = typeof (router [trimmedPath]) !=='undefined' ? router [trimmedPath] : handler.notFound;
  //construct data queryStringObject
  var data = {
    'trimmedPath' : trimmedPath,
    'queryStringObject':queryStringObject,
    'method':method,
    'headers':headers,
    'payload':buffer
  };
  choseHandle(data, function (statusCode, payload){
    statusCode=typeof(statusCode) == 'number' ? statusCode:  200;

    //the payload calledback

    payload = typeof(payload) == 'object' ? payload : {};

    //convert the payload to a string
    var payloadString = JSON.stringify(payload);

   //return response
   res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end('Hello world\n');

    console.log('Request received with these headers', headers);
  });

};


//Define a handler
var handlers = {

};

//sample handler

handlers.ping = function (data,callback) {
//callback a http status
callback(200);
};

handlers.notFound = function(data,callback) {
callback(404);
};

//define router
var router = {
    'ping': handlers.ping
};
