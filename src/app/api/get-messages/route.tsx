import { getServerSession } from "next-auth";

import { authOptions } from "@/app/auth/[...nextauth]/options";

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

    try {
         const user = await UserModel.aggregate([
                     {$match:{id:userid}} , {$unwind :"$messages"} , {$sort :{'messages.createdAt' :-1}}
                     ,{$group:{_id:'$_id' , messages:{$push:'$messages'}}}
         ]
    )

         
       if(!user || user.length === 0){
        return Response.json({
            success:false,
            message : "use not found "
           },{
            status:401
           })
       }

       return Response.json({
        success:true,
        message : user[0].messages 
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