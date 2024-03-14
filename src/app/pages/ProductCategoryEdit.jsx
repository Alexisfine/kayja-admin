import instance, { uploadImage } from '@/axios/axios'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { UploadOutlined } from '@ant-design/icons'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Button as Btn, Upload, message } from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ProductCategoryEdit = ({info, semaphore}) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(info.name)
  const [nameEng, setNameEng] = useState(info.name_eng)
  const [desc, setDesc] = useState(info.description)
  const [descEng, setDescEng] = useState(info.description_eng)
  const [status, setStatus] = useState(info.status)
  const [img, setImg] = useState(info.cover_img_url)
  const [newImg, setNewImg] = useState(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [ranking, setRanking] = useState(info.ranking)
  
  useEffect(() => {}, [info])

  const handleSubmit = async () => {
    setCanSubmit(false)
    const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
    var imgUrl = img 
    try {
      if (newImg) {
        const res = await uploadImage("1000", newImg.originFileObj)
        const res2 = await instance.post("http://120.76.205.116:9000/files/oss/delete", {
          object_keys : [img.slice(prefix.length)]
        })
        imgUrl = prefix + res 
      }
  
  
      const resUpsert = await instance.post("http://120.76.205.116:9000/product_categories/upsert", {
        "id":info.id,
        "name": name,
        "description": desc,
        "name_eng": nameEng,
        "description_eng" : descEng,
        "status": status? 1 : 0,
        "ranking": parseInt(ranking),
        "cover_img_url": imgUrl
      })
      setOpen(false)
      semaphore(Math.random())
      message.success("修改产品类别成功")
    } catch (err) {
      message.error("修改产品类别错误")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className="font-medium" variant='secondary'>修改</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='flex text-3xl text-black'>修改数据</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black overflow-scroll'>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别名称</span>
              <Input onChange={(e) => setName(e.target.value)} value={name}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别英文名称</span>
              <Input onChange={(e) => setNameEng(e.target.value)} value={nameEng}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别简介</span>
              <Textarea
              className="resize-none"
              onChange={(e) => setDesc(e.target.value)} value={desc}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别英文简介</span>
              <Textarea
              className="resize-none"
              onChange={(e) => setDescEng(e.target.value)} value={descEng}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)} value={status}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>排名（从上往下）</span>
              <Input onChange={(e) => setRanking(e.target.value)} value={ranking}/>
            </div>
            
            <div className='flex  items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>封面图片</span>
              <Image src={img} width={250} height={250} alt=''/>
            </div>
            
            <div className='flex  items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>新封面图片上传</span>
              <div className='flex flex-col'>
                <Upload listType='picture' onChange={(e) => setNewImg(e.file)} maxCount={1}>
                  <Btn icon={<UploadOutlined />}>上传图片</Btn>
                </Upload>
                <span className='text-sm text-red-600'>上传后，旧封面图片将被覆盖</span>
              </div>
            </div>

            <Button className='w-full' onClick={handleSubmit}>
              {!canSubmit && <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>}
              提交
            </Button>
          </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  )
}

export default ProductCategoryEdit