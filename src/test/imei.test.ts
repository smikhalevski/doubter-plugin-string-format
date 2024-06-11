import * as d from 'doubter/core';
import enableIMEIFormat from '../main/imei';

enableIMEIFormat(d.StringShape);

describe('imei', () => {
  test('validates IMEI', () => {
    const shape = d.string().imei();

    expect(shape.parse('103178624316725')).toBe('103178624316725');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.imei',
          input: 'foo',
          message: 'Must be an IMEI number',
          param: {
            allowHyphens: false,
          },
        },
      ],
    });
  });
});
