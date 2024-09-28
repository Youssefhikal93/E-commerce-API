import { User } from "@prisma/client";
import { AuthRegiester } from "~/interfaces/authServiceinterfaces";
import { prisma } from "~/prisma";
import bcrypt from 'bcrypt'
import { changePasswordBody, UserBody, UserPayLoad } from "~/interfaces/UserInterface";
import { helper } from "~/utils/helpers";
import { BadRequestException, NotfoundException } from "~/middleWares.ts/errorMiddleware";


class UserService {
    public async addUserByAdmin(requestedBody: AuthRegiester) {

        const { email, firstName, lastName, password } = requestedBody

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser: User = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                avatar :requestedBody.avatar || ""
            }
        })
        return newUser
    }

    public async fetch(query: any) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortDir = 'asc', filterBy, filterValue, filterCondition } = query
        const parsedPage = +page
        const parsedlimit = +limit


        const skip: number = (parsedPage - 1) * parsedlimit
        const take: number = parsedlimit


        const whereClause: any = {}
        if (filterBy && filterCondition && filterValue) {
            if (filterBy === 'createdAt' || filterBy === 'updatedAt') {

                whereClause[filterBy] = {
                    [filterCondition]: query.filterValue,
                }
            } else {
                whereClause[filterBy] = {
                    [filterCondition]: query.filterValue,
                    mode: 'insensitive'

                }
            };
        }
        const users = await prisma.user.findMany({
            where: whereClause,
            skip,
            take,
            orderBy: {
                [sortBy]: sortDir
            }
        })
        return users
    }

    // public async remove(userId: number) {
    //     await prisma.user.delete({
    //         where: {
    //             id: userId
    //         }
    //     })
    // }

    public async deActivateUser(userId: number, loggedUser: UserPayLoad) {

        const existingUser = await this.getUserById(userId)
        helper.checkPermisson(existingUser, "id", loggedUser)

        await prisma.user.update({
            where: {
                id: userId
            },
            data: { isActive: false }
        })
    }

    public async edit(userId: number, requestedBody: UserBody, loggedUser: UserPayLoad) {
        // const { firstName, lastName, avatar, email } = requestedBody
        const { firstName, lastName, email } = requestedBody

        const existingUser = await this.getUserById(userId)
        // helper.checkPermissonForUser(existingUser, loggedUser)
        helper.checkPermisson(existingUser, "id", loggedUser)

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                firstName,
                lastName,
                email,
                // avatar
            }
        })
        return {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            // avatar: updatedUser.avatar,
            createdAt: updatedUser.createdAt
        }
    }
    public async updatePasssword(requestedBody: changePasswordBody, loggedUser: UserPayLoad) {
        const { currentPassword, newPassword, confirmNewPassword } = requestedBody

        const userInDb = await prisma.user.findFirst({
            where: { id: loggedUser.id }
        })

        const isMatchedPassword = await bcrypt.compare(currentPassword, userInDb?.password!)

        if (!isMatchedPassword) {
            throw new BadRequestException("Password provided dosn't match the current password")
        }

        if (newPassword !== confirmNewPassword) {
            throw new BadRequestException('Password and confirm password must be the same')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: loggedUser.id },
            data: {
                password: hashedPassword
            }
        })

    }



    public async updateAvatar(avatar: Express.Multer.File, loggedUser: UserPayLoad) {
        if (!avatar) {
            new BadRequestException('please upload an image!')
        }
        const avatarUpolad = await prisma.user.update({
            where: { id: loggedUser.id },
            data: {
                avatar: avatar.filename
            }
        })
        return avatarUpolad
    }


    public async getUserById(id: number) {
        const existingUser = await prisma.user.findUnique({
            where: { id }
        })

        if (!existingUser) {
            throw new NotfoundException(`user with ID:${id} does not exist`)
        }

        return existingUser
    }

}
export const userService: UserService = new UserService()