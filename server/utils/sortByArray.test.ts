import sortByArray from './sortByArray'

describe('sortByArray', () => {
  test('sorts based on the order of elements in the "by" array', () => {
    const source = ['c', 'a', 'b', 'd']
    const by = ['b', 'a', 'c']
    const result = sortByArray({ source, by })
    expect(result).toEqual(['b', 'a', 'c', 'd']) // 'd' is not in "by" and remains unsorted at the end
  })

  test('sorts using a custom transformer function', () => {
    const source = [{ id: 3 }, { id: 1 }, { id: 2 }]
    const by = [2, 3, 1]
    const result = sortByArray({
      source,
      by,
      sourceTransformer: item => item.id,
    })
    expect(result).toEqual([{ id: 2 }, { id: 3 }, { id: 1 }])
  })

  test('handles case where "source" contains elements not in "by"', () => {
    const source = ['x', 'y', 'z']
    const by = ['y']
    const result = sortByArray({ source, by })
    expect(result).toEqual(['y', 'x', 'z']) // 'x' and 'z' appear after sorted elements
  })

  test('handles empty "source" array', () => {
    const source: string[] = []
    const by = ['a', 'b', 'c']
    const result = sortByArray({ source, by })
    expect(result).toEqual([])
  })

  test('handles empty "by" array', () => {
    const source = ['a', 'b', 'c']
    const by: string[] = []
    const result = sortByArray({ source, by })
    expect(result).toEqual(['a', 'b', 'c']) // Original order is preserved
  })

  test('handles no transformer with mixed types', () => {
    const source = [3, 1, 2]
    const by = [2, 3, 1]
    const result = sortByArray({ source, by })
    expect(result).toEqual([2, 3, 1])
  })

  test('handles duplicates in "source"', () => {
    const source = ['a', 'b', 'a', 'c']
    const by = ['a', 'c', 'b']
    const result = sortByArray({ source, by })
    expect(result).toEqual(['a', 'a', 'c', 'b']) // Order of duplicates respects "by"
  })

  test('handles duplicates in "by"', () => {
    const source = ['a', 'b', 'c']
    const by = ['b', 'b', 'a']
    const result = sortByArray({ source, by })
    expect(result).toEqual(['b', 'a', 'c']) // Duplicates in "by" do not affect ordering
  })
})
