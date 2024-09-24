import { Product } from '@prisma/client'
import { UserPayLoad } from '~/interfaces/UserInterface'
import { ProductBody, queryString } from '~/interfaces/productInterface'
import { BadRequestException, NotfoundException, UnauthorizedException } from '~/middleWares.ts/errorMiddleware'
import { prisma } from '~/prisma'
import { APIFeatures } from '~/utils/APIfeatuers'
import { helper } from '~/utils/helpers'
import RedisCache from './redis.cache'
import { Redis_Keys } from '~/utils/redis.keys'
import { productCache } from '~/utils/productsCach'


const redisCache: RedisCache = new RedisCache()


class ProductService {
    public async add(
        RequestBody: ProductBody,
        loggedUser: UserPayLoad,
        mainImage: Express.Multer.File | undefined
    ): Promise<Product> {
        const {
            name,
            longDescription,
            shortDescription,
            quantity,
            categoryId,
            price
            //  main_image
        } = RequestBody

        const product: Product = await prisma.product.create({
            data: {
                name,
                longDescription,
                shortDescription,
                quantity: +quantity,
                categoryId: +categoryId,
                price: +price,
                shopId: loggedUser.id,
                main_image: mainImage?.filename ? mainImage.filename : ''
                // main_image
            }
        })

        await productCache.invalidateProducts()

        return product
    }

    public async read(query: queryString): Promise<Product[]> {



        const apiFeatures = new APIFeatures(query)

        const cacheKey = `products:${JSON.stringify(apiFeatures.getWhereClause())}:${apiFeatures.getPaginationOptions().skip}:${apiFeatures.getPaginationOptions().take}`

        await productCache.getCach(cacheKey)



        const products: Product[] = await prisma.product.findMany({
            where: apiFeatures.getWhereClause(),
            ...apiFeatures.getPaginationOptions()
        })

        await productCache.saveCach(cacheKey)

        return products
    }

    // public async pagination(query: queryString): Promise<Product[]> {
    //     const { page = 1, limit = 10, sortBy = 'price', sortDir = 'asc', filterBy, filterValue, filterCondition } = query

    //     const parsedPage = +page
    //     const parsedlimit = +limit

    //     if (isNaN(parsedPage) || parsedPage <= 0) {
    //         throw new BadRequestException(`Page:${parsedPage} must be a positive number`);
    //     }

    //     if (isNaN(parsedlimit) || parsedlimit <= 0) {
    //         throw new BadRequestException(`Limit:${parsedlimit} must be a positive number`);
    //     }

    //     const validSortByFields = ['quantity', 'name', 'price', 'categoryId'] as const;
    //     if (!validSortByFields.includes(sortBy)) {
    //         throw new BadRequestException(`Invalid sortBy value: ${sortBy}. Valid options are ${validSortByFields.join(', ')}`);
    //     }

    //     const validSortDirections = ['asc', 'desc'] as const;
    //     if (!validSortDirections.includes(sortDir)) {
    //         throw new BadRequestException(`Invalid sortDir value: ${sortDir}. Valid options are 'asc' or 'desc'`);
    //     }

    //     const stringFilterConditions = ['contains', 'startsWith', 'endsWith', 'equals', 'not'] as const;
    //     const numericFilterConditions = ['lt', 'lte', 'gt', 'gte', 'equals', 'not'] as const;

    //     if (filterCondition && filterBy) {
    //         const validStringFields = ['name', 'longDescription', 'shortDescription'];
    //         const validNumericFields = ['price', 'quantity', "categoryId"];

    //         if (validStringFields.includes(filterBy) && !stringFilterConditions.includes(filterCondition)) {
    //             throw new BadRequestException(`Invalid filterCondition for string field: ${filterCondition}. Valid options are '${stringFilterConditions.join(', ')}'`);
    //         }

    //         if (validNumericFields.includes(filterBy) && !numericFilterConditions.includes(filterCondition)) {
    //             throw new BadRequestException(`Invalid filterCondition for numeric field: ${filterCondition}. Valid options are '${numericFilterConditions.join(', ')}'`);
    //         }

