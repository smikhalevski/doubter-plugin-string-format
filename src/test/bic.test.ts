import * as d from 'doubter/core';
import enableBICFormat from '../main/bic';
import { CODE_FORMAT } from '../main/constants';

enableBICFormat(d.StringShape);

describe('bic', () => {
  test('validates BIC', () => {
    const shape = d.string().bic();

    expect(shape.parse('BOFAUS3N')).toBe('BOFAUS3N');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: CODE_FORMAT,
          input: 'foo',
          message: 'Must be a BIC or SWIFT code',
          param: {
            format: 'bic',
          },
        },
      ],
    });
  });
});
