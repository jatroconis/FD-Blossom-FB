export function characterSearchKey(filter: Record<string, unknown>) {
    const allowed = ['name', 'status', 'species', 'gender', 'origin', 'favorite'] as const;

    // recoge solo las keys permitidas y valores definidos/no vacíos
    const picked: Record<string, unknown> = {};
    for (const k of allowed) {
        const v = filter[k];
        if (v !== undefined && v !== '') picked[k] = v;
    }

    // ordena por key para estabilidad y normaliza valores a string en lower
    const parts = Object.keys(picked)
        .sort()
        .map((k) => {
            const val = picked[k];
            // booleans van como 'true'/'false'
            if (typeof val === 'boolean') return `${k}=` + (val ? 'true' : 'false');
            return `${k}=` + String(val).toLowerCase();
        });

    return `character:search:${parts.length ? parts.join('|') : 'ALL'}`;
}
