/**
 * Explicit success/failure for *expected* outcomes — validation failures, rate
 * limits, bad credentials. Unexpected faults still throw.
 *
 * Keeps the service layer honest: callers must handle the failure case, and
 * route handlers can map an error code straight onto an HTTP status.
 */
export type Ok<T> = { ok: true; data: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export const ok = <T>(data: T): Ok<T> => ({ ok: true, data });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });
