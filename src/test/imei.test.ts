import * as d from 'doubter/core';
import enableIMEIFormat from '../main/imei';
import { CODE_FORMAT, FORMAT_IMEI, MESSAGE_IMEI } from '../main/internal/constants';

enableIMEIFormat(d.StringShape.prototype);

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
          message: MESSAGE_IMEI,
          param: {
            format: FORMAT_IMEI,
            allowHyphens: false,
          },
        },
      ],
    });
  });
});
