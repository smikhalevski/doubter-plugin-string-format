import * as d from 'doubter/core';
import enableASCIIFormat from '../main/ascii';
import { CODE_FORMAT } from '../main/internal/constants';

enableASCIIFormat(d.StringShape);

describe('ascii', () => {
  test('validates ASCII', () => {
    const shape = d.string().ascii();

    expect(shape.parse('aaa')).toBe('aaa');

    expect(shape.try('ббб')).toEqual({
      ok: false,
      issues: [
        {
          code: CODE_FORMAT,
          input: 'ббб',
          message: 'Must be an ASCII string',
          param: {
            format: 'ascii',
          },
        },
      ],
    });
  });
});
