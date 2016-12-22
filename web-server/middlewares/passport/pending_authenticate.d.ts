/**
 * Authenticates requests.
 *
 * Applies the `name`ed strategy (or strategies) to the incoming request, in
 * order to authenticate the request.  If authentication is successful, the user
 * will be logged in and populated at `req.user` and a session will be
 * established by default.  If authentication fails, an unauthorized response
 * will be sent.
 *
 * Options:
 *   - `session`          Save login state in session, defaults to _true_
 *   - `successRedirect`  After successful login, redirect to given URL
 *   - `failureRedirect`  After failed login, redirect to given URL
 *   - `assignProperty`   Assign the object provided by the verify callback to given property
 *
 * An optional `callback` can be supplied to allow the application to overrride
 * the default manner in which authentication attempts are handled.  The
 * callback has the following signature, where `user` will be set to the
 * authenticated user on a successful authentication attempt, or `false`
 * otherwise.  An optional `info` argument will be passed, containing additional
 * details provided by the strategy's verify callback.
 *
 *     app.get('/protected', function(req, res, next) {
 *       passport.authenticate('local', function(err, user, info) {
 *         if (err) { return next(err) }
 *         if (!user) { return res.redirect('/signin') }
 *         res.redirect('/account');
 *       })(req, res, next);
 *     });
 *
 * Note that if a callback is supplied, it becomes the application's
 * responsibility to log-in the user, establish a session, and otherwise perform
 * the desired operations.
 *
 * Examples:
 *
 *     passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
 *
 *     passport.authenticate('basic', { session: false });
 *
 *     passport.authenticate('twitter');
 *
 * @param {String|Array} name
 * @param {Object} options
 * @param {Function} callback
 * @return {Function}
 * @api public
 */
export default function authenticate(passport: any, name: any, options: any, callback: any): (req: any, res: any) => Promise<{}>;
