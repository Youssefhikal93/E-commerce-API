import { BadRequestException } from "~/middleWares.ts/errorMiddleware";
import { prisma } from "~/prisma";

class DashBoardService {
    public async overAllstatus() {
        const productsCount = await prisma.product.count()
        const activeUsersCount = await prisma.user.count({
            where: { isActive: true }
        })

        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalPrice: true }
        })

        const totalpurschedNumbersofrProduct = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                price: true,
                quantity: true
            }
        })
        if (!totalpurschedNumbersofrProduct) {
            throw new BadRequestException('no products pursched to evalute the revenue')
        }
        const totalrevenueforSingleproduct = totalpurschedNumbersofrProduct.map(item => {
            return {
                productId: item.productId,
                totalRevenue: item._sum.price! * item._sum.quantity!
            }
        })

        return { productsCount, activeUsersCount, totalRevenue: totalRevenue._sum.totalPrice, totalrevenueforSingleproduct, totalpurschedNumbersofrProduct }
    }
}

export const dashBoardService: DashBoardService = new DashBoardService()