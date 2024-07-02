import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

import { Trash2, X } from "lucide-react";
import { Button } from "../button";

import { Message } from "@/models/User";
import { useToast } from "../use-toast";
import axios from "axios";
import { Apires } from "@/types/Apires";

type  MessageCard={
     id:string,
     date:date
    message: string;
    onMessageDelete:(messageId:string)=>void
}
  
const MessageCard = ({id,message ,date , onMessageDelete}:MessageCard) => {

    const {toast} =useToast()

    const  handleDelete= async()=>{
     const res = await  axios.delete<Apires>(`/api/delete-message/${id}`)
         toast({
            title:res.data.message,
    })
    onMessageDelete(id)
    }
  
   const on = new Date(date)
    
      return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{message}</CardTitle>
          <CardDescription>{on.toLocaleString()}</CardDescription>
          <AlertDialog>
      <AlertDialogTrigger asChild className="w-16 mt-6 align-middle">
        <Button  className="bg-red-700"><Trash2 className=" text-xl text-white" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
         
        </CardHeader>
        <CardContent>
        </CardContent>
      
      </Card>
    </div>
  );
};

export default MessageCard;
