import { Observable } from "rxjs";

export default interface DataProvider<T> {
    add(good: T): Promise<T>;
    get(id?: string): Observable<T[]> | Promise<T>;
    fetch(): Promise<T[]>;
    exists(id: string): Promise<boolean>;
    update(id: string, newProduct: T): Promise<T>;
    remove(id: string): Promise<T>;
}