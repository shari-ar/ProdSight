import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Dist output directory and primary entry file.
const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

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

  const cssRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g;
  output = await replaceAsync(output, cssRegex, async (_match, href) => {
    const assetFile = path.join(distDir, normalizeAssetPath(href));
    const css = await readFile(assetFile, 'utf8');
    return `<style>${css}</style>`;
  });

  const jsRegex = /<script\b[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*><\/script>/g;
  output = await replaceAsync(output, jsRegex, async (_match, src) => {
    const assetFile = path.join(distDir, normalizeAssetPath(src));
    const js = await readFile(assetFile, 'utf8');
    return `<script type="module">${js}</script>`;
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

  let result = input;
  for (const match of matches) {
    const replacement = await replacer(match[0], ...match.slice(1));
    result = result.replace(match[0], replacement);
  }
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
  const hasStylesheetLinks = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/i.test(output);
  if (hasStylesheetLinks) {
    throw new Error('Packed output still contains stylesheet links.');
  }

  const hasModuleScripts = /<script\b[^>]*type=["']module["'][^>]*src=["'][^"']+["'][^>]*><\/script>/i.test(output);
  if (hasModuleScripts) {
    throw new Error('Packed output still contains module script src references.');
  }
};

/**
 * Inline assets and emit a single-line HTML output.
 */
const pack = async (): Promise<void> => {
  await ensureFile(indexPath);
  const html = await readFile(indexPath, 'utf8');
  const inlined = await inlineAssets(html);
  const singleLine = inlined.replace(/\r?\n+/g, '');
  verifySingleLine(singleLine);
  verifyAssetsInlined(singleLine);
  await writeFile(indexPath, singleLine, 'utf8');
};

await pack();
