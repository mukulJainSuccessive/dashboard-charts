var express = require('express');
var app = express();
const settings = require('./config/settings');
const port = process.env.PORT || settings.port;

require('./routes.js')(app);
app.listen(port);
console.log("App listening on port " + port);
app.use(express.static('./public'));
