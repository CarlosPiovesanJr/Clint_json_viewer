import { describe, it, expect } from 'vitest';
import { findAllPaths } from '../utils/findAllPaths';

describe('findAllPaths', () => {
  it('handles simple object', () => {
    const input = { a: 1, b: 'text' };
    const result = findAllPaths(input);
    expect(result).toEqual([
      { caminho: 'a', nome: 'a', valor: 1, tipo: 'number' },
      { caminho: 'b', nome: 'b', valor: 'text', tipo: 'string' }
    ]);
  });

  it('handles nested structures', () => {
    const input = { a: { b: [1, { c: 2 }] } };
    const result = findAllPaths(input);
    expect(result).toContainEqual({
      caminho: 'a.b[0]',
      nome: 'Item 0',
      valor: 1,
      tipo: 'number'
    });
    expect(result).toContainEqual({
      caminho: 'a.b[1].c',
      nome: 'c',
      valor: 2,
      tipo: 'number'
    });
  });
});
