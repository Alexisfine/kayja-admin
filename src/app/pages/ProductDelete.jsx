import instance from '@/axios/axios'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import React, { useState } from 'react'

const ProductDelete = ({info, semaphore}) => {
  const [open, setOpen] = useState(false)
  const handleDelete = async () => {
    const res = await instance.get("http://http://120.76.205.116/:9000/products/get_for_admin/" + info.getValue("id"))
    const data = res.data.data
    const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
    // delete images
    var cur = [data.cover_img_url, ...data.img_urls]
    cur = cur.map(a => {
      return a.slice(prefix.length)
    })

    const resImg = await instance.post("http://http://120.76.205.116/:9000/files/oss/delete", {
        object_keys : cur, 
    })
    const resDel = await instance.post("http://http://120.76.205.116/:9000/products/delete", {
        id : info.getValue("id")
    })
    console.log("success")
    semaphore(Math.random())
    setOpen(false)
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="font-medium" variant='destructive'>删除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请确认是否继续删除该产品</AlertDialogTitle>
          <AlertDialogDescription>
            删除无法撤回,点击确认后将永久删除该产品
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

export default ProductDelete