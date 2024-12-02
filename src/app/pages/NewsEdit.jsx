import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance, { uploadImage } from '@/axios/axios'
import "rsuite/dist/rsuite.css"
import Image from 'next/image'
import { Button as Btn, message, Space, Upload, Input as Ipt} from 'antd';
import { UploadOutlined } from '@ant-design/icons'


const updateItem = (array, index, newValue, setFunc) => {
    // Create a new array with the same values as the current `items`
    const updatedItems = [...array];
    
    // Update the value at the specified index
    updatedItems[index] = newValue;
    
    // Set the state to the new array
    setFunc(updatedItems);
};

const appendList = (list, setList, val = "") => {
    setList(list => [...list, val])
}

const removeElementAtIndex = (array, index, setArray) => {
  // Create a new array without the element at the provided index
  const newArray = [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ];

  // Set the state to this new array
  setArray(newArray);
};
const categories = ["行业新闻","公司新闻","展会信息"]

const NewsEdit = ({info, semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [status, setStatus] = useState(info.status)
    const [title, setTitle] = useState(info.title)
    const [titleEng, setTitleEng] = useState(info.title_eng)
    const [coverImg, setCoverImg] = useState(info.cover_img_url)
    const [newCoverImg, setNewCoverImg] = useState(null)
    const [link, setLink] = useState(info.link)
    const [deletedImg, setDeletedImg] = useState([])

  const handleSubmit = async () => {
    setCanSubmit(false)
    if (link == "") {
      message.warning("请添加链接")
      setCanSubmit(true)
      return 
    }
    try {
      const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
      var coverImgUrl = coverImg
      if (newCoverImg) {
        // update new coverImg
        const res = await uploadImage("1006", newCoverImg.originFileObj)
        coverImgUrl = prefix + res
        // delete old coverImg 
        const res1 = await instance.post("http://120.76.205.116:9000/files/oss/delete", {
          object_keys: [coverImg.slice(prefix.length)]
        })
      }
      // delete old images 
      if (deletedImg.length > 0) {
        var object_keys = []
        for (var i = 0; i < deletedImg.length; i++) {
          object_keys.push(deletedImg[i].slice(prefix.length))
        }
        const res = await instance.post("http://120.76.205.116:9000/files/oss/delete", {
          object_keys,
        })
      }

      const result = await instance.post("http://120.76.205.116:9000/news/upsert", {
          "id":info.id,
          "title": title,
          "title_eng": titleEng,
          "status": status ? 1 : 0,
          "cover_img_url": coverImgUrl,
          "link": link,
      })
      if (result.data.code === 2) {
        message.success("更新成功")
        setOpen(false)
        semaphore(Math.random())
      }
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

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标题</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标题（英文）</span>
              <Input value={titleEng} onChange={(e) => setTitleEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>封面图片</span>
              <Image src={coverImg} height={250} width={250} alt=""/>
            </div>
            <div className='flex  items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>新封面图片上传</span>
              <div className='flex flex-col'>
                <Upload listType='picture' onChange={(e) => setNewCoverImg(e.file)} maxCount={1}>
                  <Btn icon={<UploadOutlined />}>上传图片</Btn>
                </Upload>
                <span className='text-sm text-red-600'>上传后，旧封面图片将被覆盖</span>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>链接</span>
              <Input value={link} onChange={(e) => setLink(e.target.value)}/>
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

export default NewsEdit