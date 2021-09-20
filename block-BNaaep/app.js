var http = require('http');
var fs = require('fs');
var url = require('url');

var qs = require('querystring');

var userPath = __dirname +  '/contacts/';

var server  = http.createServer(handleRequest);

function handleRequest(req, res){
    var parsedUrl = url.parse(req.url, true);
    
    var store = "";
     req.on('data', (chunk) => {
        store += chunk;
    });

    req.on('end', () => {

        if(req.method === 'GET' && req.url === '/'){
            res.writeHead(201, {'Content-Type': 'text/html'});
            fs.createReadStream('./index.html').pipe(res); // createReadSream occupies only the memory which has been used 
        }

        else if(req.method === 'GET' && req.url === '/about'){
            res.writeHead(201, {'Content-Type': 'text/html'});
            fs.createReadStream('./about.html').pipe(res); // createReadSream occupies only the memory which has been used 
        }

        else if (req.url.split('.').pop() === 'css') {
            fs.readFile(__dirname + req.url, (err, content) => {
              if (err) return console.log(err);
              res.setHeader('Content-Type', 'text/css');
              res.end(content);
            });
        }

        else if (req.url.split('.').pop() === 'jpg') {
            fs.readFile(__dirname + req.url, (err, content) => {
                if (err) return console.log(err);
                res.setHeader('Content-Type', 'image/jpg');
                res.end(content);
            });
        }

        else if (req.url.split('.').pop() === 'jpeg') {
            fs.readFile(__dirname + req.url, (err, content) => {
                if (err) return console.log(err);
                res.setHeader('Content-Type', 'image/jpeg');
                res.end(content);
            });
        }

        else if (req.url.split('.').pop() === 'png') {
            fs.readFile(__dirname + req.url, (err, content) => {
                if (err) return console.log(err);
                res.setHeader('Content-Type', 'image/png');
                res.end(content);
            });
        }

        else if (req.method === 'GET' && req.url === '/contact') {
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream('./form.html').pipe(res);
        }

        // redering the form 
        else if(req.url === '/form' && req.method === 'GET'){
           res.setHeader('Content-Type', 'text/html');
           fs.createReadStream('./form.html').pipe(res);
        }

        // adding data into the form 
        else if(req.url === '/form' && req.method === 'POST'){
            var parsedData = qs.parse(store);
            res.setHeader('Content-Type','text/html'); // for html response  set some header
            res.write(`<h2>${parsedData.name}</h2>`)
            res.write(`<h3>${parsedData.email}</h3>`)
            res.write(`<h2>${parsedData.username}</h2>`)
            res.write(`<p>${parsedData.Age}</p>`)
            res.write(`<h2>${parsedData.Bio}</h2>`)
            res.end();
        }

        else if(req.url === '/contacts' && req.method === 'POST'){ // POST method simply captured the form data and send it as a html response back to the client
            var username = JSON.parse(store).username;
            
            fs.open( userPath  + username + '.json', 'wx', (err, fd) =>{
                if(err) return console.log(err);

                fs.writeFile(fd, store, (err) => {
                    if(err) return console.log(err);
                    fs.close(fd, () => {
                        res.end(`${username} contacts saved`);
                    })
                })
            })
        }

        else if(parsedUrl.pathname === '/contacts' && req.method === 'GET'){
            var username = parsedUrl.query.username;
            fs.readFile(userPath + username + '.json', (err, content) => {
                
                if(err) return console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(content);
            })
        }

        else {
            res.statusCode = 404;
            res.end(`Page not  found`);
        }
    })
}
             

server.listen(5000, () => {
    console.log('server listening on port 5k');
});
            
