export interface UserPayLoad {
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    id: number
}

export interface changePasswordBody {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,

}

export interface UserBody {
    email: string,
    firstName: string,
    lastName: string,
    // avatar: string,
}