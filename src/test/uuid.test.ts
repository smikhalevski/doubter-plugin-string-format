import * as d from 'doubter/core';
import '../main/uuid';

describe('uuid', () => {
  test('validates any UUID by default', () => {
    const shape = d.string().uuid();

    expect(shape.parse('79d1a9a8-8894-11ee-b9d1-0242ac120002')).toBe('79d1a9a8-8894-11ee-b9d1-0242ac120002');
    expect(shape.parse('834621e1-5f1d-46d7-baab-4b3e500c763d')).toBe('834621e1-5f1d-46d7-baab-4b3e500c763d');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.uuid',
          input: 'foo',
          message: 'Must be a UUID',
          param: {
            version: undefined,
          },
        },
      ],
    });
  });

  test('validates UUID v1', () => {
    const shape = d.string().uuid({ version: 1 });

    expect(shape.parse('79d1a9a8-8894-11ee-b9d1-0242ac120002')).toBe('79d1a9a8-8894-11ee-b9d1-0242ac120002');

    expect(shape.try('834621e1-5f1d-46d7-baab-4b3e500c763d')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.uuid',
          input: '834621e1-5f1d-46d7-baab-4b3e500c763d',
          message: 'Must be a UUID',
          param: {
            version: 1,
          },
        },
      ],
    });
  });

  test('validates UUID v4', () => {
    const shape = d.string().uuid({ version: 4 });

    expect(shape.parse('834621e1-5f1d-46d7-baab-4b3e500c763d')).toBe('834621e1-5f1d-46d7-baab-4b3e500c763d');

    expect(shape.try('79d1a9a8-8894-11ee-b9d1-0242ac120002')).toEqual({
      ok: false,
      issues: [
        {
          code: 'string.format.uuid',
          input: '79d1a9a8-8894-11ee-b9d1-0242ac120002',
          message: 'Must be a UUID',
          param: {
            version: 4,
          },
        },
      ],
    });
  });
});
