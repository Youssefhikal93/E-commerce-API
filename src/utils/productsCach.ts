import RedisCache from "~/services/redis.cache"
import { Redis_Keys } from "./redis.keys"
import { Product } from "@prisma/client"

const redisCache: RedisCache = new RedisCache()

class ProductCache {
    public async getCach(key: string) {
        const cahcedProduts = await redisCache.client.GET(key)

        if (cahcedProduts) {
            console.log('This data from cache')
            return JSON.parse(cahcedProduts)
        }
    }

    public async saveCach(key: string) {
        await redisCache.client.SET(key, JSON.stringify(Redis_Keys.PRODUCTS), { EX: 60 * 60 * 60 })
    }

    public async invalidateProducts() {
        await redisCache.client.DEL(`${Redis_Keys.PRODUCTS}:*`);

    }

    // public async getCachForOneProduct(key: string) {
    //     const cahcedProduct = await redisCache.client.HGETALL(key)

    //     const cachedObject = { ...cahcedProduct }



    //     if (Object.keys(cachedObject).length) {
    //         const dataToreturn: Product = {
    //             ...cachedObject,
    //             createdAt: new Date(cachedObject.createdAt),
    //             updatedAt: new Date(cachedObject.updatedAt),
    //             shopId: +cachedObject.shopId,
    //             price: +cachedObject.price,
    //             id: +cachedObject.id,
    //             categoryId: +cachedObject.categoryId,
    //             quantity: +cachedObject.quantity,
    //             //@ts-ignore
    //             productImages: JSON.parse(cachedObject.productImages),
    //             productVariants: JSON.parse(cachedObject.productVariants)

    //         }
    //         console.log('data from cache')
    //         return dataToreturn
    //     }
    // }



    // public async saveCachForOneProduct(key: string, data: any) {
    //     const dataToRedis = {
    //         ...data,
    //         createdAt: `${data.createdAt}`,
    //         updatedAt: `${data.updatedAt}`,
    //         productImages: data.productImages.length ?
    //             JSON.stringify(data.productImages)
    //             : JSON.stringify([]),
    //         productVariants: data.productVariants.length ?
    //             JSON.stringify(data.productVariants)
    //             : JSON.stringify([])

    //     }
    //     for (const [field, value] of Object.entries(dataToRedis)) {
    //         //@ts-ignore
    //         await redisCache.client.HSET(key, field, value)
    //     }
    // }
    public async getCachForOneProduct(key: string) {
        const cachedProduct = await redisCache.client.HGETALL(key);

        if (Object.keys(cachedProduct).length === 0) {
            return null; // If no cached data is found, return null or handle accordingly
        }

        // Check if the fields you want to parse exist before attempting JSON.parse
        const dataToReturn: Product = {
            ...cachedProduct,
            createdAt: new Date(cachedProduct.createdAt),
            updatedAt: new Date(cachedProduct.updatedAt),
            shopId: +cachedProduct.shopId,
            price: +cachedProduct.price,
            id: +cachedProduct.id,
            categoryId: +cachedProduct.categoryId,
            quantity: +cachedProduct.quantity,
            //@ts-ignore
            productImages: cachedProduct.productImages ? JSON.parse(cachedProduct.productImages) : [],
            productVariants: cachedProduct.productVariants ? JSON.parse(cachedProduct.productVariants) : []
        };

        console.log('Data from cache');
        return dataToReturn;
    }
    public async saveCachForOneProduct(key: string, data: any) {
        const dataToRedis = {
            ...data,
            createdAt: `${data.createdAt}`,  // Convert dates to strings
            updatedAt: `${data.updatedAt}`,
            productImages: Array.isArray(data.productImages)
                ? JSON.stringify(data.productImages)  // Ensure it's stringified
                : JSON.stringify([]),
            productVariants: Array.isArray(data.productVariants)
                ? JSON.stringify(data.productVariants)  // Ensure it's stringified
                : JSON.stringify([])
        };

        for (const [field, value] of Object.entries(dataToRedis)) {
            // Ensure all values are strings, as Redis expects string-type values
            const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);

            await redisCache.client.HSET(key, field, valueToStore);  // Pass the stringified value
        }
    }
}
export const productCache: ProductCache = new ProductCache()