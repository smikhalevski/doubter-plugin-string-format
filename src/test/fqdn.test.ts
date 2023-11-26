import * as d from 'doubter/core';
import enableFQDNFormat from '../main/fqdn';
import { CODE_FORMAT } from '../main/constants';

enableFQDNFormat(d.StringShape);

describe('fqdn', () => {
  test('validates FQDN', () => {
    const shape = d.string().fqdn();

    expect(shape.parse('foo.bar.com')).toBe('foo.bar.com');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: CODE_FORMAT,
          input: 'foo',
          message: 'Must be a fully qualified domain name',
          param: {
            format: 'fqdn',
            allowNumericTLD: false,
            allowTrailingDot: false,
            allowUnderscores: false,
            allowWildcard: false,
            ignoreMaxLength: false,
            requireTLD: true,
          },
        },
      ],
    });
  });
});
