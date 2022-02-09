import { Observable } from "rxjs";

export default interface DataProvider<T> {
    add(good: T): Promise<T>;
    get(id?: number): Observable<T[]> | Promise<T>;
    update(id: number, newProduct: T): Promise<T>;
    remove(id: number): Promise<T>;
    exists(id: number): Promise<boolean>;
}