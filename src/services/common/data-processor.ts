import { Observable } from "rxjs";
import DataProvider from "./data-provider";

export default abstract class DataProcessor<T> {
    constructor(protected dataProvider: DataProvider<T>) { }

    add(obj: T): Promise<T> {
        return this.dataProvider.add(obj);
    }

    remove(id: string): Promise<T> {
        return this.dataProvider.remove(id);
    }

    update(id: string, newObj: T): Promise<T> {
        return this.dataProvider.update(id, newObj);
    }

    getAll(): Observable<T[]> {
        return (this.dataProvider.get() as Observable<T[]>);
    }

    fetch(): Promise<T[]> {
        return (this.dataProvider.fetch() as Promise<T[]>);
    }

    get(id: string): Promise<T> {
        return this.dataProvider.get(id) as Promise<T>;
    }

    exists(id: number): Promise<boolean> {
        return this.dataProvider.exists(id);
    }
}