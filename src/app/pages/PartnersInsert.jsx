import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance, { uploadImage } from '@/axios/axios'
import { Button as Btn, message, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons'


const updateItem = (array, index, newValue, setFunc) => {
    // Create a new array with the same values as the current `items`
    const updatedItems = [...array];
    
    // Update the value at the specified index
    updatedItems[index] = newValue;
    
    // Set the state to the new array
    setFunc(updatedItems);
};

const appendList = (list, setList) => {
    setList(list => [...list, ""])
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

const PartnerInsert = ({semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [name, setName] = useState("")
    const [nameEng, setNameEng] = useState("")
    const [status, setStatus] = useState(true)
    const [coverImg, setCoverImg] = useState("")

  const handleSubmit = async () => {
    setCanSubmit(false)
    const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
    try {
      const res = await uploadImage("1003", coverImg.originFileObj)

      const result = await instance.post("http://120.76.205.116:9000/partners/upsert", {
          "name": name,
          "name_eng": nameEng,
          "status": status ? 1 : 0,
          "logo_url": prefix + res,
      })
      if (result?.data?.code === 2) {
          setOpen(false)
          semaphore(Math.random())
      }
      message.success("新增合作伙伴成功")
    } catch (err) {
      message.error("新增合作伙伴失败")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button className='my-2'>新增合作伙伴</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>新增合作伙伴</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>名称</span>
              <Input onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>名称（英文）</span>
              <Input onChange={(e) => setNameEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>封面图片上传</span>
                <Upload listType='picture' onChange={(e) => setCoverImg(e.file)} maxCount={1}>
                  <Btn icon={<UploadOutlined/>}>上传图片</Btn>
                </Upload>
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

export default PartnerInsert