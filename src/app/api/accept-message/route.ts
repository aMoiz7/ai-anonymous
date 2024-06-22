import { getServerSession } from "next-auth";

import { authOptions } from "@/app/auth/[...nextauth]/options";

import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { User } from "next-auth";

export async function POST(req : Request){
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


    const userid = user._id 

   const {acceptingMessage} =  await  req.json()

   try { 

    const updatedUSer =  await UserModel.findByIdAndUpdate(userid , {
        isAcceptingMessage : acceptingMessage
     } , 
    {
        new:true
    })

    if(!updatedUSer){
        return Response.json({
            success:false,
            message : "failed to update user status to accept message"
           },{
            status:401
           })
    }

    return Response.json({
        success:true,
        message : " message acceptance status updates successfully",
        updatedUSer
       },{
        status:200
       })
    
   } catch (error) {
    console.log("failed to update user status to accept message")
    return Response.json({
        success:false,
        message : "failed to update user status to accept message"
       },{
        status:500
       })
   }


     


}

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


 const userid = user._id
 

 try {
    const getuser = await UserModel.findById(userid)
   
    if(!getuser){
       return Response.json({
           success:false,
           message : "failed to get user"
          },{
           status:401
          })
    }
   
    return Response.json({
       success:true,
       isAcceptingMessage : getuser.isAcceptingMessage,
       getuser
      },{
       status:200
      })
 } catch (error) {
    console.log("error is getting message acceptanc")
    return Response.json({
        success:false,
        message : "error is getting message acceptance "
       },{
        status:401
       })
 }
}