import { Application, NextFunction, Request, Response } from 'express'
import userRouter from './userRoute'
import categoryRoute from './CategoryRoute'
import productRoute from './productRoutes'

const appRoutes = (app: Application) => {
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/categories', categoryRoute)
  app.use('/api/v1/products', productRoute)
}

export default appRoutes
