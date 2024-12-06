import { identity, sortBy } from 'lodash'

export default function sortByArray<T, U>({
  source,
  by,
  sourceTransformer = identity,
}: {
  source: T[]
  by: U[]
  sourceTransformer?: (item: T) => U
}) {
  const indexesByElements = new Map(by.map((item, idx) => [item, idx]))
  const orderedResult = sortBy(source, p => indexesByElements.get(sourceTransformer(p)))
  return orderedResult
}
