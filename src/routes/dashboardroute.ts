import express from 'express'
import { dashBoadController } from '~/controllers/dashBoardController'

const dashboardRoute = express.Router()

dashboardRoute.route('/')
    .get(dashBoadController.getStatus)


export default dashboardRoute