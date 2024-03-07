import instance from '@/axios/axios'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import { message } from 'antd'
import React, { useState } from 'react'

const CasesDelete = ({info, semaphore}) => {
  const [open, setOpen] = useState(false)
  const handleDelete = async () => {
    const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
    // delete images
    try {
        setOpen(false)
        const resImg = await instance.post("http://120.76.205.116:9000/files/oss/delete", {
         object_keys : [info.getValue("cover_url").slice(prefix.length)], 
        })
        const res = await instance.post("http://120.76.205.116:9000/solutions/delete", {
            id: info.getValue("id"),
        }) 
        semaphore(Math.random())
        message.success("删除成功") 
    } catch (err) {
        message.error("删除失败，请重试")
    } finally {
        setOpen(false)
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="font-medium" variant='destructive'>删除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请确认是否继续删除该案例</AlertDialogTitle>
          <AlertDialogDescription>
            删除无法撤回,点击确认后将永久删除该案例
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

export default CasesDelete