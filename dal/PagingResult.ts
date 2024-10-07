class PagingResult<T> {
    count: number = 1;
    index: number = 1;
    total: number = 1;
    items: T[];

    constructor(index: number = 1, count: number = 1, total: number = 1, items: T[] = []) {
        this.index = index;
        this.count = count;
        this.total = total;
        this.items = items;
    }
}