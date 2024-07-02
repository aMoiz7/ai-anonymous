import { getServerSession } from "next-auth/next"
import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req : Request){
    await dbconnect();

    const session = await getServerSession(authOptions);
    
    const user = session?.user  as User
    
    console.log(session?.user , "ses")

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
 //@ts-expect-error
    const checkstatus  = await  UserModel.findById(user._id)

    if(!checkstatus){
        return Response.json({
            success:false,
            message : "failed to update user status to accept message"
           },{
            status:401
           })
    }

    const status = checkstatus.isAcceptingMessage
     //@ts-expect-error
    const updatedUSer =  await UserModel.findByIdAndUpdate(userid , {
        isAcceptingMessage : !status
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
     //@ts-expect-error
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
    console.log("error is getting message acceptancE")
    return Response.json({
        success:false,
        message : "error is getting message acceptance "
       },{
        status:401
       })
 }
}