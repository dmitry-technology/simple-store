export default interface StorageProvider {
    uploadFile(file: File): Promise<string>;
} 