import { Address } from "@prisma/client";
import { AddressBody } from "~/interfaces/AddressInterface";
import { UserPayLoad } from "~/interfaces/UserInterface";
import { BadRequestException, NotfoundException, UnauthorizedException } from "~/middleWares.ts/errorMiddleware";
import { prisma } from "~/prisma";
import { helper } from "~/utils/helpers";

class AdressServices {
    public async addAddress(requestedBody: AddressBody, loggedUser: UserPayLoad) {
        const { country, street, postalCode, province } = requestedBody

        const newAddress: Address = await prisma.address.create({
            data: {
                country,
                street,
                postalCode,
                province,
                userId: loggedUser.id
            }
        })
        return newAddress
    }
    public async fetch(loggedUser: UserPayLoad) {
        const addresses = await prisma.address.findMany({
            where: {
                userId: loggedUser.id
            }
        })
        return addresses
    }

    public async edit(addressid: number, requestedBody: AddressBody, loggedUser: UserPayLoad) {
        const { country, street, postalCode, province } = requestedBody

        const existingAdress = await this.getExisitingAdress(addressid)

        helper.checkPermisson(existingAdress, 'userId', loggedUser)


        const updatedAddress = await prisma.address.update({
            where: {
                id: addressid
            },
            data: {
                country,
                street,
                postalCode,
                province
            }
        })
        return updatedAddress
    }

    public async remove(addressId: number, loggedUser: UserPayLoad) {

        const existingAdress = await this.getExisitingAdress(addressId)

        if (existingAdress.userId !== loggedUser.id) {
            throw new UnauthorizedException('You are not authorized to proceed with the action')
        }

        await prisma.address.delete({
            where: { id: addressId }
        })

    }

    private async getExisitingAdress(id: number) {
        const existingAdress = await prisma.address.findFirst({
            where: { id }
        })
        if (!existingAdress) {
            throw new NotfoundException(`No Adress found with the selected ID :${id}`)
        }
        return existingAdress
    }

}

export const adressServices: AdressServices = new AdressServices()