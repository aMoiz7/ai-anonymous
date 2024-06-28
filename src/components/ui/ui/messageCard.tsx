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

import { X } from "lucide-react";
import { Button } from "../button";

import { Message } from "@/models/User";
import { useToast } from "../use-toast";
import axios from "axios";
import { Apires } from "@/types/Apires";

type  MessageCard={
    message: Message;
    onMessageDelete:(messageId:string)=>void
}
  
const messageCard = ({message , onMessageDelete}:MessageCard) => {

    const {toast} =useToast()

    const  handleDelete= async()=>{
     const res = await  axios.delete<Apires>('/api/delete-message/${message._id}')
         toast({
            title:res.data.message,
    })
    onMessageDelete(message._id)
    }
  
      return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline"><X className="w-5 h-5"/></Button>
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
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
      
      </Card>
    </div>
  );
};

export default messageCard;
