export type LoginData = {
    email: string,
    password: string,
    loginType?: LoginType
}

export enum LoginType {
    WITH_PASSWORD, WITH_EMAIL_LINK, WITH_SOCIAL_PROVIDER
}