export type UserData = {
    id: string,
    email?: string,
    name?: string,
    phoneNumber?: string,
    deliveryAddress?: DeliveryAddress,
    photoURL?: string,
    isAdmin?: boolean
}

export type DeliveryAddress = {
    street: string,
    house: string,
    flat?: string,
    floor?: string,
    comment?: string
}

export const nonAuthorisedUser: UserData = {id: ''};
export const emptyAddress: DeliveryAddress = {street: '', house: '', flat: '', floor: '', comment: ''};