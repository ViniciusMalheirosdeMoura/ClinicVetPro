export type ServiceOk<T> = { ok: true; data: T };
export type ServiceErr = { ok: false; error: string; code: number };
export type ServiceResult<T> = ServiceOk<T> | ServiceErr;

export const ok = <T>(data: T): ServiceOk<T> => ({ ok: true, data });
export const err = (code: number, error: string): ServiceErr => ({ ok: false, code, error });
