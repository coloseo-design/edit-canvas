/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

const esBuild = () => {
  const options = {
    bundle: false,
    outdir: path.resolve(process.cwd(), 'lib'),
    format: 'cjs',
    minify: false,
    logLevel: 'info',
    jsxFragment: 'div',
    target: 'es2015',
  };
  return (entryPoints) => {
    const extOptions = {
      ...options,
      entryPoints,
      bundle: false,
      define: {
        // 环境变量
      },
    };
    return esbuild.build(extOptions);
  };
};


const clean = (dist) => {
  fs.rmSync(dist, { recursive: true, force: true });
}

const composeFile = (item) => path.resolve(path.resolve(process.cwd(), 'src/components'), item);
const files = () => {
  const list = glob
    .sync('**/*', {
      cwd: path.resolve(process.cwd(), 'src/components'),
    })
    .filter((file) => {
      return (
        file.endsWith('.ts') && !file.includes('demo')
      );
    })
    .map(composeFile);
  return list;
};

const build = () => {
  clean(path.resolve(process.cwd(), 'lib'));
  esBuild()(files())
    .catch(() => {
      process.exit(1);
    });
};

build();

