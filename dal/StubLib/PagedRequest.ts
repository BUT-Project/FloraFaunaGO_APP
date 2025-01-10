export interface PagedRequest {
    orderingPropertyName?: string | null;
    descending?: boolean | null;
    index: number;
    count: number;
}