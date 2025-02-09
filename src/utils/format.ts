export function formatCoinType(coinType: string): string {
  const parts = coinType.split("::");
  if (parts.length !== 3) {
    throw new Error(`Invalid coinType format: ${coinType}`);
  }

  let [pkg, module, struct] = parts;
  // check if pkg is 0x64 and fix it
  if (pkg.startsWith("0x")) {
    const addressParts = pkg.substring(2);
    if (addressParts.length <= 64) {
      const padding = "0".repeat(64 - addressParts.length);
      pkg = `0x${padding}${addressParts}`;
    } else if (addressParts.length > 64) {
      throw new Error(`Invalid address length: ${pkg}`);
    }
  } else {
    if (pkg.length <= 64) {
      const padding = "0".repeat(64 - pkg.length);
      pkg = `0x${padding}${pkg}`;
    } else if (pkg.length > 64) {
      throw new Error(`Invalid address length: ${pkg}`);
    }
  }
  return `${pkg.toLowerCase()}::${module.toLowerCase()}::${struct.toUpperCase()}`;
}

export function formatMDString(md: string): string {
  return md.replace(/`/g, "\\`");
}