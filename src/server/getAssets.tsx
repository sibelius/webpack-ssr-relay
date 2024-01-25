import fs from 'fs';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

const appAssetsManifest = resolveApp('build/assets.json');

// Ensure Webpack does not analyze the require statement
export const requireDynamically = (p: string) => eval(`require('${p}');`);

export const getAssets = () => {
  const assets = requireDynamically(appAssetsManifest);

  return assets;
};
