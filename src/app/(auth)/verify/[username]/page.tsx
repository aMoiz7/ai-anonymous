"use client"

import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/schemas/verifySchema';
import z from 'zod'
import axios from 'axios';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const page = () => {
    const router = useRouter()
    const params = useParams()
    const {toast} = useToast()
    const form =useForm({
        resolver :zodResolver(verifySchema),
    })

     const onSubmit = async(data:z.infer<typeof verifySchema>)=>{
            try {
                const res = await  axios.post(`/api/verify-code`,{
                    username :params.username,
                    code : data.code
                })

                toast({
                    title:"success",
                    description:res.data.message,
                    variant:'default'
                })

                router.replace('/sign-in')
            } catch (error:any) {
                console.error(error , "error in verify User")
                toast({
                 title:"verify failed",
                 description:error.message
                })
            }
     }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
<div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
    <div className='text-center'>
        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 '>
            Verify your account
        </h1>
         <p className='mb-4'>enter the verification code send to your email </p>
    </div>

    <Form {...form}>
       
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verfication code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

</div>
    </div>
  )
}

export default page