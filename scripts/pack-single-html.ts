import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');

const normalizeAssetPath = (assetPath: string): string => {
  if (assetPath.startsWith('/')) {
    return assetPath.slice(1);
  }
  return assetPath.replace(/^\.\//, '');
};

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

const ensureFile = async (filePath: string): Promise<void> => {
  try {
    await access(filePath);
  } catch {
    throw new Error(`Missing build asset: ${filePath}`);
  }
};

const pack = async (): Promise<void> => {
  await ensureFile(indexPath);
  const html = await readFile(indexPath, 'utf8');
  const inlined = await inlineAssets(html);
  const singleLine = inlined.replace(/\r?\n+/g, '');
  await writeFile(indexPath, singleLine, 'utf8');
};

await pack();
