import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";

import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { User } from "next-auth";
import  mongoose  from 'mongoose';


export async function GET(req:Request){
    await dbconnect();

    const session = await getServerSession(authOptions);
    const user = session?.user  as User

    if(!session|| !session.user){
       return Response.json({
        success:false,
        message : "not authenticated "
       },{
        status:401
       })
    }


    const userid = new mongoose.Types.ObjectId(user._id);
    console.log(userid, "userid , get messages")

    try {
        const user = await UserModel.aggregate([
            { $match: { _id:userid } },
            { $unwind: "$message" },
            { $sort: { 'message.createdAt': -1 } },
            { $group: { _id: '$_id', message: { $push: '$message' } } }
        ]);
        
        console.log(user, "user");
        
         
       if(!user || user.length === 0){
        return Response.json({
            success:false,
            message : "user not found "
           },{
            status:401
           })
       }

       return Response.json({
        success:true,
        message : user[0].message
       },{
        status:200
       })


    } catch (error) {
        
            return Response.json({
                success :false , 
                message:error
            },{status :404 })
        
    }
                          
    

}