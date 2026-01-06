import { createHash } from 'node:crypto';
import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Dist output directory and primary entry file.
const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const checksumPath = path.join(distDir, 'SHA256SUMS.txt');

const logStep = (message: string): void => {
  console.info(`[pack-single-html] ${message}`);
};

// Normalize asset paths emitted by Vite into filesystem paths.
const normalizeAssetPath = (assetPath: string): string => {
  if (assetPath.startsWith('/')) {
    return assetPath.slice(1);
  }
  return assetPath.replace(/^\.\//, '');
};

/**
 * Inline CSS and module JS assets into the HTML output.
 */
const inlineAssets = async (html: string): Promise<string> => {
  let output = html;

  // Remove Vite modulepreload hints; these are external references in single-file output.
  const modulePreloadRegex = /<link\b[^>]*rel=["']modulepreload["'][^>]*>/g;
  output = output.replace(modulePreloadRegex, '');

  const cssRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g;
  output = await replaceAsync(output, cssRegex, async (_match, href) => {
    const assetFile = path.join(distDir, normalizeAssetPath(href));
    const css = await readFile(assetFile, 'utf8');
    return `<style>${css}</style>`;
  });

  const jsRegex = /<script\b([^>]*?)\s+src=["']([^"']+)["']([^>]*)><\/script>/gis;
  output = await replaceAsync(output, jsRegex, async (_match, beforeAttrs, src, afterAttrs) => {
    const assetFile = path.join(distDir, normalizeAssetPath(src));
    const js = await readFile(assetFile, 'utf8');
    const combinedAttrs = `${beforeAttrs} ${afterAttrs}`.replace(/\s+/g, ' ').trim();
    const attributes = combinedAttrs ? ` ${combinedAttrs}` : '';
    return `<script${attributes}>${js}</script>`;
  });

  return output;
};

// Async string replacement helper for asset inlining.
const replaceAsync = async (
  input: string,
  regex: RegExp,
  replacer: (match: string, ...groups: string[]) => Promise<string>,
): Promise<string> => {
  const matches = Array.from(input.matchAll(regex));
  if (matches.length === 0) {
    return input;
  }

  let result = '';
  let lastIndex = 0;
  for (const match of matches) {
    const matchIndex = match.index ?? 0;
    result += input.slice(lastIndex, matchIndex);
    const replacement = await replacer(match[0], ...match.slice(1));
    result += replacement;
    lastIndex = matchIndex + match[0].length;
  }
  result += input.slice(lastIndex);
  return result;
};

// Fail fast if a required build asset is missing.
const ensureFile = async (filePath: string): Promise<void> => {
  try {
    await access(filePath);
  } catch {
    throw new Error(`Missing build asset: ${filePath}`);
  }
};

const verifySingleLine = (output: string): void => {
  if (/[\r\n]/.test(output)) {
    throw new Error('Packed output must be a single line.');
  }
};

const verifyAssetsInlined = (output: string): void => {
  // Collect any remaining external asset references so failures are actionable.
  const violations: string[] = [];

  // Stylesheet links should be fully inlined into <style> tags.
  const stylesheetMatches = output.match(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi);
  if (stylesheetMatches) {
    violations.push(`stylesheet links (${stylesheetMatches.length})`);
  }

  // Module preload hints must be stripped to keep the output self-contained.
  const modulePreloadMatches = output.match(/<link\b[^>]*rel=["']modulepreload["'][^>]*>/gi);
  if (modulePreloadMatches) {
    violations.push(`modulepreload links (${modulePreloadMatches.length})`);
  }

  // Script tags should be inlined, so no remaining src references are allowed.
  const scriptSrcMatches = output.match(/<script\b[^>]*src=["'][^"']+["'][^>]*><\/script>/gi);
  if (scriptSrcMatches) {
    violations.push(`script src tags (${scriptSrcMatches.length})`);
  }

  if (violations.length > 0) {
    throw new Error(`Packed output still contains external asset tags: ${violations.join(', ')}.`);
  }
};

// Compute a SHA-256 hash for a given payload (Buffer or string).
const createSha256 = (input: Buffer | string): string => {
  return createHash('sha256').update(input).digest('hex');
};

// Emit SHA256SUMS.txt alongside the packed output using the provided hash.
const writeChecksumFile = async (filePath: string, hash: string): Promise<void> => {
  const filename = path.basename(filePath);
  const contents = `${hash}  ${filename}\n`;
  await writeFile(checksumPath, contents, 'utf8');
};

/**
 * Inline assets and emit a single-line HTML output.
 */
const pack = async (): Promise<void> => {
  logStep(`Packing ${indexPath}`);
  await ensureFile(indexPath);
  const html = await readFile(indexPath, 'utf8');
  logStep('Inlining assets');
  const inlined = await inlineAssets(html);
  const singleLine = inlined.replace(/\r?\n+/g, '');
  // Use a buffer to guarantee the hash matches the exact bytes written to disk.
  const outputBuffer = Buffer.from(singleLine, 'utf8');
  logStep('Validating output');
  verifySingleLine(singleLine);
  verifyAssetsInlined(singleLine);
  await writeFile(indexPath, outputBuffer);
  logStep(`Generating checksum manifest: ${checksumPath}`);
  const hash = createSha256(outputBuffer);
  await writeChecksumFile(indexPath, hash);
  logStep(`Checksum manifest written (sha256: ${hash})`);
  logStep('Pack complete');
};

await pack();
