
import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs"
import { NextApiRequest } from 'next';


export async function POST (request :Request){
    await dbconnect()

    try {

        const {username , email , password} = await request.json()
        await UserModel.findOne(email) 
    } catch (error:any) {
        console.error(error)
        return Response.json({success:false, error},{status :400})

    }
}