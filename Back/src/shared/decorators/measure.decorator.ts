import { logger } from '../../infrastructure/logger';

type AnyFn = (...args: any[]) => any;

function toMs(start: bigint) {
    return Number(process.hrtime.bigint() - start) / 1_000_000;
}

/**
 * @Measure('Etiqueta')
 * Mide el tiempo de ejecución del método (sync/async) y lo loguea.
 */
export function Measure(label?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original: AnyFn = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const start = process.hrtime.bigint();

            const done = (ok: boolean) => {
                const ms = toMs(start);
                const className =
                    (this && this.constructor && this.constructor.name) ||
                    (target && target.constructor && target.constructor.name) ||
                    'UnknownClass';
                const name = label ?? `${className}.${propertyKey}`;
                logger.info({ msg: `${name} took ${ms.toFixed(1)} ms`, ok });
            };

            try {
                const result = original.apply(this, args);
                // Maneja sync/async
                if (result && typeof result.then === 'function') {
                    return (result as Promise<any>)
                        .then((r) => {
                            done(true);
                            return r;
                        })
                        .catch((e) => {
                            done(false);
                            throw e;
                        });
                } else {
                    done(true);
                    return result;
                }
            } catch (err) {
                done(false);
                throw err;
            }
        };

        return descriptor;
    };
}
