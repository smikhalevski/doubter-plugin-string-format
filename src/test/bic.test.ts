import * as d from 'doubter/core';
import '../main/bic';

describe('bic', () => {
  test('validates BIC', () => {
    const shape = d.string().bic();

    expect(shape.parse('BOFAUS3N')).toBe('BOFAUS3N');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.bic',
          input: 'foo',
          message: 'Must be a BIC or SWIFT code',
        },
      ],
    });
  });
});
