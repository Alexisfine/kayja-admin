import instance from '@/axios/axios'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import { message } from 'antd'
import React, { useEffect, useState } from 'react'

const NewsDelete = ({info, semaphore}) => {
  const [open, setOpen] = useState(false)
  const handleDelete = async () => {
    try {
        const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
        // delete images
        var cur = [info.cover_img_url]
        cur = cur.map(a => {
        return a.slice(prefix.length)
        })

        const resImg = await instance.post("http://120.76.205.116:9000/files/oss/delete", {
            object_keys : cur, 
        })
        const resDel = await instance.post("http://120.76.205.116:9000/news/delete", {
            id : info.id
        })
        console.log("success")
        semaphore(Math.random())
        message.success("删除成功")
        setOpen(false)
    } catch (err) {
        console.log(err)
        message.error("删除失败")
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="font-medium" variant='destructive'>删除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请确认是否继续删除</AlertDialogTitle>
          <AlertDialogDescription>
            删除无法撤回,点击确认后将永久删除
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

export default NewsDelete