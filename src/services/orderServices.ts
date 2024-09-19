import { UserPayLoad } from "~/interfaces/UserInterface";
import { cartServices } from "./cartServices";
import { prisma } from "~/prisma";
import { Address, Cart, Coupon } from "@prisma/client";
import { couponService } from "./coupounService";
import { BadRequestException, NotfoundException, UnauthorizedException } from "~/middleWares.ts/errorMiddleware";
import { helper } from "~/utils/helpers";
import { not } from "joi";

class OrderService {

    public async addOrder(requestedBody: any, loggedUser: UserPayLoad) {

        //create order based on the created cart
        const myCart = await prisma.cart.findFirst({
            where: { userId: loggedUser.id },
            include: {
                cartItems: {
                    include: {
                        product: true
                    }
                }
            }
        })
        if (!myCart) {
            throw new NotfoundException(`the cart dose not have items to place the order`)
        }


        const { couponCode, addressId } = requestedBody

        let coupon: Coupon | null = null;

        // Check if coupounCode exists, and only fetch the coupon if it does
        if (couponCode) {
            coupon = await couponService.getCouponByCopuneCode(couponCode);

            if (!coupon) {
                throw new NotfoundException(`The coupon provided: ${couponCode} does not exist`);
            }
        }

        const addresses: Address[] | null = await prisma.address.findMany({
            where: { userId: loggedUser.id }
        })


        const isValidAddress = addresses.some((oneAddress) => oneAddress.id === addressId);

        if (!isValidAddress) {
            throw new NotfoundException("The provided addressId does not match any of the addresses associated with your profile.");
        }

        const newOrder = await prisma.order.create({
            data: {
                addressId,
                totalPrice: 0,
                status: 'PENDING',
                userId: loggedUser.id,
                // coupounCode
                couponCode: coupon ? coupon.code : null

            }
        })

        // get cart items from cart to the order

        const orderItems = []
        let totalQuantity = 0

        for (const cartItem of myCart.cartItems) {
            orderItems.push({
                orderId: newOrder.id,
                productId: cartItem.productId,
                variant: cartItem.variant,
                price: cartItem.price,
                quantity: cartItem.quantity
            })
            totalQuantity += cartItem.quantity
        }
        await prisma.orderItem.createMany({
            data: orderItems
        })



        //clear the cart 
        cartServices.removeCart(loggedUser)

        //update total price of order
        const finalOrder = await prisma.order.update({
            where: { id: newOrder.id },
            data: {
                // totalPrice: myCart.totalPrice,
                totalQuantity: totalQuantity,
                totalPrice: coupon
                    ? helper.getOrderPriceWithCoupon(coupon, myCart.totalPrice)
                    : myCart.totalPrice
            }
        })

        return finalOrder
    }

    public async edit(orderId: number, requestedBody: any, loggedUser: UserPayLoad) {

        const { status } = requestedBody



        const existingOrder = await this.getOrderId(orderId)

        if (existingOrder.status !== 'PENDING') {
            throw new BadRequestException("Status dosn't support any modification of the order")
        }


        for (const element of existingOrder.orderItems) {
            const product = element.product

            if (product.shopId !== loggedUser.id && loggedUser.role !== 'ADMIN') {
                throw new UnauthorizedException('You are not authorized to modfiy the order status')
            }

        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })
        return updatedOrder
    }

    public async getMyOrders(loggedUser: UserPayLoad) {
        const MyOrders = await prisma.order.findMany({ where: { userId: loggedUser.id } })

        return MyOrders
    }

    public async fetchAnOrder(orderId: number, loggedUser: UserPayLoad) {



        const MyOrder = await prisma.order.findFirst({
            where: { id: orderId },
            include: {
                orderItems: true
                // {
                //     include: {
                //         product: true
                //     }
                // }
            }
        })

        if (!MyOrder) {
            throw new NotfoundException('No order found')
        }
        // console.log(MyOrder)
        helper.checkPermisson(MyOrder, 'userId', loggedUser)

        return MyOrder
    }

    public async getAllOrdersForAllUsers() {
        const allOrders = await prisma.order.findMany()

        return allOrders
    }


    private async getOrderId(orderId: number) {
        const order = await prisma.order.findFirst({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })
        if (!order) {
            throw new NotfoundException(`no orderId found with Id:${orderId}`)
        }
        return order
    }

}
export const orderService: OrderService = new OrderService()
