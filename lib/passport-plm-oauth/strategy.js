/**
 * Module dependencies.
 */

var util = require('util')
  , OAuthStrategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The PLM authentication strategy authenticates requests by delegating to
 * PLM CAS using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to PLM
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which PLM will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new PLMStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/PLM/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.tokenURL = options.tokenURL || 'https://plm.math.cnrs.fr/sp/oauth/token';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://plm.math.cnrs.fr/sp/oauth/authorize';
  options.sessionKey = options.sessionKey || '$';

  OAuthStrategy.call(this, options, verify);
  this.name = 'plm';
  this._profileFields = options.profileFields || null;
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Authenticate request by delegating to PLM using OAuth.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req) {
  // When a user denies authorization on PLM, they are presented with a
  // link to return to the application in the following format:
  //
  //     http://www.example.com/auth/PLM/callback?oauth_problem=user_refused
  //
  // Following the link back to the application is interpreted as an
  // authentication failure.
  if (req.query && req.query.oauth_problem) {
    return this.fail();
  }
  
  // Call the base class for standard OAuth authentication.
  OAuthStrategy.prototype.authenticate.call(this, req);
}

/**
 * Retrieve user profile from PLM.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `uid`
 *   - `email`
 *   - `extra_info`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  var url =  'https://plm.math.cnrs.fr/sp/me'
  this._oauth2.get(url, token, tokenSecret);
}


module.exports = Strategy;