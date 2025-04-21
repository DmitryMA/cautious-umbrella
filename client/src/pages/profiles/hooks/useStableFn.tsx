/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef } from 'react';

type AnyFunction = (...args: any[]) => any;

type PickFunction<T extends AnyFunction> = (...args: Parameters<T>) => ReturnType<T>;

/**
 * Doc: https://ahooks.js.org/hooks/use-memoized-fn/
 * Source: https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useMemoizedFn/index.ts
 */
export function useStableFn<T extends AnyFunction>(fn: T) {
  const fnRef = useRef<T>(fn);

  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo(() => fn, [fn]);

  const stableFnRef = useRef<PickFunction<T> | null>(null);
  if (!stableFnRef.current) {
    stableFnRef.current = (...args) => fnRef.current(...args);
  }

  return stableFnRef.current as T;
}
