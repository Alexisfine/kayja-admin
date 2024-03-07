import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance from '@/axios/axios'
import { message} from 'antd';


const TimelineInsert = ({semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [title, setTitle] = useState("")
    const [titleEng, setTitleEng] = useState("")
    const [description, setDescription] = useState("")
    const [descriptionEng, setDescriptionEng] = useState("")
    const [year, setYear] = useState(0)
    const [month, setMonth] = useState(0)
    const [status, setStatus] = useState(true)

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const result = await instance.post("http://120.76.205.116:9000/company_timeline/upsert", {
          "title": title,
          "title_eng": titleEng,
          "description":description,
          "description_eng":descriptionEng,
          "year": parseInt(year),
          "month": parseInt(month),
          "status": status ? 1 : 0,
      })
      if (result?.data?.code === 2) {
          setOpen(false)
          semaphore(Math.random())
      }
      message.success("新增成功")
    } catch (err) {
      message.error("新增失败")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button className='my-2'>新增</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>新增</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标题</span>
              <Input onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标题（英文）</span>
              <Input onChange={(e) => setTitleEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>简介</span>
              <Input onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>简介（英文）</span>
              <Input onChange={(e) => setDescriptionEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>年</span>
              <Input onChange={(e) => setYear(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>月</span>
              <Input onChange={(e) => setMonth(e.target.value)}/>
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

export default TimelineInsert