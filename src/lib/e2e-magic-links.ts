const e2eVerificationLinks = new Map<string, string>();

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

export function recordE2EVerificationLink(email: string, url: string) {
  e2eVerificationLinks.set(normalizeEmail(email), url);
}

export function getE2EVerificationLink(email: string) {
  return e2eVerificationLinks.get(normalizeEmail(email)) ?? null;
}

export function clearE2EVerificationLink(email: string) {
  e2eVerificationLinks.delete(normalizeEmail(email));
}
