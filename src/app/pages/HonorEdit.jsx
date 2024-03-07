import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance from '@/axios/axios'
import { Button as Btn, message, Upload, } from 'antd';


const HonorEdit = ({info, semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [title, setTitle] = useState(info.title)
    const [titleEng, setTitleEng] = useState(info.title_eng)
    const [year, setYear] = useState(info.year)
    const [month, setMonth] = useState(info.month)
    const [status, setStatus] = useState(info.status)

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      await instance.post("http://http://120.76.205.116/:9000/company_honor/upsert", {
          "id": info.id,   
          "title": title,
          "title_eng": titleEng,
          "year": parseInt(year),
          "month":parseInt(month),
          "status": status ? 1 : 0,
      })

      message.success("更新成功")
      setOpen(false)
      semaphore(Math.random())

    } catch (err) {
      message.error("更新失败")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button className='my-2'>修改</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>修改</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4 -z-10'>
              <span className='whitespace-nowrap min-w-40'>标题</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标题（英文）</span>
              <Input value={titleEng} onChange={(e) => setTitleEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>年</span>
              <Input value={year} onChange={(e) => setYear(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>月</span>
              <Input value={month} onChange={(e) => setMonth(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
            </div>

            <Button className='w-full' onClick={() => handleSubmit()} disabled={!canSubmit}>
              {!canSubmit && <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>}
              提交
            </Button>
          </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  )
}

export default HonorEdit