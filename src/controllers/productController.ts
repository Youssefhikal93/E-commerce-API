import { Request, Response } from "express"
import { BadRequestException } from "~/middleWares.ts/errorMiddleware"
import parseAndValidateId from "~/utils/parseAndValidateId"
import { productService } from "~/services/productServices"

class ProductController {

    public async getAll(req: Request, res: Response) {

        const products = await productService
            .read(req.query)

        res.status(200).json({
            status: 'succses',
            results: products.length,
            data: {
                products
            }
        })
    }

    public async getOne(req: Request, res: Response) {

        const id = parseAndValidateId(req)
        const product = await productService.readOne(id)

        res.status(200).json({
            status: 'succses',
            data: {
                product
            }
        })
    }
    public async createOne(req: Request, res: Response) {
        const product = await productService.add(req.body, req.user, req.file!)
        return res.status(201).json({
            status: 'succses',
            data: {
                product
            }
        })
    }

    public async updateOne(req: Request, res: Response) {

        const id = parseAndValidateId(req)


        const category = await productService.editOne(id, req.body, req.user, req.file!)

        res.status(200).json({
            status: 'succses',
            data: {
                category
            }
        })
    }

    public async deleteOne(req: Request, res: Response) {
        const id = parseAndValidateId(req)

        await productService.remove(id, req.user)
        res.status(204).json({
            data: null
        })
    }
    public async getMyProducts(req: Request, res: Response) {
        const products = await productService.readMyproducts(req.user, req.query)
        return res.status(200).json({
            status: 'succses',
            results: products.length,
            data: {
                data: products
            }
        })

    }

}

export const productController: ProductController = new ProductController()