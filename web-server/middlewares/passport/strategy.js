"use strict";
const util = require("util");
const OAuth2Strategy = require("passport-oauth2");
const InternalOAuthError = require("passport-oauth2").InternalOAuthError;
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || "https://learn2.hkmooc.hk/oauth2/authorize/";
    options.tokenURL = options.tokenURL || "https://learn2.hkmooc.hk/oauth2/access_token/";
    options.scopeSeparator = options.scopeSeparator || " ";
    options.customHeaders = options.customHeaders || {};
    if (!options.customHeaders["User-Agent"]) {
        options.customHeaders["User-Agent"] = options.userAgent || "passport-edx";
    }
    OAuth2Strategy.call(this, options, verify);
    this.name = "provider";
    this._userProfileURL = options.userProfileURL || "https://learn2.hkmooc.hk/oauth2/user_info";
    this._oauth2.useAuthorizationHeaderforGET(true);
    const self = this;
    const oauth2getOAuthAccessToken = this._oauth2.getOAuthAccessToken;
    this._oauth2.getOAuthAccessToken = (code, params, callback) => {
        oauth2getOAuthAccessToken.call(self._oauth2, code, params, (err, accessToken, refreshToken, param) => {
            if (err) {
                return callback(err);
            }
            if (!accessToken) {
                return callback({
                    statusCode: 400,
                    data: JSON.stringify(param),
                });
            }
            callback(null, accessToken, refreshToken, param);
        });
    };
}
exports.Strategy = Strategy;
// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);
Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get(this._userProfileURL, accessToken, (err, body, res) => {
        let json;
        if (err) {
            if (err.data) {
                try {
                    json = JSON.parse(err.data);
                }
                catch (_) {
                    console.warn(_);
                }
            }
            if (json && json.message) {
                return done(new InternalOAuthError(json.message));
            }
            return done(new InternalOAuthError("Failed to fetch user profile", err));
        }
        try {
            json = JSON.parse(body);
        }
        catch (ex) {
            return done(new Error("Failed to parse user profile"));
        }
        let profile = {
            provider: "provider",
            _raw: body,
            _json: json,
            emails: json.email,
            id: json.email,
            username: json.preferred_username,
            sub: json.sub,
            administrator: json.administrator,
            locale: json.locale,
            name: json.name,
            given_name: json.given_name,
        };
        done(null, profile);
    });
};

//# sourceMappingURL=strategy.js.map
