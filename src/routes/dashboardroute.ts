import express from 'express'
import { dashBoadController } from '~/controllers/dashBoardController'
import { restrictTo, verfiyUser } from '~/middleWares.ts/authMiddlewars'

const dashboardRoute = express.Router()

dashboardRoute.route('/')
    .get(verfiyUser, restrictTo('ADMIN'), dashBoadController.getStatus)


export default dashboardRoute