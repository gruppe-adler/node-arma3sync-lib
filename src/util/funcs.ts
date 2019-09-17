export function TODO(): void {
    throw new Error('not implemented');
}

export function toMap<T>(arr: T[], keyMapper: (elem: T) => string): { [key: string]: T } {
    const result = {};
    arr.forEach(elem => {
        result[keyMapper(elem)] = elem;
    });

    return result;
}

export function toNameMap<T extends { name: string }>(arr: T[]): { [key: string]: T } {
    return toMap(arr, _ => _.name);
}
