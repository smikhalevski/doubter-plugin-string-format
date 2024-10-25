import * as d from 'doubter/core';
import '../main/ascii';

describe('ascii', () => {
  test('validates ASCII', () => {
    const shape = d.string().ascii();

    expect(shape.parse('aaa')).toBe('aaa');

    expect(shape.try('ббб')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.ascii',
          input: 'ббб',
          message: 'Must be an ASCII string',
        },
      ],
    });
  });

  test('respects messages', () => {
    const shape = d.string().ascii();

    expect(shape.try('ббб', { messages: { 'string.format.ascii': 'Not na ASCII' } })).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.ascii',
          input: 'ббб',
          message: 'Not na ASCII',
        },
      ],
    });
  });
});
