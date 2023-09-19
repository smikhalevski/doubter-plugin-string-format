const nodeResolve = require('@rollup/plugin-node-resolve');
const dts = require('rollup-plugin-dts');
const path = require('path');
const fs = require('fs');

module.exports = fs
  .readdirSync('src/main')
  .filter(it => it !== 'internal')
  .map(it => path.basename(it, '.ts'))
  .flatMap((input, _, inputs) => {
    const external = inputs.map(input => RegExp('\\./' + input)).concat(/^validator|^doubter/);

    return [
      {
        input: `gen/${input}.js`,
        output: [
          { file: `lib/${input}.js`, format: 'cjs' },
          {
            file: `lib/${input}.mjs`,
            format: 'es',
            paths: id => id.startsWith('validator') && id.replace('validator', 'validator/es'),
          },
        ],
        plugins: [
          nodeResolve(),

          // Append a file extension to relative imports and exports
          {
            renderChunk: (code, chunk) =>
              code.replace(/(require\(|from )'\.[^']+/g, '$&' + path.extname(chunk.fileName)),
          },
        ],
        external,
      },
      {
        input: `gen/${input}.d.ts`,
        output: { file: `lib/${input}.d.ts`, format: 'es' },
        plugins: [dts.default()],
        external,
      },
    ];
  });
