'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Apires } from '@/types/Apires';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from './../../../components/ui/ui/messageCard';
import { Switch } from '@/components/ui/switch';


const Page = () => {

  const [message , setMessage] = useState([]);
  const [isLoading , setIsloading] = useState(false);
  const [isSwitchLoading , SetIsswitchLoading] = useState(false);
  
  const session = useSession()
  
  const {toast} = useToast();

  const handleDelete = async(messageId :string)=>{
        setMessage(message.filter((message)=> message._id!==messageId))
  }

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {watch , setValue , register} = form

  const acceptMessages = watch('acceptMessages')
  const fetchAcceptMessages = useCallback(async () => {
    SetIsswitchLoading(true);
    try {
      const response = await axios.get<Apires>('/api/accept-message'  );
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<Apires>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      SetIsswitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsloading(true);
      SetIsswitchLoading(false);
      try {
        const response = await axios.get<Apires>('/api/get-messages');
       
        setMessage(response.data.message || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } 
      catch (error) {
        const axiosError = error as AxiosError<Apires>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsloading(false);
        SetIsswitchLoading(false);
      }
    },
    [setIsloading, setMessage, toast]
  );

  // Fetch initial state from the server


   


  useEffect(() => {
    if (!useSession || !session.data) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

     
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<Apires>('/api/accept-message', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<Apires>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session.data || !session.data.user) {
    return <div>no useer</div>;
  }
  const {username} = session.data.user as User

  const baseUrl = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToclipboard = ()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title:"Url Copied",
      description:"Profile Url has been copied to clipboard"
    })
  }

  return (
    <>
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToclipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message, index) => (
            <MessageCard
              key={message._id}
              id={message._id}
              message={message.content}
              date={message.createdAt}
              onMessageDelete={handleDelete}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    </>
  )
}

export default Page