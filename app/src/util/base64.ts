export interface Base64Options {
  readonly urlSafe?: boolean;
}

/**
 * Encode a Uint8Array to a base 64 string.
 *
 * @param array Input byte array.
 * @param urlSafe If set to true, output will be URL safe according to RFC 4648 (with `+` and `/`
 *   replaced by `-` and `_`).
 * @returns A base64 string.
 */
export function u8aToBase64(
  array: Uint8Array,
  options?: Base64Options,
): string {
  const base64 = btoa(
    Array.from(array, (byte) => String.fromCharCode(byte)).join(""),
  );
  if (options?.urlSafe === true) {
    return base64.replaceAll("+", "-").replaceAll("/", "_");
  }
  return base64;
}

/**
 * Decode a base 64 string into a Uint8Array.
 *
 * @param base64String Input base64 string to be decoded.
 * @returns Output byte array.
 */
export function base64ToU8a(base64String: string): Uint8Array {
  let decoded;
  try {
    decoded = atob(base64String);
  } catch (error) {
    throw new Error(`Failed to decode base64 string: ${error}`);
  }
  const array = new Uint8Array(decoded.length);
  for (let index = 0; index < decoded.length; ++index) {
    array[index] = decoded[index].charCodeAt(0);
  }
  return array;
}
