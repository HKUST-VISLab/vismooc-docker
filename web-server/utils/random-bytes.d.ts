/// <reference types="node" />
/**
 * Generates strong pseudo-random bytes.
 *
 * @param {number} size
 * @param {function} [callback]
 * @return {Promise}
 * @public
 */
export declare function randomBytes(size: number): Promise<{}>;
/**
 * Generates strong pseudo-random bytes sync.
 *
 * @param {number} size
 * @return {Buffer}
 * @public
 */
export declare function randomBytesSync(size: number): Buffer;
declare var _default: {
    randomBytes: (size: number) => Promise<{}>;
    randomBytesSync: (size: number) => Buffer;
};
export default _default;
