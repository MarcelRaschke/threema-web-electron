/**
 * Returns whether two {@link Uint8Array}s are equal to each other.
 */
export function byteEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
}
