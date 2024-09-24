import { Response } from "express"

export function sendCookie(res: Response, token: string) {
    const cookieOptions = {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
        secure: false
    }
    if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true
    }
    res.cookie('token', token, cookieOptions)

}