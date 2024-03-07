import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance, { uploadImage } from '@/axios/axios'
import Image from 'next/image'
import { Button as Btn, message, Upload, } from 'antd';
import { UploadOutlined } from '@ant-design/icons'


const PartnerEdit = ({info, semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [name, setName] = useState(info.name)
    const [nameEng, setNameEng] = useState(info.name_eng)
    const [status, setStatus] = useState(info.status)
    const [logoImg, setLogoImg] = useState(info.logo_url)
    const [newLogoImg, setNewLogoImg] = useState(null)

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
      // delete old logo and add new logo 
      var logoImgUrl = logoImg 
      if (newLogoImg) {
        const res = await uploadImage("1003", newLogoImg.originFileObj)
        logoImgUrl = prefix + res  
        await instance.post("http://120.76.205.116:9000/files/oss/delete", {
            object_keys : [logoImg.slice(prefix.length)], 
        })
      }
      await instance.post("http://120.76.205.116:9000/partners/upsert", {
          "id": info.id,   
          "name": name,
          "name_eng": nameEng,
          "status": status ? 1 : 0,
          "logo_url": logoImgUrl,
      })

      message.success("更新合作伙伴成功")
      setOpen(false)
      semaphore(Math.random())

    } catch (err) {
      message.error("更新合作伙伴失败")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button className='my-2'>修改合作伙伴</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>修改合作伙伴</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4 -z-10'>
              <span className='whitespace-nowrap min-w-40'>名称</span>
              <Input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>名称（英文）</span>
              <Input value={nameEng} onChange={(e) => setNameEng(e.target.value)}/>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
            </div>
    
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>封面图片</span>
              <Image src={logoImg} height={250} width={250} alt=""/>
            </div>

            <div className='flex  items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>新封面图片上传</span>
              <div className='flex flex-col'>
                <Upload listType='picture' onChange={(e) => setNewLogoImg(e.file)} maxCount={1}>
                  <Btn icon={<UploadOutlined />}>上传图片</Btn>
                </Upload>
                <span className='text-sm text-red-600'>上传后，旧封面图片将被覆盖</span>
              </div>
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

export default PartnerEdit