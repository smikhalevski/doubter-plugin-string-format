import * as d from 'doubter/core';
import enableIMEIFormat from '../main/imei';
import { CODE_FORMAT } from '../main/constants';

enableIMEIFormat(d.StringShape);

describe('imei', () => {
  test('validates IMEI', () => {
    const shape = d.string().imei();

    expect(shape.parse('103178624316725')).toBe('103178624316725');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: CODE_FORMAT,
          input: 'foo',
          message: 'Must be an IMEI number',
          param: {
            format: 'imei',
            allowHyphens: false,
          },
        },
      ],
    });
  });
});
