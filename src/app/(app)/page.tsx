"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'

import messages from '@/messages.json'
import { Card, CardContent , CardHeader } from "@/components/ui/card"

const Home = () => {
  return (
    <main className='flex-grow flex flex-col items-center
    justify-center px-4 md:px-24 py-12 w-full'>
    <section>
      <h1 className='text-bold text-5xl'>Dive into world of Anonmous Conversation</h1>
      <p className='text-center text-xl flex flex-col items-start justify-center md:px-2 py-8 select-none '>Explore Mastery Message - where your identity remains a secret</p>
    </section>

    <Carousel plugins={[Autoplay({delay:2000})]} className="w-full max-w-xs">
      <CarouselContent>
        { 
          messages.map((message , index)=>(
            <CarouselItem key={index}>
            <div className="p-1">
              <Card >
                <CardHeader>{message.title}</CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-xl font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    <footer>&#169; 2024 AI-Anonymous Message . All rights reserved  </footer>
    </main>
  )
}

export default Home