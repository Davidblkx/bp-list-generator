// ================================================================================================
// helper funciton for Type guard
// see https://www.typescriptlang.org/docs/handbook/advanced-types.html
// ================================================================================================

export type Validator<T> = (input: unknown) => input is T;

export function genericValidator<T>(input: unknown): input is T {
  const type = typeof input;
  return type !== 'undefined'
    && input !== null
    && input !== undefined
    && input !== NaN;
}

export function isCheerioStatic(input: unknown): input is CheerioStatic {
  if (genericValidator<CheerioStatic>(input)) {
    return typeof input === 'function'
      && typeof input.contains === 'function'
      && typeof input.html === 'function'
      && typeof input.parseHTML === 'function'
      && typeof input.xml === 'function';
  }

  return false;
}

export function isString(input: unknown): input is string {
  return typeof input === 'string';
}
