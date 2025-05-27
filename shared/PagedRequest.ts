export interface PagedRequest {
    orderingPropertyName?: string | null;
    descending?: boolean | null;
    index: number;
    count: number;
    filter?: QueryParams;
}

export type QueryParams = Record<string, QueryValue | QueryValue[]>;
// Query parameter types for filtering
type QueryValue = string | number | boolean | null | undefined;