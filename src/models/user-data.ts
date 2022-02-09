export type UserData = {
    id: string,
    email?: string,
    name?: string,
    photoURL?: string,
    isAdmin?: boolean
}

export const nonAuthorisedUser: UserData = {id: ''};