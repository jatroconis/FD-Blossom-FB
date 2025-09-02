export class UpstreamHttpError extends Error {
    status?: number;
    code?: string;

    constructor(message: string, opts?: { status?: number; code?: string }) {
        super(message);
        this.name = 'UpstreamHttpError';
        this.status = opts?.status;
        this.code = opts?.code;
    }
}

/** Transforma cualquier error (axios-like o no) en UpstreamHttpError */
export function asUpstreamError(err: unknown): UpstreamHttpError {
    const e = err as any;
    const status: number | undefined = e?.response?.status;
    const msg: string =
        e?.message || e?.response?.statusText || 'Upstream error';
    const code: string | undefined = e?.code;
    return new UpstreamHttpError(msg, { status, code });
}
