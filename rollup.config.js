const nodeResolve = require('@rollup/plugin-node-resolve');
const dts = require('rollup-plugin-dts');

module.exports = ['index', 'bic', 'email', 'fqdn', 'imei', 'isin', 'luhn', 'mime'].flatMap((name, _, arr) => [
  {
    input: './gen/' + name + '.js',
    output: [
      {
        file: './lib/' + name + '.js',
        format: 'cjs',
      },
      {
        file: './lib/' + name + '.mjs',
        format: 'es',
        paths: id => id.startsWith('validator') && id.replace('validator', 'validator/es'),
      },
    ],
    plugins: [nodeResolve()],
    external: arr.map(name => RegExp(name + '$')).concat(/^validator|^doubter/),
  },
  {
    input: './gen/' + name + '.d.ts',
    output: { file: './lib/' + name + '.d.ts', format: 'es' },
    plugins: [dts.default()],
    external: /^validator|^doubter$/,
  },
]);
