// ================================================================================================
// helps validate and enforce type checking in runtime
// ================================================================================================

import { genericValidator, Validator } from './validators';

export type SomeResolver<T> = (fn: ((data: T) => void)) => Option<T>;
export type NoneResolver<T> = (fn: (() => void)) => Option<T>;

export class Option<T> {
  private readonly _value: unknown;
  private _validator: Validator<T> | undefined;

  constructor(value?: unknown, validator?: Validator<T>) {
    if (value instanceof Option) {
      this._value = value.getValue();
      this._validator = validator || value.getValidator();
    } else {
      this._value = value;
      this._validator = validator;
    }
  }

  public some<O>(fn: (data: T) => O | Option<O>): Option<O> {
    return this.hasValue() ?
      new Option(fn(this._value as T)) :
      new Option<O>();
  }

  public none<O>(fn: () => O | Option<O>): Option<O> {
    return this.hasValue() ?
      new Option<O>() :
      new Option<O>(fn());
  }

  // tslint:disable-next-line:no-shadowed-variable
  public match<O>(some: (data: T) => O, none: () => O): Option<O> {
    return this.hasValue() ?
      new Option<O>(some(this._value as T)) :
      new Option<O>(none());
  }

  /** true, id value is valid */
  public hasValue(validator?: Validator<T>): boolean {
    return validate(this._value, validator || this._validator);
  }

  /** return promise the resolve to value */
  public toPromise(): Promise<T> {
    return new Promise((res, rej) => {
      this.hasValue() ? res(this._value as T) : rej();
    });
  }

  /** not safe */
  public getValue() {
    return this._value as T;
  }

  /** return current validator use */
  public getValidator() {
    return this._validator;
  }

  /** convert type */
  public to<O>(validator?: Validator<O>): Option<O> {
    return new Option<O>(this._value, validator);
  }

  /** log current value */
  public log(name?: string): Option<T> {
    console.info((name || ''), this._value);
    return this;
  }
}

function validate<T>(input: unknown, validator?: Validator<T>): input is T {
  if (validator) {
    return validator(input);
  }

  return genericValidator(input);
}

export const some = <T>(input: T | Option<T>, validator?: Validator<T>) =>
  new Option<T>(input, validator);

export const none = <T>() => new Option<T>();

export function tryExec<T>(fn: () => T, defValue: T): T {
  try { return fn(); } catch { return defValue; }
}
