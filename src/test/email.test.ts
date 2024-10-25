import * as d from 'doubter/core';
import '../main/email';

describe('email', () => {
  test('validates email', () => {
    const shape = d.string().email();

    expect(shape.parse('foo@bar.com')).toBe('foo@bar.com');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.email',
          input: 'foo',
          message: 'Must be an email',
          param: {
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
