var		 express = require('express')
		,passport = require('passport')
		,util = require('util')
		,session = require('express-session')
		,PLMStrategy = require('passport-plm-oauth2').Strategy

passport.serializeUser(function (user,done) {
	done(null,user);
});

passport.deserializeUser(function (obj,done) {
	done(null,obj);
});

passport.use(new PLMStrategy({
	'authorizationURL'	: '----',
    'tokenURL'			: '----',
    'clientID'			: '----',
    'clientSecret'		: '----',
    'callbackURL'		: '----'
},function (token,secretToken,profile,done) {
	process.nextTick(function () {
		console.log(">>",util.inspect(profile,false,null));
		done(null,profile);
	});
}));

var fs 		= require('fs');
var options = {
	key	: fs.readFileSync('certs/server.key','utf8'),
	cert: fs.readFileSync('certs/server.crt','utf8')
};


var app = express();
var port = 3000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var https = require('https');
var server = https.createServer(options,app);

app.set('view engine','ejs');
app.use(session({secret:'$'}));
app.use(passport.initialize());
app.use(passport.session());
require('./routes')(app,passport);
server.listen(port);
console.log('listening on '+port);