import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance, { uploadImage } from '@/axios/axios'
import Image from 'next/image'
import { Button as Btn, List, message, Upload, Input as Ipt} from 'antd';
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

const CasesEdit = ({info, semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [name, setName] = useState(info.name)
    const [nameEng, setNameEng] = useState(info.name_eng)
    const [tag, setTag] = useState(info.tag)
    const [tagEng, setTagEng] = useState(info.tag_eng)
    const [status, setStatus] = useState(info.status)
    const [coverImg, setCoverImg] = useState(info.cover_url)
    const [newCoverImg, setNewCoverImg] = useState(null)
    const [ranking, setRanking] = useState(info.ranking)

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
      // delete old cover and add new cover 
      var coverImgUrl = coverImg 
      if (newCoverImg) {
        const res = await uploadImage("1002", newCoverImg.originFileObj)
        coverImgUrl = prefix + res  
        await instance.post("http://120.76.205.116:9000/files/oss/delete", {
            object_keys : [coverImg.slice(prefix.length)], 
        })
      }
      await instance.post("http://120.76.205.116:9000/solutions/upsert", {
          "id": info.id,   
          "name": name,
          "name_eng": nameEng,
          "tag": tag,
          "tag_eng": tagEng,
          "status": status ? 1 : 0,
          "ranking": parseInt(ranking),
          "cover_url": coverImgUrl,
      })

      message.success("更新案例成功")
      setOpen(false)
      semaphore(Math.random())

    } catch (err) {
      message.error("更新案例失败")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button className='my-2'>修改案例</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>修改案例</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4 -z-10'>
              <span className='whitespace-nowrap min-w-40'>案例名称</span>
              <Input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品名称（英文）</span>
              <Input value={nameEng} onChange={(e) => setNameEng(e.target.value)}/>
            </div>
              <div className='flex items-center space-x-4'>
                  <span className='whitespace-nowrap min-w-40'>排序</span>
                  <Input value={ranking} onChange={(e) => setRanking(e.target.value)}/>
              </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标签名称</span>
              <Input value={tag} onChange={(e) => setTag(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标签名称（英文）</span>
              <Input value={tagEng} onChange={(e) => setTagEng(e.target.value)}/>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
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

export default CasesEdit