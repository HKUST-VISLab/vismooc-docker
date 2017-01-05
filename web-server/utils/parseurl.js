"use strict";
const url_1 = require("url");
/**
 * Pattern for a simple path case.
 * See: https://github.com/joyent/node/pull/7878
 */
const simplePathRegExp = /^(\/\/?(?!\/)[^\?#\s]*)(\?[^#\s]*)?$/;
/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @api public
 */
function parseurl(req) {
    let url = req.url;
    if (url === undefined) {
        // URL is undefined
        return undefined;
    }
    let parsed = req._parsedUrl;
    if (fresh(url, parsed)) {
        // Return cached URL parse
        return parsed;
    }
    // Parse the URL
    parsed = fastparse(url);
    parsed._raw = url;
    return req._parsedUrl = parsed;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseurl;
;
/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @api public
 */
function originalurl(req) {
    let url = req.originalUrl;
    if (typeof url !== "string") {
        // Fallback
        return parseurl(req);
    }
    let parsed = req._parsedOriginalUrl;
    if (fresh(url, parsed)) {
        // Return cached URL parse
        return parsed;
    }
    // Parse the URL
    parsed = fastparse(url);
    parsed._raw = url;
    return req._parsedOriginalUrl = parsed;
}
exports.originalurl = originalurl;
;
/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @api private
 */
function fastparse(str) {
    // Try fast path regexp
    // See: https://github.com/joyent/node/pull/7878
    const simplePath = typeof str === "string" && simplePathRegExp.exec(str);
    // Construct simple URL
    if (simplePath) {
        const pathname = simplePath[1];
        const search = simplePath[2] || null;
        const url = {};
        url.path = str;
        url.href = str;
        url.pathname = pathname;
        url.search = search;
        url.query = search && search.substr(1);
        return url;
    }
    return url_1.parse(str);
}
/**
 * Determine if parsed is still fresh for url.
 *
 * @param {string} url
 * @param {object} parsedUrl
 * @return {boolean}
 * @api private
 */
function fresh(url, parsedUrl) {
    return typeof parsedUrl === "object"
        && parsedUrl !== null
        && parsedUrl instanceof url.Url
        && parsedUrl._raw === url;
}

//# sourceMappingURL=parseurl.js.map
