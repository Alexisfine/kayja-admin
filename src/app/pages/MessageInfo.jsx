import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { useState } from 'react'

const MessageInfo = ({info}) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button className='my-2'>查看详情</Button>
    </DialogTrigger>
    <DialogContent className='max-w-4xl max-h-[80vh] overflow-scroll'>
      <DialogHeader>
      <DialogTitle className='text-3xl text-black'>查看详情</DialogTitle>
      <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
        <div className='flex items-center space-x-4'>
          <span className='whitespace-nowrap min-w-40'>留言ID</span>
          {info.getValue("id")}
        </div>
        <div className='flex items-center space-x-4'>
          <span className='whitespace-nowrap min-w-40'>姓名</span>
          {info.getValue("name")}
        </div>
        <div className='flex items-center space-x-4'>
          <span className='whitespace-nowrap min-w-40'>邮箱</span>
          {info.getValue("email")}
        </div>
        <div className='flex items-center space-x-4'>
          <span className='whitespace-nowrap min-w-40'>公司</span>
          {info.getValue("company_name")}
        </div>
        <div className='flex items-center space-x-4'>
          <span className='whitespace-nowrap min-w-40'>电话</span>
          {info.getValue("phone")}
        </div>
        <div className='flex items-center space-x-4'>
          <span className='whitespace-nowrap min-w-40'>产品</span>
          {info.getValue("product")}
        </div>
        <div className='flex items-center space-x-4'>
          <span className='whitespace-nowrap min-w-40'>消息</span>
          {info.getValue("msg")}
        </div>
      </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}

export default MessageInfo