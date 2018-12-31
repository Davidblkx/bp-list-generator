// ================================================================================================
// helps validate and enforce type checking in runtime
// ================================================================================================

import { genericValidator } from './validators';

export type SomeResolver<T> = (fn: ((data: T) => void)) => Option<T>;
export type NoneResolver<T> = (fn: (() => void)) => Option<T>;

export interface Option<T> {
  some: SomeResolver<T>;
  none: NoneResolver<T>;
  toPromise: () => Promise<T>;
}

function validate<T>(input: unknown, validator?: (input: unknown) => input is T): input is T {
  if (validator) {
    return validator(input);
  }

  return genericValidator(input);
}

export function some<T>(input: unknown, validator?: (input: unknown) => input is T): Option<T> {
  let opt: Option<T>;

  const someFn: SomeResolver<T> = fn => {
    if (validate(input, validator)) { fn(input); }
    return opt;
  };

  const noneFn: NoneResolver<T> = fn => {
    if (!validate(input, validator)) { fn(); }
    return opt;
  };

  const toPromiseFn = () => toPromise(opt);

  opt = {
    some: someFn,
    none: noneFn,
    toPromise: toPromiseFn
  };

  return opt;
}

export function none<T>(): Option<T> {
  let opt: Option<T>;

  opt = {
    none: fn => {
      fn();
      return opt;
    },
    some: fn => opt,
    toPromise: () => toPromise(opt)
  };

  return opt;
}

export function toPromise<T>(option: Option<T>): Promise<T> {
  return new Promise((res, rej) => {
    option
      .some(e => res(e))
      .none(() => rej());
  });
}
