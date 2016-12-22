"use strict";
const crypto = require("crypto");
/**
 * Module variables.
 * @private
 */
const GENERATE_ATTEMPTS = crypto.randomBytes === crypto.pseudoRandomBytes ? 1 : 3;
/**
 * Generates strong pseudo-random bytes.
 *
 * @param {number} size
 * @param {number} attempts
 * @param {function} callback
 * @private
 */
function generateRandomBytes(size, attempts, callback) {
    crypto.randomBytes(size, (err, buf) => {
        if (!err) {
            return callback(null, buf);
        }
        if (!--attempts) {
            return callback(err, null);
        }
        setTimeout(() => { generateRandomBytes(size, attempts, callback); }, 10);
    });
}
/**
 * Generates strong pseudo-random bytes.
 *
 * @param {number} size
 * @param {function} [callback]
 * @return {Promise}
 * @public
 */
function randomBytes(size) {
    return new Promise((resolve, reject) => {
        generateRandomBytes(size, GENERATE_ATTEMPTS, (err, str) => err ? reject(err) : resolve(str));
    });
}
exports.randomBytes = randomBytes;
/**
 * Generates strong pseudo-random bytes sync.
 *
 * @param {number} size
 * @return {Buffer}
 * @public
 */
function randomBytesSync(size) {
    let err = null;
    for (let i = 0; i < GENERATE_ATTEMPTS; i++) {
        try {
            return crypto.randomBytes(size);
        }
        catch (e) {
            err = e;
        }
    }
    throw err;
}
exports.randomBytesSync = randomBytesSync;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    randomBytes,
    randomBytesSync,
};

//# sourceMappingURL=random-bytes.js.map
