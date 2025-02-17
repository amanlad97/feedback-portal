import {z} from 'zod'
export const usernameValidation =z
.string()
.min(2,"username must be atleast 2 charaters")
.max(20,"username must be no more than 20 charaters")
.regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi," must be a valid username")

export const signUpSchema=z.object({
    username: usernameValidation,
    email: z.string().email({message:'Invalide email address'}),
    password: z.string().min(6,{message:'password must be atleast 6 charater long'})

})