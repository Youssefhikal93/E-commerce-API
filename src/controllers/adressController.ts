import { Request, Response } from "express";
import { adressServices } from "~/services/AdressServcies";
import parseAndValidateId from "~/utils/parseAndValidateId";

class AdressController {

    public async createAdress(req: Request, res: Response) {
        const address = await adressServices.addAddress(req.body, req.user)

        return res.status(201).json({
            status: 'succses',
            data: {
                address
            }
        })


    }
    public async getAllAddresses(req: Request, res: Response) {
        const addresses = await adressServices.fetch(req.user)

        return res.status(200).json({
            status: 'succses',
            results: addresses.length,
            data: {
                addresses
            }
        })
    }


    public async updatedAddress(req: Request, res: Response) {

        const id = parseAndValidateId(req)

        const address = await adressServices.edit(id, req.body, req.user)
        return res.status(200).json({
            status: 'succses',

            data: {
                address
            }
        })
    }

    public async deleteAdress(req: Request, res: Response) {
        const id = parseAndValidateId(req)

        await adressServices.remove(id, req.user)

        return res.status(204).json(null)
    }
}
export const adressController: AdressController = new AdressController()
