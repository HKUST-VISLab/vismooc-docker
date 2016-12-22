/**
 * promisify()
 *
 * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) -- into
 * an ES6-compatible Promise. Promisify provides a default callback of the form (error, result)
 * and rejects when `error` is truthy. You can also supply settings object as the second argument.
 *
 * @param {function} originalFunc - The function to promisify
 * @param {object} options - Settings object
 * @param {object} options.thisArg - A `this` context to use. If not set, assume `settings` _is_ `thisArg`
 * @param {bool} options.multiArgs - Should multiple arguments be returned as an array?
 * @return {function} A promisified version of `originalFunc`
 */
export default function promisify(originalFunc: any, options?: IPromisifyOptions): (...args: any[]) => Promise<{}>;
export interface IPromisifyOptions {
    thisArg: Object;
}
