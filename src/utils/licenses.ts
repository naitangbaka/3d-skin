import spdxLicenseListFull from 'spdx-license-list/full';
import packageJson from '../../package.json';
import packageLock from '../../package-lock.json';

interface LicenseEntry {
  name: string;
  version: string;
  license: string;
  licenseText: string;
}

const DEP_NAMES: string[] = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.devDependencies ?? {}),
];

function resolveLicenseText(spdxId: string): string {
  const entry = spdxLicenseListFull[spdxId];
  return entry?.licenseText ?? '';
}

function parseLockfile(): LicenseEntry[] {
  const packages = (packageLock as { packages?: Record<string, { version?: string; license?: string }> }).packages ?? {};
  const result: LicenseEntry[] = [];

  for (const depName of DEP_NAMES) {
    const lockKey = `node_modules/${depName}`;
    const pkg = packages[lockKey];
    if (!pkg) continue;

    const spdxId = pkg.license ?? '';
    const text = resolveLicenseText(spdxId);

    result.push({
      name: depName,
      version: pkg.version ?? '',
      license: spdxId,
      licenseText: text,
    });
  }

  // Sort: direct deps first, then dev deps
  const directSet = new Set(Object.keys(packageJson.dependencies ?? {}));
  result.sort((a, b) => {
    const aDirect = directSet.has(a.name) ? 0 : 1;
    const bDirect = directSet.has(b.name) ? 0 : 1;
    if (aDirect !== bDirect) return aDirect - bDirect;
    return a.name.localeCompare(b.name);
  });

  return result;
}

export const licenseEntries: LicenseEntry[] = parseLockfile();

/** Only include first-party dependency entries (non-devDependencies) that have a known license. */
export function getLicenseEntries(): LicenseEntry[] {
  return licenseEntries.filter((e) => e.licenseText.length > 0);
}