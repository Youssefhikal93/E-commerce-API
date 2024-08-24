import { Category, Prisma } from '@prisma/client'
import { NextFunction } from 'express'
import { CategoryBody } from '~/interfaces/categoryInterface'
import { BadRequestException, NotfoundException } from '~/middleWares.ts/errorMiddleware'
import { validateSchema } from '~/middleWares.ts/validateSchema'
import { prisma } from '~/prisma'
import { categorySchemaCreate } from '~/schemas/categorySchema'

class CategoryService {
  public async add(requestBody: any): Promise<Category> {
    const { name, icon } = requestBody
    const category = await prisma.category.create({
      data: {
        name,
        icon
      }
    })
    return category
  }
  public async read(): Promise<Category[]> {
    const categories: Category[] = await prisma.category.findMany({
      where: {
        status: true
      }
    })
    return categories
  }

  public async readOne(id: number): Promise<Category> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        status: true
      }
    })
    if (!category) {
      throw new NotfoundException('Wrong id provided for the category')
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
