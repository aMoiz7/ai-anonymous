import { NextAuthOptions } from "next-auth";
import CredentialsProviders from "next-auth/providers/credentials";

import   bcrypt  from 'bcryptjs';

import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export const authOptions :NextAuthOptions = {
providers:[
    CredentialsProviders({
        id:"credentials",
        name:"Cresdentials",
        credentials:{
            email:{label:"Email" , type:"text"},
            Password:{label : "password" , type:"password"}
        },
        async authorize(credentials :any):Promise<any>{
            await dbconnect();
            try {
            const user =   await UserModel.findOne({
                    $or:[
                        {email:credentials.identifier},
                        {username:credentials.identifier}
                    ]
                })

                if(!user){
                    throw new Error("No user found with this email")
                }

                if(user.isVerified){
                    throw new Error("please verify first")
                }

              const isPAssworCorrect =   await bcrypt.compare(credentials.password , user.password)

              if(isPAssworCorrect){
                return user
              }
              else{
                throw new Error("incorrect Password")
              }

            } catch (error:any) {
                throw new Error(error)
            }

        }

    }) 
], callbacks:{
  async session({session  , token}){
    if(token){
        session.user._id  = token._id
        session.user.isVerified  = token.isVerified
        session.user.isAcceptMessage  = token.isAcceptMessage
        session.user.username = token.username

    }
    return session;
  }
  ,
  async jwt({token , user }){
     if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptMessage  = user.isAcceptingMessage
        token.username = user.username
     }

     return token
  }
}
,pages:{
    signIn:'/sign-in'
},
session:{
    strategy:"jwt"
},
secret:process.env.NEXTAUTH_SECRET
}