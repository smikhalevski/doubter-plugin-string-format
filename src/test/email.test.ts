import * as d from 'doubter/core';
import enableEmailFormat from '../main/email';
import { CODE_FORMAT, FORMAT_EMAIL, MESSAGE_EMAIL } from '../main/internal/constants';

enableEmailFormat(d.StringShape.prototype);

describe('email', () => {
  test('validates email', () => {
    const shape = d.string().email();

    expect(shape.parse('foo@bar.com')).toBe('foo@bar.com');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: CODE_FORMAT,
          input: 'foo',
          message: MESSAGE_EMAIL,
          param: {
            format: FORMAT_EMAIL,
            allowDisplayName: false,
            allowIPDomain: false,
            allowUTF8LocalPart: true,
            blacklistedChars: '',
            hostBlacklist: [],
            hostWhitelist: [],
            ignoreMaxLength: false,
            requireDisplayName: false,
            requireTLD: true,
          },
        },
      ],
    });
  });
});
