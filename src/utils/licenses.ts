import packageJson from '../../package.json';

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

/** SPDX license IDs that we care about for this project */
const SPDX_URLS: Record<string, string> = {
  'MIT': 'https://opensource.org/licenses/MIT',
  'Apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
  'BSD-2-Clause': 'https://opensource.org/licenses/BSD-2-Clause',
  'BSD-3-Clause': 'https://opensource.org/licenses/BSD-3-Clause',
  'ISC': 'https://opensource.org/licenses/ISC',
  'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  'MPL-2.0': 'https://www.mozilla.org/en-US/MPL/2.0/',
  'LGPL-3.0-only': 'https://www.gnu.org/licenses/lgpl-3.0.html',
  'GPL-3.0-only': 'https://www.gnu.org/licenses/gpl-3.0.html',
  'Unlicense': 'https://unlicense.org/',
};

function resolveLicenseText(spdxId: string): string {
  // For GitHub Pages builds, we don't bundle the full SPDX database.
  // Return a short reference text with a link to the full license.
  const url = SPDX_URLS[spdxId];
  if (!url) return '';

  return `This software is licensed under the ${spdxId} License.\n\nFull license text: ${url}`;
}

function parseLockfile(): LicenseEntry[] {
  let packageLock: unknown;
  try {
    packageLock = JSON.parse(
      typeof __PACKAGE_LOCK__ !== 'undefined'
        ? (__PACKAGE_LOCK__ as string)
        : '{}'
    );
  } catch {
    return [];
  }

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

let cachedEntries: LicenseEntry[] | null = null;

/** Only include dependency entries that have a known license. */
export function getLicenseEntries(): LicenseEntry[] {
  if (!cachedEntries) {
    cachedEntries = parseLockfile();
  }
  return cachedEntries.filter((e) => e.licenseText.length > 0);
}