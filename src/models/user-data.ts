export type UserData = {
    userName: string,
    displayName: string,
    isAdmin: boolean
}

export const nonAuthorisedUser: UserData = {userName: '', displayName: '', isAdmin: false};