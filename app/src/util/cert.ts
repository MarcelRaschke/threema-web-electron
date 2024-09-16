import {BinaryLike, createHash, X509Certificate} from "node:crypto";

/**
 * Calculate the SPKI public key fingerprint (Base64-encoded) for the given
 * certificate (DER or PEM encoded).
 *
 * See https://datatracker.ietf.org/doc/html/rfc7469#section-2.4
 */
export function spkiFingerprint(
  certificate: BinaryLike,
  algorithm: "sha256",
): Uint8Array {
  const publicKey = extractPublicKey(certificate);
  return createHash(algorithm).update(publicKey).digest();
}

/**
 * Extract the DER-encoded SPKI public key from the given certificate (DER or
 * PEM encoded).
 */
function extractPublicKey(certificate: BinaryLike): Uint8Array {
  const x509 = new X509Certificate(certificate);
  return x509.publicKey.export({
    type: "spki",
    format: "der",
  });
}
