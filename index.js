let express = require("express");
let app = express();
let server = require("http").Server(app);
console.log("SERVER STARTED");

//game
app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/html/index.html");
});

server.listen(8080);
console.log("SERVER LISTENING ON PORT 8080. OPEN http://localhost:8080 IN YOUR BROWSER");