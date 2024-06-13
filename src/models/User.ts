import  mongoose, {Schema , Document } from "mongoose";

export interface Message extends Document{
    content :string;
    createdAt :Date

}



export const MessageSchema: Schema<Message> =   new Schema({
    content :{
        type :String ,
        required :true,

    },
    createdAt:{
      type :Date ,
      required :true,
      default : Date.now()
    }
}) 

export interface User extends Document{
    username : string ;
    email : string ;
    password : string ;
    verifyCodeExpiry : Date;
    verifyCode : string,
    isVerified:boolean
    isAcceptingMessage  : boolean;
    message : Message


}



const UserSchema:Schema<User> = new Schema({

    username :{
        type :String ,
        required :[true , "user name is required"],
        trim : true,
        unique :true

    },
    email:{
      type :String ,
      required :true,
    }
    ,

  password:{
    type :String,
    required:true 
  },
  verifyCodeExpiry:{
    type : Date , 
    required :true
  },
  verifyCode:{
    type:String,
    required :true

  },
  isVerified:{
    type:Boolean,
    default:false,
    required :true

  },
  isAcceptingMessage:{
    type:Boolean,
    default:true

  },

  message: [MessageSchema]
  

})


export const UserModel = (mongoose.models.User) || (mongoose.model<User>("User",UserSchema))