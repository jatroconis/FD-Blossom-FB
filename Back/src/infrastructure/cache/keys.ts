export function characterSearchKey(filter: Record<string, unknown>) {
    // Normaliza y construye una clave estable
    const norm: Record<string, unknown> = {};
    const allowed = ['name', 'status', 'species', 'gender', 'origin'] as const;
    for (const k of allowed) {
        const v = filter[k];
        if (typeof v === 'string' && v.trim() !== '') norm[k] = v.trim();
    }
    const payload = JSON.stringify(norm);
    return `character:search:${payload}`;
}