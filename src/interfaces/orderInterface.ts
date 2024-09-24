import { Status } from "@prisma/client";

export interface OrderBodyCreation {
    couponCode: string,
    addressId: number
}


export interface OrderBodyUpdate {
    status: Status,
}