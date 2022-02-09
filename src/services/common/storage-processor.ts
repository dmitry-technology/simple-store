import StorageProvider from "./storage-provider";

export default class StorageProcessor {
    constructor(private storageProvider: StorageProvider) { }

    async uploadFile(file: File): Promise<string> {
        return this.storageProvider.uploadFile(file);
    }
}