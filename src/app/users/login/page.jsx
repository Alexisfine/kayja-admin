'use client'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import KayjaLogo from '@/../images/kayja.png'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import {useRouter} from "next/navigation";
const Page = () => {
  const [canSubmit, setCanSubmit] = useState(true)
  const [loginFailed, setLoginFailed] = useState(false)
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  useEffect(() => {
    // Replace this with your actual login check
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handlerLogin = async (event) => {
    event.preventDefault()
    setCanSubmit(false)
    var email = ""
    var phone = ""
    if (isNaN(emailOrPhone)) {
        email = emailOrPhone
    } else {
      phone = emailOrPhone
    }
    try {
      const res = await axios.post("http://http://120.76.205.116/:9000/users/login", {
        email, 
        phone, 
        password
      });
      if (res.data.code == 200) {
        const newToken = res.headers["x-jwt-token"]
        const newRefreshToken = res.headers["x-refresh-token"]
        if (newToken) {
            localStorage.setItem("token", newToken)
        }
        if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken)
        }
        setLoginFailed(false)
        router.push('/')
      } else {
        setLoginFailed(true)
      }
    } catch (error) {
      setLoginFailed(true)
    } finally {
      setCanSubmit(true);
    }
  }
  return (
    <>
      <Head>
        <title>管理员登录</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Image
              className="mx-auto h-12 w-auto"
              src={KayjaLogo} 
              alt="kayjaopt"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              管理员登录
            </h2>
            {loginFailed && <p className="mt-2 text-center text-sm text-red-600">
              登录失败，邮箱/手机号或密码不正确
            </p>}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlerLogin}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-5">
              <div>
                <label className="sr-only">
                  请输入邮箱或手机号
                </label>
                <input
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="邮箱或手机号"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>


            <div>
              <Button disabled={!canSubmit}
                type='submit'
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {canSubmit ? <>登录</> : <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                登录中</>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Page