export interface Action<T> {
    readonly type: string;
    readonly payload: T;
    readonly fromServer?: boolean;
}
