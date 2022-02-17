import { localPhoneValidationRegex } from "../../config/servicesConfig";
import { UserData } from "../../models/user-data";

export enum ProfileStatus { OK, NO_ADDRESS, BAD_PROFILE }

export function isEmailValid(email: string | undefined): boolean {
    if (email === undefined) return false;
    const regularExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
}

export function isPhoneNumberValid(tel: string | undefined): boolean {
    if (tel === undefined) return false;
    const regularExpression = localPhoneValidationRegex;
    return tel.match(regularExpression) ? true : false;
}

export function getProfileStatus(client: UserData): ProfileStatus {
    if (!client.name || !client.email || !client.phoneNumber) return ProfileStatus.BAD_PROFILE;
    if (!client.deliveryAddress?.street || !client.deliveryAddress?.house) return ProfileStatus.NO_ADDRESS;
    return ProfileStatus.OK;
}