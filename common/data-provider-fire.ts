import DataProvider from "./data-provider";
import { Observable } from "rxjs";
import { Product } from "../../models/product";
import { collection, doc, getDoc, setDoc, deleteDoc, getFirestore, CollectionReference } from 'firebase/firestore';
import fireApp from "../../config/firebase-config";
import { collectionData } from "rxfire/firestore";
import { catchError } from 'rxjs/operators'
import ErrorType from "../../models/error-types";
import { getRandomInteger } from "../../utils/common/random";

export default class DataProviderFire<T> implements DataProvider<T> {

    fireCollection: CollectionReference;

    constructor(collectionName: string, private minId?: number, private maxId?: number) {
        this.fireCollection = collection(getFirestore(fireApp), collectionName);
    }

    async add(obj: T): Promise<T> {
        if (this.minId && this.maxId) {
            const id = await this.getRandomId();
            obj = { ...obj, id };
        }
        await this.setObj((obj as any).id, obj);
        return obj;
    }

    async remove(id: number): Promise<T> {
        const obj = await this.get(id);
        const docRef = doc(this.fireCollection, id.toString());
        try {
            await deleteDoc(docRef);
        } catch (err) {
            throw ErrorType.AUTH_ERROR;
        }
        return obj as T;
    }

    async exists(id: number): Promise<boolean> {
        const docRef = doc(this.fireCollection, id.toString());
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    }

    get(id?: number): Promise<T> | Observable<T[]> {
        if (id !== undefined) {
            const docRef = doc(this.fireCollection, id.toString())
            return getDoc(docRef).then(docSnap => docSnap.data() as T);

        }
        return (collectionData(this.fireCollection) as Observable<T[]>)
            .pipe(catchError(err => {
                console.log(err);
                throw err.code ? ErrorType.AUTH_ERROR : ErrorType.SERVER_UNAVAILABLE
            }));
    }

    async update(id: number, newObj: T): Promise<T> {
        const obj = await this.get(id);
        await this.setObj(id, newObj);
        return obj as T;
    }

    private async setObj(id: number, newObj: T) {
        try {
            await setDoc(doc(this.fireCollection, id.toString()), newObj);
        } catch (err) {
            throw ErrorType.AUTH_ERROR;
        }
    }

    private async getRandomId(): Promise<number> {
        let res: number;
        do {
            res = getRandomInteger(this.minId!, this.maxId!);
        } while (await this.exists(res))
        return res;
    }

}