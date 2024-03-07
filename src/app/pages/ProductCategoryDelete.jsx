import instance from '@/axios/axios'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import React, { useState } from 'react'

const ProductCategoryDelete = ({info, semaphore}) => {
const [open, setOpen] = useState(false)
  const url = info.getValue("cover_img_url")
  const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
  const parts = url.split(prefix)

  const handleDelete = async () => {
    const res1 = await instance.post("http://http://120.76.205.116/:9000/files/oss/delete", {
        object_keys : [parts[1]]
    })
    if (res1.data.code === 2) {
        const res2 = await instance.post("http://http://120.76.205.116/:9000/product_categories/delete", {
            id : info.getValue("id")
        })
        console.log(res2, info.getValue("id"))
        if (res2.data.code === 2) {
            console.log("success")
            semaphore(Math.random())
            setOpen(false)
        } else {
            console.log("failed2")
        }
    } else {
        console.log("failed")
    }
  }  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="font-medium" variant='destructive'>删除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请确认是否继续删除该产品类别</AlertDialogTitle>
          <AlertDialogDescription>
            删除无法撤回,点击确认后将永久删除该产品类别
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

export default ProductCategoryDelete