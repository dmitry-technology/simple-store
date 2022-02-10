export type ConfirmationData = {
    title: string;
    message: string;
    handle: (statis:boolean) => void
}

export const emptyConfirmationData: ConfirmationData = {
    title: '',
    message: '',
    handle: (status: boolean) => {}
}