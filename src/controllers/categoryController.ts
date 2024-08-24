import { Request, Response } from 'express'
import parseAndValidateId from '~/utils/parseAndValidateId'
import { prisma } from '~/prisma'
import { categoryService } from '~/services/categoryService'

class CategoryController {
  public async create(req: Request, res: Response) {
    const newCategory = await categoryService.add(req.body)
    return res.status(201).json({
      status: 'succses',
      data: {
        newCategory
      }
    })
  }

  public async getAll(req: Request, res: Response) {
    const categories = await categoryService.read()
    return res.status(200).json({
      status: 'succses',
      length: categories.length,
      data: {
        categories
      }
    })
  }
  public async getOne(req: Request, res: Response) {

    const id = parseAndValidateId(req)

    const category = await categoryService.readOne(id)

    return res.status(200).json({
      status: 'succses',
      data: {
        category
      }
    })
  }

  public async updateOne(req: Request, res: Response) {

    const id = parseAndValidateId(req)


    const category = await categoryService.editOne(id, req.body)

    res.status(200).json({
      status: 'succses',
      data: {
        category
      }
    })
  }

  public async deleteOne(req: Request, res: Response) {
    const id = parseAndValidateId(req)

    await categoryService.remove(id)
    res.status(204).json({
      data: null
    })
  }
}

export const categoryController: CategoryController = new CategoryController()
