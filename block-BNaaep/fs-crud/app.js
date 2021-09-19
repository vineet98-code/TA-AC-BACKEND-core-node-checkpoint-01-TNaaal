var http = require('http');
var fs = require('fs');
var url = require('url');


var server  = http.createServer(handleRequest);

var qs = require('querystring');

function handleRequest(req, res){
    
    var store = "";

    req.on('data', (chunk) => {
        store += chunk;
    })
    req.on('end', () => {
        if(req.url === '/contact' && req.method === 'GET'){ // GET method simply redered the form 
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream('./form.html').pipe(res);
        }
        if(req.url === '/form' && req.method === 'POST'){ // POST method simply captured the form data and send it as a html response back to the client
            var parsedData = qs.parse(store);
            fs.open()
            
        }
    })
}

server.listen(5000, () => {
    console.log('server listening on port 5k');
})