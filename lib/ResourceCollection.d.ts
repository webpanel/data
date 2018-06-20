import { ResourceBase } from './ResourceBase';
export declare class ResourceCollection extends ResourceBase<any[] | null> {
    count: number | undefined;
    get: () => Promise<void>;
}
