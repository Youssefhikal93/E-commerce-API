import { Category, Prisma, Status } from '@prisma/client'
import { NextFunction } from 'express'
import { CategoryBody } from '~/interfaces/categoryInterface'
import { BadRequestException, NotfoundException } from '~/middleWares.ts/errorMiddleware'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { prisma } from '~/prisma'
import { categorySchemaCreate } from '~/schemas/categorySchema'
import RedisCache from './redis.cache'
import { Redis_Keys } from '~/utils/redis.keys'

const redisCache: RedisCache = new RedisCache()

class CategoryService {
  public async add(requestBody: any): Promise<Category> {
    const { name, icon } = requestBody
    const category = await prisma.category.create({
      data: {
        name,
        icon
      }
    })

    await redisCache.client.DEL(Redis_Keys.CATEGORIES)

    return category
  }
  public async read(): Promise<Category[]> {

    const cachedCategories = await redisCache.client.GET(Redis_Keys.CATEGORIES)


    if (cachedCategories) {
      console.log('This data from cache')
      return JSON.parse(cachedCategories)
    }

    const categories: Category[] = await prisma.category.findMany({
      where: {
        status: true
      }
    })

    await redisCache.client.SET(Redis_Keys.CATEGORIES, JSON.stringify(categories), { EX: 60 * 60 * 60 })

    return categories
  }

  public async readOne(id: number): Promise<Category> {

    const cahcedCategory = await redisCache.client.HGETALL(`category:${id}`)

    const cahcedCategoryObject = { ...cahcedCategory }

    if (Object.keys(cahcedCategoryObject).length) {
      console.log('Data from cache')
      const dataToReturn = {
        id: +cahcedCategoryObject.id,
        name: cahcedCategoryObject.name,
        icon: cahcedCategoryObject.icon,
        status: cahcedCategoryObject.status === 'true' ? true : false
      }
      return dataToReturn
    }

    const category = await prisma.category.findFirst({
      where: {
        id,
        status: true
      }
    })
    if (!category) {
      throw new NotfoundException('Wrong id provided for the category')
    }


    const dataRedis = {
      id: category.id.toString(),
      icon: category.icon,
      name: category.name,
      status: category.status.toString()
    }

    for (const [key, value] of Object.entries(dataRedis)) {
      await redisCache.client.HSET(`category:${id}`, key, value)
    }


    return category
  }

  public async editOne(id: number, requestBody: CategoryBody): Promise<Category> {
    const { name, icon } = requestBody
    if ((await this.getIdForCaregory(id)) <= 0) {
      throw new NotfoundException('Wrong id provided for the category')
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, icon }
    })
    await redisCache.client.DEL(Redis_Keys.CATEGORIES)

    return category
  }

  public async remove(id: number): Promise<Category> {
    if ((await this.getIdForCaregory(id)) <= 0) {
      throw new NotfoundException('Wrong id provided for the category')
    }
    const category = await prisma.category.delete({
      where: {
        id
      }
    })

    return category
  }

  private async getIdForCaregory(id: number) {
    const count = await prisma.category.count({
      where: {
        id
      }
    })

    return count
  }
}

export const categoryService: CategoryService = new CategoryService()
