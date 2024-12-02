import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance from '@/axios/axios'
import axios from 'axios'
import { Upload, Button as Btn } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import {message} from "antd"

export const ProductCategoryCrud = ({title, semaphore}) => {
  const [name, setName] = useState("")
  const [nameEng, setNameEng] = useState("")
  const [desc, setDesc] = useState("")
  const [descEng, setDescEng] = useState("")
  const [status, setStatus] = useState(true)
  const [img, setImg] = useState(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [open, setOpen] = useState(false)
  const [ranking, setRanking] = useState(0)

  const handleSubmit = async () => {
    setCanSubmit(false)
    if (!img?.originFileObj) {
      message.warning("请添加图片")
      setCanSubmit(true)
      return 
    }
    try {
      const res = await instance.post("http://120.76.205.116:9000/files/oss/get_token", {
      "biz_id" : "1000",
      })
      if (res.data.code === 2) {
        const data = res.data.data 
        const formData = {
          key: data.key,
          OSSAccessKeyId: data.accessid,
          Policy: data.policy,
          Signature: data.signature,
          File: img.originFileObj, 
        }
        const resFile = await axios.post("http://kayja-img.oss-cn-shenzhen.aliyuncs.com", 
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const resUpsert = await instance.post("http://120.76.205.116:9000/product_categories/upsert", {
          "name": name,
          "description": desc,
          "name_eng": nameEng,
          "description_eng" : descEng,
          "ranking":parseInt(ranking),
          "status": status? 1 : 0,
          "cover_img_url": "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/" + data.key
        })
        console.log(resUpsert)
        if (resUpsert.data.code === 2) {
          console.log("success")
        } else {
          console.log("failed")
        }
        setOpen(false)
        semaphore(Math.random())
        message.success("新增产品类别成功")
      } else {
        console.log("failed to fetch data")
        message.error("新增产品类别失败")
      }
    } catch (err) {
      message.error("新增产品类别失败")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className='my-2'>{title}</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>{title}</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别名称</span>
              <Input onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别英文名称</span>
              <Input onChange={(e) => setNameEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别简介</span>
              <Textarea
              className="resize-none"
              onChange={(e) => setDesc(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别英文简介</span>
              <Textarea
              className="resize-none"
              onChange={(e) => setDescEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>排名（从上往下）</span>
              <Input value={ranking} onChange={(e) => setRanking(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>封面图片上传</span>
              <Upload listType='picture' onChange={(e) => setImg(e.file)} maxCount={1}>
                  <Btn icon={<UploadOutlined />}>Click to Upload</Btn>
              </Upload>
              {/* <Input id="picture" type="file" onChange={(e) => setImg(e.target.files[0])}/> */}
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

