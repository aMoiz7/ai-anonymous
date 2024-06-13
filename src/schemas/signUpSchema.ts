import {z} from 'zod'

export const userNameValidation =z.string().min(2).max(20)

export const signUpSchema = z.object({
    username : userNameValidation,
    email :z.string().email({message:"invalid email"}),
    password:z.string()
})




