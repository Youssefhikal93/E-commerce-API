import { Application } from 'express'
import userRouter from './userRoute'
import categoryRoute from './CategoryRoute'
import productRoute from './productRoutes'
import productImageRoute from './ProductImageRoutes'
import productVariantRoute from './productvariantRoute'
import productVariantItemRoute from './variantItemRoutes'
import wishlistRoute from './wishlistRoute'
import addressRoute from './addressRoute'
import cartRoute from './cartRoutes'
import orderRoute from './orderRoutes'
import couponRoute from './couponRoute'
import reviewRoute from './reviewRoutes'
import dashboardRoute from './dashboardroute'

const appRoutes = (app: Application) => {
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/categories', categoryRoute)
  app.use('/api/v1/products', productRoute)
  app.use('/api/v1/productImages', productImageRoute)
  app.use('/api/v1/productVariants', productVariantRoute)
  app.use('/api/v1/product-variant-items', productVariantItemRoute)
  app.use('/api/v1/wishlists', wishlistRoute)
  app.use('/api/v1/addresses', addressRoute)
  app.use('/api/v1/carts', cartRoute)
  app.use('/api/v1/orders', orderRoute)
  app.use('/api/v1/coupons', couponRoute)
  app.use('/api/v1/reviews', reviewRoute)
  app.use('/api/v1/dashboard', dashboardRoute)
}

export default appRoutes
