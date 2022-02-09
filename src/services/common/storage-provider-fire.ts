import { getDownloadURL, getStorage, ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import fireApp from "../../config/firebase-config";
import StorageProvider from "./storage-provider";

export default class StorageProviderFire implements StorageProvider {

    private storage;

    constructor(private folderName: string) {
        this.storage = getStorage(fireApp);
    }

    async uploadFile(file: File): Promise<string> {
        const storageRef = ref(this.storage, `${this.folderName}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        const uploadTaskSnap = await uploadTask;
        const url = await getDownloadURL(uploadTaskSnap.ref);
        return url;
    }
}