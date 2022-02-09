export type UserData = {
    id: string,
    email?: string,
    name?: string,
    deliveryAddress?: DeliveryAddress;
    isAdmin?: boolean
}

export type DeliveryAddress = {
    street: string,
    house: string,
    flat?: string,
    entrance?: string,
    floor?: string,
    code?: string
}

export const nonAuthorisedUser: UserData = {id: ''};