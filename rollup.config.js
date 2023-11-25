const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: './src/main/index.ts',
  output: [
    {
      format: 'cjs',
      entryFileNames: '[name].js',
      dir: './lib',
      preserveModules: true,
    },
    {
      format: 'es',
      entryFileNames: '[name].mjs',
      dir: './lib',
      preserveModules: true,
      paths: id => id.startsWith('validator') && id.replace('validator', 'validator/es'),
    },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
  external: /^doubter|^validator/,
};
