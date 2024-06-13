import {z} from 'zod'

export const signinSchema = z.object({
    code : z.string().length(6)
})

