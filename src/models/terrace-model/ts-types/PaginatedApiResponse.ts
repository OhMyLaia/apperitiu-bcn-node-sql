import { BusinessApiType } from "../zod/business-schema.js";

export type PaginatedAPIResponse<T> = {
    result: {
        total: number;
        records: BusinessApiType[];
        resource_id: string;
        limit: number;
        _links: { next?: string };
    };
};