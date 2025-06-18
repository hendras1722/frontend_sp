'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { axiosFetch } from '@/utils/axios'
import Link from 'next/link'
import { Suspense } from 'react'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axiosFetch.post('/auth/register', values)
      window.location.href = '/admin/dashboard'
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="w-[400px] h-fit  border border-gray-100 rounded-2xl flex flex-col items-center dark:shadow-lg dark:shadow-white">
        <div className=" mt-5 pb-5">
          <h2>Register</h2>
        </div>
        <div className="flex-1 w-full px-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="my-3"></div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="my-8 w-full dark:bg-inherit  dark:border dark:border-inherit dark:hover:bg-white dark:hover:text-black text-white"
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
        <div>
          Sudah punya akun!{' '}
          <Suspense>
            <Link className="text-blue-700 underline" href="/login">
              Login
            </Link>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
