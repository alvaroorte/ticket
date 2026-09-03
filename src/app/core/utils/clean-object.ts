type NonNullableProps<T> = {
    [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};

export function cleanObject<T extends object> (object: T): NonNullableProps<T> {
    const result = {} as NonNullableProps<T>;
    for (const [key, value] of Object.entries(object) as [keyof T, T[keyof T]][]) {
        if (value) (result as any)[key] = value;
    }
    return result;
}