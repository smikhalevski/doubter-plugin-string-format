import * as d from 'doubter/core';
import enableFQDNFormat from '../main/fqdn';
import { CODE_FORMAT, FORMAT_FQDN, MESSAGE_FQDN } from '../main/internal/constants';

enableFQDNFormat(d.StringShape.prototype);

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
          message: MESSAGE_FQDN,
          param: {
            format: FORMAT_FQDN,
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
