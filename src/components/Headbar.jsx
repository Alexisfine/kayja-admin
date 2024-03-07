import { User } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const Headbar = ({handleLogout}) => {
  return (
    <div className='w-full'>
        <div className='h-12 flex justify-end items-center px-10 space-x-5'>
            <Link href=''>
                <User/>
            </Link>
            <Button className='h-4/5' onClick={handleLogout}>退出登录</Button>
        </div>
        <div className='h-[0.5px] bg-gray-300 w-full'/> 
    </div>
  )
}

export default Headbar