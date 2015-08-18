module.exports = function (app,passport) {

	app.get('/',function (req,res) {
		res.send('Success');
	});
	app.get('/login',function (req,res) {
		res.send('failure');
	});
	
	app.get('/auth/plm',passport.authenticate('plm'));
	app.get('/auth/plm/callback',passport.authenticate('plm',{failureRedirect : '/login'},
		function (req,res) {
			console.log(req.body,res);
	}));
}