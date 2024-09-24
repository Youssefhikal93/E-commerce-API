import { Request, Response } from "express";
import { prisma } from "~/prisma";
import { dashBoardService } from "~/services/dashBoardService";

class DashBoadController {
    public async getStatus(req: Request, res: Response) {

        const data = await dashBoardService.overAllstatus()

        return res.status(200).json({
            status: 'sucsses',
            data: {
                data
            }
        })
    }
}

export const dashBoadController: DashBoadController = new DashBoadController()