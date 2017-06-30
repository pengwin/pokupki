export interface EventSaveModel {
    readonly type: string;
    readonly version: string;
    readonly payload: any;
}

export interface Event extends EventSaveModel {
    readonly id: string;
    readonly created: string;
}
