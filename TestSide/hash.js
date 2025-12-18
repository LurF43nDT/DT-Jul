/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* SHA-256 (FIPS 180-4) implementation in JavaScript (c) Chris Veness 2002-2019             */
/* MIT Licence                                                                             */
/* www.movable-type.co.uk/scripts/sha256.html                                              */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/**
 * SHA-256 hash function reference implementation.
 *
 * This is an annotated direct implementation of FIPS 180-4, without any optimisations. It is
 * intended to aid understanding of the algorithm rather than for production use.
 *
 * While it could be used where performance is not critical, I would recommend using the 'Web
 * Cryptography API' (developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) for the browser,
 * or the 'crypto' library (nodejs.org/api/crypto.html#crypto_class_hash) in Node.js.
 *
 * See csrc.nist.gov/groups/ST/toolkit/secure_hashing.html
 * csrc.nist.gov/groups/ST/toolkit/examples.html
 */
class Sha256 {
    /**
     * Generates SHA-256 hash of string.
     *
     * @param {string} msg - (Unicode) string to be hashed.
     * @param {Object} [options]
     * @param {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
     *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('ff00cc...')
     *   (gets converted to raw bytes).
     * @param {string} [options.outFormat=hex] - Output format: 'hex' for hex string; 'bytes' for
     *   Uint8Array; 'base64' for base64 string.
     * @returns {string|Uint8Array} Hash of msg.
     */
    static hash(msg, options) {
        const defaults = { msgFormat: 'string', outFormat: 'hex' };
        const opt = { ...defaults, ...options };

        // convert string message to raw bytes
        let msgBytes;
        switch (opt.msgFormat) {
            case 'string':
                msgBytes = Sha256.utf8Encode(msg);
                break;
            case 'hex-bytes':
                msgBytes = Sha256.hexBytesToBytes(msg);
                break;
            default: // 'bytes'
                msgBytes = msg;
                break;
        }

        const H = [ // initial hash values (first 32 bits of the fractional parts of the square roots of the first 8 primes 2-19):
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

        // round constants (first 32 bits of the fractional parts of the cube roots of the first 64 primes 2-311):
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b94ca9b, 0x67eaeeea,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

        // PREPROCESSING

        // add padding: single '1' bit + K '0' bits + 64-bit message length (in bits)
        const l = msgBytes.length * 8; // length of message in bits
        msgBytes.push(0x80); // append 0b10000000 (== 0x80), whose first bit is 1
        // M.length is now (n*512 + 448) bits i.e. (n*64 + 56) bytes
        // - if not already multiple of 512 bits, pad with 0s until it is
        while ((msgBytes.length % 64) != 56) msgBytes.push(0x00);
        // append length of message (before padding) in bits as 64-bit big-endian integer
        msgBytes.push(0x00, 0x00, 0x00, 0x00, (l >>> 24) & 0xff, (l >>> 16) & 0xff, (l >>> 8) & 0xff, (l >>> 0) & 0xff);

        // process N-512 bit blocks
        const N = msgBytes.length / 64;
        const M = new Array(N); // message M is N blocks of 16 32-bit words

        for (let i = 0; i < N; i++) {
            M[i] = new Array(16);
            for (let j = 0; j < 16; j++) { // convert each 4 bytes into 32-bit integer
                M[i][j] = (msgBytes[i * 64 + j * 4 + 0] << 24) | (msgBytes[i * 64 + j * 4 + 1] << 16) |
                          (msgBytes[i * 64 + j * 4 + 2] << 8) | (msgBytes[i * 64 + j * 4 + 3] << 0);
            }
        }

        // HASH COMPUTATION

        for (let i = 0; i < N; i++) {
            const W = new Array(64);

            // 1. Prepare message schedule {Wt}:
            for (let t = 0; t < 16; t++) W[t] = M[i][t];
            for (let t = 16; t < 64; t++) {
                W[t] = (Sha256.sigma1(W[t - 2]) + W[t - 7] + Sha256.sigma0(W[t - 15]) + W[t - 16]) >>> 0;
            }

            // 2. Initialize working variables a, b, c, d, e, f, g, h:
            let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

            // 3. For t=0 to 63:
            for (let t = 0; t < 64; t++) {
                const T1 = h + Sha256.Sigma1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
                const T2 = Sha256.Sigma0(a) + Sha256.Maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) >>> 0;
            }

            // 4. Add the compressed chunk to the current hash value:
            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
            H[5] = (H[5] + f) >>> 0;
            H[6] = (H[6] + g) >>> 0;
            H[7] = (H[7] + h) >>> 0;
        }

        // return hash as string of hex values
        switch (opt.outFormat) {
            case 'hex':
                return H.map(h => ('00000000' + h.toString(16)).slice(-8)).join('');
            case 'base64':
                return Sha256.bytesToBase64(Sha256.toUint8Array(H));
            case 'bytes':
                return Sha256.toUint8Array(H);
            default:
                throw new Error('Invalid output format');
        }
    }

    /**
     * Rotates right (circular right shift) a 32-bit word.
     * @private
     */
    static ROTR(n, x) {
        return (x >>> n) | (x << (32 - n));
    }

    /**
     * Logical functions.
     * @private
     */
    static Sigma0(x) { return Sha256.ROTR(2, x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); }
    static Sigma1(x) { return Sha256.ROTR(6, x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); }
    static sigma0(x) { return Sha256.ROTR(7, x) ^ Sha256.ROTR(18, x) ^ (x >>> 3); }
    static sigma1(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x >>> 10); }
    static Ch(x, y, z) { return (x & y) ^ (~x & z); } // 'choice'
    static Maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); } // 'majority'

    /**
     * Encodes multi-byte UTF-8 string to array of bytes.
     * @private
     */
    static utf8Encode(str) {
        return Array.from(new TextEncoder().encode(str)); // TextEncoder is standard in browsers and Node.js
    }

    /**
     * Converts a string of hex bytes to a Uint8Array.
     * @private
     */
    static hexBytesToBytes(hexStr) {
        const bytes = new Uint8Array(hexStr.length / 2);
        for (let i = 0; i < hexStr.length; i += 2) {
            bytes[i / 2] = parseInt(hexStr.substr(i, 2), 16);
        }
        return bytes;
    }

    /**
     * Converts an array of 32-bit integers to a Uint8Array.
     * @private
     */
    static toUint8Array(H) {
        const bytes = new Uint8Array(H.length * 4);
        for (let i = 0; i < H.length; i++) {
            bytes[i * 4 + 0] = (H[i] >>> 24) & 0xff;
            bytes[i * 4 + 1] = (H[i] >>> 16) & 0xff;
            bytes[i * 4 + 2] = (H[i] >>> 8) & 0xff;
            bytes[i * 4 + 3] = (H[i] >>> 0) & 0xff;
        }
        return bytes;
    }

    /**
     * Converts a Uint8Array to a base64 string.
     * @private
     */
    static bytesToBase64(bytes) {
        if (typeof btoa == 'function') return btoa(String.fromCharCode.apply(null, bytes));
        if (typeof Buffer == 'function') return Buffer.from(bytes).toString('base64');
        throw new Error('No base64 encoder available');
    }
}
