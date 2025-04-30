import {describe, expect, it} from 'vitest';

import {deepFreeze} from './deep-freeze';

describe('deepFreeze', () => {
  it('should freeze a simple object', () => {
    const obj = {a: 1, b: 2};
    const frozenObj = deepFreeze(obj);

    // The function should return the same object
    expect(frozenObj).toBe(obj);

    // The object should be frozen
    expect(Object.isFrozen(frozenObj)).toBe(true);

    // Properties should not be modifiable
    expect(() => {
      // @ts-expect-error: Property is readonly after freeze
      frozenObj.a = 3;
    }).toThrow(TypeError);
  });

  it('should freeze nested objects', () => {
    const nestedObj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };

    const frozenObj = deepFreeze(nestedObj);

    // All levels should be frozen
    expect(Object.isFrozen(frozenObj)).toBe(true);
    expect(Object.isFrozen(frozenObj.b)).toBe(true);
    expect(Object.isFrozen(frozenObj.b.d)).toBe(true);

    // Nested properties should not be modifiable
    expect(() => {
      // @ts-expect-error: Property is readonly after freeze
      frozenObj.b.c = 5;
    }).toThrow(TypeError);

    expect(() => {
      // @ts-expect-error: Property is readonly after freeze
      frozenObj.b.d.e = 10;
    }).toThrow(TypeError);
  });

  it('should handle arrays in objects', () => {
    const objWithArray = {
      arr: [1, 2, {a: 3}],
    };

    const frozenObj = deepFreeze(objWithArray);

    // Array and objects inside array should be frozen
    expect(Object.isFrozen(frozenObj.arr)).toBe(true);
    expect(Object.isFrozen(frozenObj.arr[2])).toBe(true);

    // Array mutations should throw
    expect(() => {
      // @ts-expect-error: Property is readonly after freeze
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      frozenObj.arr.push(4);
    }).toThrow(TypeError);

    expect(() => {
      // @ts-expect-error: Property is readonly after freeze
      frozenObj.arr[2].a = 10;
    }).toThrow(TypeError);
  });

  it('should handle an empty object', () => {
    const emptyObj = {};
    const frozenObj = deepFreeze(emptyObj);

    expect(Object.isFrozen(frozenObj)).toBe(true);

    // Adding new properties should throw
    expect(() => {
      // @ts-expect-error: Object is frozen
      frozenObj.newProp = 'value';
    }).toThrow(TypeError);
  });

  it('should handle objects with null and primitive values', () => {
    const objWithNull = {
      a: null,
      b: 'string',
      c: 42,
      d: true,
      e: undefined,
    };

    const frozenObj = deepFreeze(objWithNull);

    expect(Object.isFrozen(frozenObj)).toBe(true);

    // Primitive values should remain unchanged
    expect(frozenObj.a).toBeNull();
    expect(frozenObj.b).toBe('string');
    expect(frozenObj.c).toBe(42);
    expect(frozenObj.d).toBe(true);
    expect(frozenObj.e).toBeUndefined();
  });

  it('should handle circular references safely', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circular: Record<string, any> = {a: 1};
    circular.self = circular;
    circular.nested = {parent: circular};

    // This should not cause stack overflow
    const frozenCircular = deepFreeze(circular);

    expect(Object.isFrozen(frozenCircular)).toBe(true);
    expect(Object.isFrozen(frozenCircular.nested)).toBe(true);

    // The circular reference should be maintained
    expect(frozenCircular.self).toBe(frozenCircular);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(frozenCircular.nested.parent).toBe(frozenCircular);
  });

  it('should handle objects with functions', () => {
    const objWithFunction = {
      a: 1,
      fn: function () {
        return 42;
      },
      nested: {
        method: () => 'hello',
      },
    };

    const frozenObj = deepFreeze(objWithFunction);

    // The container object should be frozen
    expect(Object.isFrozen(frozenObj)).toBe(true);
    expect(Object.isFrozen(frozenObj.nested)).toBe(true);

    // Functions should still be callable - use type assertions to fix the call signature issue
    expect((frozenObj.fn as () => number)()).toBe(42);
    expect((frozenObj.nested.method as () => string)()).toBe('hello');

    // We can't modify the function references
    expect(() => {
      // @ts-expect-error: Property is readonly after freeze
      frozenObj.fn = () => 100;
    }).toThrow(TypeError);

    expect(() => {
      // @ts-expect-error: Property is readonly after freeze
      frozenObj.nested.method = () => 'changed';
    }).toThrow(TypeError);
  });

  it('should handle complex object structures', () => {
    const complexObj = {
      data: [
        {id: 1, items: [{name: 'item1'}]},
        {id: 2, items: [{name: 'item2'}]},
      ],
      metadata: {
        created: new Date(),
        author: {
          name: 'Test',
          contact: {
            email: 'test@example.com',
          },
        },
      },
    };

    const frozenObj = deepFreeze(complexObj);

    // Check freezing at various levels
    expect(Object.isFrozen(frozenObj)).toBe(true);
    expect(Object.isFrozen(frozenObj.data)).toBe(true);
    expect(Object.isFrozen(frozenObj.data[0])).toBe(true);
    expect(Object.isFrozen(frozenObj.data[0].items)).toBe(true);
    expect(Object.isFrozen(frozenObj.data[0].items[0])).toBe(true);
    expect(Object.isFrozen(frozenObj.metadata)).toBe(true);
    expect(Object.isFrozen(frozenObj.metadata.author)).toBe(true);
    expect(Object.isFrozen(frozenObj.metadata.author.contact)).toBe(true);
  });
});