    //         const validFilterValueFields = ['price', 'quantity', 'longDescription', 'shortDescription', 'name', 'categoryId'] as const;
    //         if (filterBy && !validFilterValueFields.includes(filterBy)) {
    //             throw new BadRequestException(`Invalid filterValue value: ${filterBy}. Valid options are '${validFilterValueFields.join(', ')}'`);
    //         }

    //     }

    //     const whereClause: any = {};

    //     if (filterBy && filterCondition && filterValue) {
    //         if (filterBy === 'price' || filterBy === 'quantity' || filterBy === 'categoryId') {

    //             whereClause[filterBy] = {
    //                 [filterCondition]: query.filterValue,
    //             }
    //         } else {
    //             whereClause[filterBy] = {
    //                 [filterCondition]: query.filterValue,
    //                 mode: 'insensitive'

    //             }
    //         };
    //     }

    //     const skip: number = (parsedPage - 1) * parsedlimit
    //     const take: number = parsedlimit

    //     const products: Product[] = await prisma.product.findMany({
    //         where: whereClause,
    //         skip,
    //         take,
    //         orderBy: {
    //             [sortBy]: sortDir
    //         }
    //     })

    //     return products
    // }

    public async readOne(id: number) {

        await productCache.getCachForOneProduct(`${Redis_Keys.PRODUCTS}:${id}`)

        const product: Product | null = await prisma.product.findFirst({
            where: {
                id
            },
            include: {
                productImages: true,
                ProductVariant: {
                    include: {
                        ProductVariantItem: true
                    }
                }
            }
        })

        if (!product) {
            throw new NotfoundException(`Product with Id:${id} not found`)
        }

        await productCache.saveCachForOneProduct(`${Redis_Keys.PRODUCTS}:${id}`, product)

        return product
    }
    public async editOne(
        id: number,
        requestBody: ProductBody,
        loggedUser: UserPayLoad,
        mainImage: Express.Multer.File
    ): Promise<Product> {
        // const existingProduct = await prisma.product.findUnique({
        //     where: { id },
        // });

        // if (!existingProduct) {
        //     throw new NotfoundException(`Product with ID:${id} does not exist`);
        // }

        // if (existingProduct.shopId !== loggedUser.id && loggedUser.role !== 'ADMIN') {
        //     throw new UnauthorizedException('You are not permitted to update the current records')
        // }
        const { name, longDescription, shortDescription, quantity, main_image, categoryId, price } = requestBody

        const existingProduct = await this.getProductById(id)

        // helper.checkPermisson(existingProduct, loggedUser)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)

        const product: Product = await prisma.product.update({
            where: { id },
            data: {
                name,
                longDescription,
                shortDescription,
                quantity: +quantity,
                main_image: mainImage.filename,
                categoryId: +categoryId,
                price: +price
            }
        })
        await productCache.invalidateProducts()

        return product
    }

    public async remove(id: number, loggedUser: UserPayLoad): Promise<Product> {
        const existingProduct = await this.getProductById(id)
        helper.checkPermisson(existingProduct, 'shopId', loggedUser)

        const product: Product = await prisma.product.delete({ where: { id } })

        if (!product) {
            throw new NotfoundException(`Product with ID:${id} not found`)
        }
        await productCache.invalidateProducts()

        return product
    }

    public async readMyproducts(loggedUser: UserPayLoad, query: queryString) {
        const apiFeatures = new APIFeatures(query)

        const cacheKey = `products:${JSON.stringify(apiFeatures.getWhereClause())}:${apiFeatures.getPaginationOptions().skip}:${apiFeatures.getPaginationOptions().take}`

        await productCache.getCach(cacheKey)

        const products = await prisma.product.findMany({
            where: {
                shopId: loggedUser.id,
                ...apiFeatures.getWhereClause()
            },
            ...apiFeatures.getPaginationOptions()
        })

        await productCache.saveCach(cacheKey)

        return products
    }

    public async getProductById(id: number) {
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        })

        if (!existingProduct) {
            throw new NotfoundException(`Product with ID:${id} does not exist`)
        }
        return existingProduct
    }
}

export const productService: ProductService = new ProductService()
