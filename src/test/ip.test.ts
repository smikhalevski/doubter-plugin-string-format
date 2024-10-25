import * as d from 'doubter/core';
import '../main/ip';

describe('ip', () => {
  test('validates any IP by default', () => {
    const shape = d.string().ip();

    expect(shape.parse('192.0.2.146')).toBe('192.0.2.146');
    expect(shape.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.ip',
          input: 'foo',
          message: 'Must be an IP address',
          param: {
            version: undefined,
          },
        },
      ],
    });
  });

  test('validates IP v4', () => {
    const shape = d.string().ip({ version: 4 });

    expect(shape.parse('192.0.2.146')).toBe('192.0.2.146');

    expect(shape.try('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.ip',
          input: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
          message: 'Must be an IP address',
          param: {
            version: 4,
          },
        },
      ],
    });
  });

  test('validates IP v6', () => {
    const shape = d.string().ip({ version: 6 });

    expect(shape.parse('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

    expect(shape.try('192.0.2.146')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.ip',
          input: '192.0.2.146',
          message: 'Must be an IP address',
          param: {
            version: 6,
          },
        },
      ],
    });
  });
});
