import * as d from 'doubter/core';
import enableUUIDFormat from '../main/uuid';
import { CODE_FORMAT } from '../main/constants';

enableUUIDFormat(d.StringShape);

describe('uuid', () => {
  test('validates any UUID by default', () => {
    const shape = d.string().uuid();

    expect(shape.parse('79d1a9a8-8894-11ee-b9d1-0242ac120002')).toBe('79d1a9a8-8894-11ee-b9d1-0242ac120002');
    expect(shape.parse('834621e1-5f1d-46d7-baab-4b3e500c763d')).toBe('834621e1-5f1d-46d7-baab-4b3e500c763d');

    expect(shape.try('foo')).toEqual({
      ok: false,
      issues: [
        {
          code: CODE_FORMAT,
          input: 'foo',
          message: 'Must be a UUID',
          param: {
            format: 'uuid',
            version: 'any',
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
          code: CODE_FORMAT,
          input: '834621e1-5f1d-46d7-baab-4b3e500c763d',
          message: 'Must be a UUID',
          param: {
            format: 'uuid',
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
          code: CODE_FORMAT,
          input: '79d1a9a8-8894-11ee-b9d1-0242ac120002',
          message: 'Must be a UUID',
          param: {
            format: 'uuid',
            version: 4,
          },
        },
      ],
    });
  });
});
