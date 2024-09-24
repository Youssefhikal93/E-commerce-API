import express, { Application, NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import appRoutes from './routes/appRoutes'
import { BadRequestException, CustomError, NotfoundException, formatErrorMsg } from './middleWares.ts/errorMiddleware'
import cookieParser from 'cookie-parser'


class Server {
  private app: Application
  constructor(app: Application) {
    this.app = app
  }

  public start(): void {
    this.setupMiddleware()
    this.setupRoutes()
    this.setupGlobalError()
    this.startServer()
  }

  private setupMiddleware(): void {
    this.app.use(express.json())
    this.app.use(express.static('images'))
    this.app.use(cookieParser())

  }
  private setupRoutes(): void {
    appRoutes(this.app)
  }

  private setupGlobalError(): void {
    //Error got routes
    this.app.all('*', (req, res, next) => {
      return next(new NotfoundException(`Route is not defined ${req.originalUrl}`))

    })
    //global
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof CustomError) {
        res.status(err.statusCode).json(err.getError())
      } else {
        formatErrorMsg.formatError(err, res)
      }
      next()
    })
  }

  private startServer() {
    const port = process.env.PORT! || 3000

    this.app.listen(port, () => {
      console.log(`App listening to ${port}`)
    })
  }
}

export default Server
