import { UserData } from "../models/user-data";

export function printUser(userdata: UserData, comment: string) {
    console.log(`======= ${comment} =======`);
    console.log("id: " + userdata.id);
    console.log("name: " + userdata.name);
    console.log("email: " + userdata.email);
    console.log("phone: " + userdata.phoneNumber);
    console.log("isAdmin: " + userdata.isAdmin);
    console.log(`address: ${userdata.deliveryAddress?.street} ${userdata.deliveryAddress?.house}`);
    console.log(`==========================`);
}