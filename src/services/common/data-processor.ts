import { Observable } from "rxjs";
import DataProvider from "./data-provider";

export default abstract class DataProcessor<T> {
    constructor(protected dataProvider: DataProvider<T>) { }

    add(obj: T): Promise<T> {
        return this.dataProvider.add(obj);
    }

    remove(id: number): Promise<T> {
        return this.dataProvider.remove(id);
    }

    update(id: number, newObj: T): Promise<T> {
        return this.dataProvider.update(id, newObj);
    }

    getAll(): Observable<T[]> {
        return (this.dataProvider.get() as Observable<T[]>);
    }

    get(id: number): Promise<T> {
        return this.dataProvider.get(id) as Promise<T>;
    }
}