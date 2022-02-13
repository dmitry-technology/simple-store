export default interface LocalProvider<T> {
    add(item: T): T,
    get(id: string): T | null,
    getAll(): T[],
    exists(id: string): boolean,
    update(id: string, newItem: T): T | null,
    remove(id: string): T | null,
    removeAll(): void
}