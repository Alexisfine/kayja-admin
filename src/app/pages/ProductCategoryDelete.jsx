import instance from '@/axios/axios'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import React, { useState } from 'react'
import {message} from "antd";

const ProductCategoryDelete = ({info, semaphore}) => {
const [open, setOpen] = useState(false)
  const url = info.getValue("cover_img_url")
  const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
  const parts = url.split(prefix)

  const handleDelete = async () => {
    const res0 = await instance.get("http://120.76.205.116:9000/products/get_all_for_admin")
    if (res0.data.code !== 2) {
        message.error("系统错误")
        return
    }
    const data = res0.data.data
    for (var item = 0; item < data.length; item++) {
        if (data[item].category_id === info.getValue("id")) {
            message.error("有产品属于该产品类别")
            return
        }
    }
    const res1 = await instance.post("http://120.76.205.116:9000/files/oss/delete", {
        object_keys : [parts[1]]
    })
    if (res1.data.code === 2) {
        const res2 = await instance.post("http://120.76.205.116:9000/product_categories/delete", {
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