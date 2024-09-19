import { Cart, CartItem } from "@prisma/client"
import { UserPayLoad } from "~/interfaces/UserInterface"
import { prisma } from "~/prisma"
import { productService } from "./productServices"
import { NotfoundException } from "~/middleWares.ts/errorMiddleware"
import { helper } from "~/utils/helpers"
import { cartBody } from "~/interfaces/cartInterface"
import { Decimal } from "@prisma/client/runtime/library"

class CartServices {
    public async addToCart(requestedBody: cartBody, loggesUser: UserPayLoad) {
        const { productId, variant, quantity } = requestedBody

        const currentUser = await prisma.user.findFirst({ where: { id: loggesUser.id }, include: { Cart: true } })

        let cart: any

        if (currentUser?.Cart?.id) {
            const currentcart = await this.getCart(currentUser.Cart.id)
            cart = currentcart
        } else {
            cart = await prisma.cart.create({
                data: {
                    userId: loggesUser.id,
                    totalPrice: 0
                }
            })
        }
        const selectedProduct = await productService.getProductById(productId)
        // console.log(cart)


        const existingProductInCart = cart?.cartItems?.find((item: any) => item.productId === productId)

        let cartItem: CartItem
        if (!existingProductInCart) {
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    price: selectedProduct.price,
                    variant,
                    quantity,

                }
            })
        } else {
            const currentProductInCart = await this.getCartItemByProductId(productId)

            // console.log(currentProductInCart)
            cartItem = await prisma.cartItem.update({
                where: { id: currentProductInCart.id },
                data: {
                    quantity: currentProductInCart.quantity + (quantity || 1),


                }
            })

        }

        const updatedTotalPrice = cart.totalPrice + (cartItem.price * cartItem.quantity);

        // const updatedTotalPrice = cart.totalPrice.add(cartItem.price.mul(new Decimal(cartItem.quantity)));



        const userCart = await prisma.cart.update({
            where: { id: cartItem.cartId },
            include: { cartItems: true }, //optinal
            data: {
                totalPrice: await this.calculateTotalPrice(loggesUser)
            }
        })


        return userCart
    }
    public async fetchCartItems(loggesUser: UserPayLoad) {
        const cart = await prisma.cart.findFirst({
            where: { userId: loggesUser.id },
            include: {
                cartItems: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return this.returnCart(cart)
    }

    public async removeCart(loggesUser: UserPayLoad) {
        await prisma.cart.delete({
            where: { userId: loggesUser.id }
        })
    }
    public async removeCartItem(cartItemId: number, loggesUser: UserPayLoad) {

        const exixtingCartItem = await this.getCartItemById(cartItemId)
        // console.log(exixtingCartItem)
        helper.checkPermisson(exixtingCartItem.cart, 'userId', loggesUser)

        const exixtingCart = await this.getCart(exixtingCartItem.cartId)
        await prisma.cart.update({
            where: { id: exixtingCart.id },
            data: {
                // totalPrice: exixtingCart.totalPrice.sub(exixtingCartItem.price.mul(exixtingCartItem.quantity))
                totalPrice: exixtingCart.totalPrice - (exixtingCartItem.price * exixtingCartItem.quantity)
            }
        })

        await prisma.cartItem.delete({
            where: { id: cartItemId }
        })



    }

    private async calculateTotalPrice(loggedUser: UserPayLoad) {
        // const cart = await prisma.cart.findFirst({
        //     where: { userId: loggedUser.id },
        //     include: {
        //         cartItems: {
        //             include: {
        //                 product: true
        //             }
        //         }
        //     }
        // })
        const cart = await this.fetchCartItems(loggedUser)

        let totalPrice = 0;
        for (const cartItem of cart!.cartItems) {

            totalPrice += (cartItem.price * cartItem.quantity)
        }
        return totalPrice
    }

    private async getCart(cartId: number) {
        const exixtingCart = await prisma.cart.findFirst({
            where: { id: cartId },
            include: { cartItems: true }
        })
        if (!exixtingCart) {
            throw new NotfoundException('Cart was not found')
        }
        return exixtingCart
    }
    private async getCartItemByProductId(productId: number) {
        const existingCartItem = await prisma.cartItem.findFirst({
            where: { productId },
            include: { cart: true }
        });

        if (!existingCartItem) {
            throw new NotfoundException('Cart Item was not found by the productId provided')
        }

        return existingCartItem;
    }
    private async getCartItemById(id: number) {
        const exixtingCartItem = await prisma.cartItem.findFirst({
            where: { id },
            include: { cart: true }
        })
        if (!exixtingCartItem) {
            throw new NotfoundException('Cart Item was not found')
        }
        return exixtingCartItem
    }

    private async returnCart(cart: any) {
        // console.log(cart.cartItems)
        const cartItems = cart?.cartItems?.map((item: any) => {
            return {
                ...item,
                productName: item.product.name,
                productImage: item.product.main_image,
                product: undefined
            }
        })
        return {
            ...cart,
            cartItems: cartItems
        }

    }

}

export const cartServices: CartServices = new CartServices()