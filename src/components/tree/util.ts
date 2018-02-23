
export function omit(value: any, propToSkip: string): any {
    return Object.keys(value).reduce((result, prop) => {
        if (prop === propToSkip) {
            return result;
        }
        return Object.assign(result, { [prop]: value[prop]});
    }, {});
}

export function isNil(value: any): boolean {
    return value === undefined || value === null;
}

export function isEmpty(value: any[] | string): boolean {
    if (typeof value === 'string') {
        return !/\S/.test(value);
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return isNil(value);
}

export function size(value: any[]) {
    return isEmpty(value) ? 0 : value.length;
}

export function get(value: any, path: string, defaultValue?: any) {
    let result = value;

    for (const prop of path.split('.')) {
        if (!value || !Reflect.has(result, prop)) {
            return defaultValue;
        }
        result = result[prop];
    }
    return isNil(result) || result === value ? defaultValue : result;
}
