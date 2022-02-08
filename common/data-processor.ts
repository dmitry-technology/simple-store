import { Observable } from "rxjs";
import DataProvider from "./data-provider";

export default abstract class DataProcessor<T> {
    constructor(protected dataProvider: DataProvider<T>) { }

    addCourse(obj: T): Promise<T> {
        return this.dataProvider.add(obj);
    }

    removeCourse(id: number): Promise<T> {
        return this.dataProvider.remove(id);
    }

    updateCourse(id: number, newObj: T): Promise<T> {
        return this.dataProvider.update(id, newObj);
    }

    getAllCourses(): Observable<T[]> {
        return (this.dataProvider.get() as Observable<T[]>);
    }

    getCourse(id: number): Promise<T> {
        return this.dataProvider.get(id) as Promise<T>;
    }
}