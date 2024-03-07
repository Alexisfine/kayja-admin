import Image from 'next/image'
import React, { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'

const ImageView = ({url, setImgState}) => {
    const [open, setOpen] = useState(false)
  return (
    <div className='relative'>
    {/* <div className='absolute bg-red-600 rounded-full text-center 
        text-white w-8 h-8 -top-3 -right-3 cursor-pointer'
        onClick={() => console.log("OK")}>X</div> */}

        <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
      <div className='absolute bg-red-600 rounded-full text-center text-sm
        text-white w-5 h-5 -top-3 -right-3 cursor-pointer'
        onClick={() => console.log("OK")}>X</div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请确认是否继续删除该图片</AlertDialogTitle>
          <AlertDialogDescription>
            删除无法撤回,点击确认后将永久删除该图片
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={setImgState(0)}>继续</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
      <Image src={url} width='40' height='40'/>
    </div>
  )
}
export default ImageView