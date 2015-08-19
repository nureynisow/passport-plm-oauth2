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

passport.use('plm',new PLMStrategy({
    'authorizationURL'	: 'https://plm.math.cnrs.fr/sp/oauth/authorize',
    'tokenURL'			: 'https://plm.math.cnrs.fr/sp/oauth/token',
    'clientID'			: 'de8284c6c7ed17712008e612ef26712934bc34516574ddbc3276957ec71a8442',
    'clientSecret'		: '156fa63b3458b2ab7c73e07a8d89d57e2e473b518f0ed0e92306639b04db9c05',   
    'callbackURL'		: 'https://localhost:3000/auth/plm/callback'
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
