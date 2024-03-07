import instance from '@/axios/axios'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import { message } from 'antd'
import React, { useState } from 'react'

const PartnerDelete = ({info, semaphore}) => {
  const [open, setOpen] = useState(false)
  const handleDelete = async () => {
    const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
    // delete images
    try {
        const resImg = await instance.post("http://http://120.76.205.116/:9000/files/oss/delete", {
         object_keys : [info.getValue("logo_url").slice(prefix.length)], 
        })
        const res = await instance.post("http://http://120.76.205.116/:9000/partners/delete", {
            id: info.getValue("id"),
        }) 
        semaphore(Math.random())
        message.success("删除成功") 
        setOpen(false)
    } catch (err) {
        message.error("删除失败，请重试")
        console.log(err)
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="font-medium" variant='destructive'>删除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请确认是否继续删除该合作伙伴</AlertDialogTitle>
          <AlertDialogDescription>
            删除无法撤回,点击确认后将永久删除该合作伙伴
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>继续</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PartnerDelete