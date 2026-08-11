export interface LicenseIdCandidate {
  id?: string;
}

export function getNextLicenseId(existingLicenses: LicenseIdCandidate[] = []): string {
  const numericSuffixes = existingLicenses
    .map((license) => license?.id)
    .filter((value): value is string => typeof value === "string")
    .map((id) => {
      const match = /^lic-(\d+)$/.exec(id.trim());
      return match ? Number(match[1]) : null;
    })
    .filter((value): value is number => value !== null);

  const highest = numericSuffixes.length > 0 ? Math.max(...numericSuffixes) : 1110;
  return `lic-${highest + 1}`;
}

export function ensureUniqueLicenseId(
  requestedId: string | undefined,
  existingLicenses: LicenseIdCandidate[] = []
): string {
  const trimmed = requestedId?.trim();
  const existingIds = new Set(
    existingLicenses
      .map((license) => license?.id)
      .filter((value): value is string => typeof value === "string")
      .map((id) => id.trim())
  );

  if (trimmed && !existingIds.has(trimmed)) {
    return trimmed;
  }

  return getNextLicenseId(existingLicenses);
}
