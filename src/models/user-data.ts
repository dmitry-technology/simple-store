export type UserData = {
    id: string,
    email?: string,
    name?: string,
    phoneNumber?: string,
    deliveryAddress?: DeliveryAddress,
    photoURL?: string,
    isAdmin?: boolean,
    isFirstLogin?: boolean
}

export type DeliveryAddress = {
    street: string,
    house: string,
    flat?: string,
    floor?: string,
    comment?: string
}

export const userDataSimple: UserData = {
    id: "ycd8mLBJBUSTp18S15Fi2mlQT1g1",
    email: "google@mail.com",
    name: "Jeff Bezos",
    phoneNumber: "88001009090",
    deliveryAddress: {street: 'Yitzhack I. Rager Blvd', house: '55', flat: '100', floor: '1', comment: ''}
}

export const nonAuthorisedUser: UserData = {id: ''};
export const emptyAddress: DeliveryAddress = {street: '', house: '', flat: '', floor: '', comment: ''};