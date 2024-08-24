import { Request } from "express";
import { BadRequestException } from "../middleWares.ts/errorMiddleware";


function parseAndValidateId(req: Request) {
    const { id } = req.params;
    const parsedId = +id;

    if (isNaN(parsedId) || parsedId <= 0) {
        throw new BadRequestException(`ID:${id} must be a positive number`);
    }

    return parsedId;
}

export default parseAndValidateId;
