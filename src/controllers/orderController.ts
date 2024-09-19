import { Request, Response } from "express";
import { date } from "joi";
import { parse } from "path";
import { adressServices } from "~/services/AdressServcies";
import { orderService } from "~/services/orderServices";
import parseAndValidateId from "~/utils/parseAndValidateId";

class OrderController {

    public async createOrder(req: Request, res: Response) {
        const newOrder = await orderService.addOrder(req.body, req.user)

        res.status(201).json({
            status: 'succses',
            data: {
                newOrder
            }
        })
    }

    public async editOrderStatus(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        const order = await orderService.edit(id, req.body, req.user)

        return res.status(200).json({
            status: 'sucsses',
            date: {
                order
            }
        })
    }
    public async getMyOrders(req: Request, res: Response) {
        const orders = await orderService.getMyOrders(req.user)

        return res.status(200).json({
            status: 'sucsses',
            results: orders.length,
            date: {
                orders
            }
        })
    }

    public async getMyOrder(req: Request, res: Response) {
        const id = parseAndValidateId(req)
        const order = await orderService.fetchAnOrder(id, req.user)

        return res.status(200).json({
            status: 'sucsses',
            data: {
                order
            }
        })
    }

    public async getAllOrders(req: Request, res: Response) {
        const orders = await orderService.getAllOrdersForAllUsers()

        return res.status(200).json({
            status: 'sucsses',
            results: orders.length,
            data: {
                orders
            }
        })
    }
}
export const orderController: OrderController = new OrderController()
