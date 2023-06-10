/**
 * Represents a type with some properties set to optional.
 * @template T The original type.
 * @template K The keys which should be made optional.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
