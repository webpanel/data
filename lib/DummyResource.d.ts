import { Resource, ResourceConfig } from './Resource';
export interface DummyResourceConfig<T> extends ResourceConfig<T> {
}
export declare class DummyResource<T> extends Resource<T, DummyResourceConfig<T>> {
    get: () => Promise<void>;
    create: (values: T) => Promise<void>;
    put: (values: T) => Promise<void>;
    patch: (values: Partial<T>, props?: {
        fields?: string[] | undefined;
    } | undefined) => Promise<void>;
    delete: () => Promise<void>;
}
