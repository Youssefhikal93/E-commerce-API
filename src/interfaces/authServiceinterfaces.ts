export interface AuthRegiester {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  avatar?: string
}

export interface AuthLogin {
  email: string
  password: string
}