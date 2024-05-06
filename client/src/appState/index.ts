import { initialAppState } from './initial'

type PathKeyValueMapUnison<
  T,
  Root extends string = ''
> = keyof T extends infer K
  ? K extends string & keyof T
    ?
        | { [P in `${Root}${K}`]: T[K] }
        | (T[K] extends object
            ? PathKeyValueMapUnison<T[K], `${Root}${K}.`>
            : {})
    : never
  : never

// https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never

// https://stackoverflow.com/a/63542565
type IntersectionToObject<U> = UnionToIntersection<U> extends infer O
  ? { [K in keyof O]: O[K] }
  : never

type PathKeyValueMap<T> = IntersectionToObject<PathKeyValueMapUnison<T>>

type TransactionHelper<T> = Pick<AppState<T>, 'set' | 'transform'>

interface AppState<T> {
  get: <K extends keyof PathKeyValueMap<T>>(key: K) => PathKeyValueMap<T>[K]

  set: <K extends keyof PathKeyValueMap<T>>(
    key: K,
    value: PathKeyValueMap<T>[K],
    shouldEmitEvents?: boolean
  ) => void

  transform: <K extends keyof PathKeyValueMap<T>>(
    key: K,
    fn: (value: PathKeyValueMap<T>[K]) => PathKeyValueMap<T>[K],
    shouldEmitEvents?: boolean
  ) => void

  transaction: (fn: (t: TransactionHelper<T>) => void) => void

  addEventListener: <K extends keyof PathKeyValueMap<T>>(
    key: K,
    fn: (value: PathKeyValueMap<T>[K]) => void
  ) => void

  removeEventListener: <K extends keyof PathKeyValueMap<T>>(
    key: K,
    fn: (value: PathKeyValueMap<T>[K]) => void
  ) => void
}

const makeAppState = <T>(initial: T): AppState<T> => {
  type PathMap = PathKeyValueMap<T>
  type PathKey = keyof PathMap

  let state = initial
  const listeners: { [K in keyof PathMap]?: Set<(value: PathMap[K]) => void> } =
    {}
  const dirtyKeys = new Set<keyof PathMap>()

  const splitPath = (path: PathKey) => path.toString().split('.')

  const get: AppState<T>['get'] = key =>
    splitPath(key).reduce((acc, k) => acc[k], state as any)

  // Includes self
  const getAncestorPaths = (path: PathKey): PathKey[] => {
    const parts = splitPath(path)
    const ancestorPaths: PathKey[] = []

    for (let i = 1; i <= parts.length; i++) {
      ancestorPaths.push(parts.slice(0, i).join('.') as PathKey)
    }

    return ancestorPaths
  }

  // Includes self
  const getDescendantPaths = (path: PathKey): PathKey[] => {
    const descendantPaths = [path]
    const value = get(path)

    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(childKey => {
        const childPath = `${path.toString()}.${childKey}` as PathKey
        const childDescendants = getDescendantPaths(childPath)
        descendantPaths.push(...childDescendants)
      })
    }

    return descendantPaths
  }

  const emitEvents = () => {
    dirtyKeys.forEach(key => {
      const keyListeners = listeners[key]
      keyListeners?.forEach(fn => fn(get(key)))
    })

    dirtyKeys.clear()
  }

  const set: AppState<T>['set'] = (key, value, shouldEmitEvents = true) => {
    state = structuredClone(state)

    const pathParts = splitPath(key)
    const parentPath = pathParts.slice(0, -1).join('.')
    const lastKey = pathParts[pathParts.length - 1]

    const parentObject = get(parentPath as any)
    parentObject[lastKey] = value
    ;[...getAncestorPaths(key), ...getDescendantPaths(key)].forEach(path => {
      dirtyKeys.add(path)
    })

    if (shouldEmitEvents) {
      emitEvents()
    }
  }

  const transform: AppState<T>['transform'] = (
    key,
    fn,
    shouldEmitEvents = true
  ) => set(key, fn(get(key)), shouldEmitEvents)

  const transaction: AppState<T>['transaction'] = fn => {
    fn({
      set: (key, value, shouldEmitEvents = false) =>
        set(key, value, shouldEmitEvents),
      transform: (key, fn, shouldEmitEvents = false) =>
        transform(key, fn, shouldEmitEvents),
    })

    emitEvents()
  }

  const addEventListener: AppState<T>['addEventListener'] = (key, fn) => {
    if (!listeners[key]) {
      listeners[key] = new Set()
    }

    listeners[key]!.add(fn)
  }

  const removeEventListener: AppState<T>['removeEventListener'] = (key, fn) => {
    listeners[key]?.delete(fn)
  }

  return {
    get,
    set,
    transform,
    transaction,
    addEventListener,
    removeEventListener,
  }
}

export type AppStatePathMap = PathKeyValueMap<typeof initialAppState>
export type AppStateTransactionHelper = TransactionHelper<
  typeof initialAppState
>
export const appState = makeAppState(initialAppState)
