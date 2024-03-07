import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance, { uploadImage } from '@/axios/axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const categories = ["行业新闻","公司新闻","展会信息"]

const NewsInsert = ({semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [newsType, setNewsType] = useState(0)
    const [status, setStatus] = useState(true)
    const [title, setTitle] = useState("")
    const [titleEng, setTitleEng] = useState("")
    const [tag, setTag] = useState("")
    const [tagEng, setTagEng] = useState("")
    const [coverImg, setCoverImg] = useState(null)
    const [img, setImg] = useState([])
    const [content, setContent] = useState("")
    const [contentEng, setContentEng] = useState("")

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const res = await uploadImage("1006", coverImg.originFileObj)
      var imgUrls = []
      
      for (var i = 0; i < img.length; i++) {
          const resImg = await uploadImage("1006", img[i].originFileObj)
          imgUrls.push("https://kayja-img.oss-cn-shenzhen.aliyuncs.com/" + resImg)
      }


      const result = await instance.post("http://http://120.76.205.116/:9000/news/upsert", {
          "news_type": newsType,
          "title": title,
          "title_eng": titleEng,
          "tag": tag,
          "tag_eng": tagEng,
          "status": status ? 1 : 0,
          "cover_img_url": "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/" + res,
          "images_url": imgUrls,
          "content": content,
          "content_eng": contentEng,

      })
      if (result?.data?.code === 2) {
          setOpen(false)
          semaphore(Math.random())
      }
      message.success("新增产品成功")
    } catch (err) {
      message.error("新增产品失败")
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
              <span className='whitespace-nowrap min-w-40'>产品类别</span>
                <Select onValueChange={(e) => setNewsType(e)} defaultValue={0}>
                    <SelectTrigger>
                        <SelectValue placeholder="选择新闻类别" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat, idx) => (
                            <SelectItem key={idx} value={idx}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标题</span>
              <Input onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标题（英文）</span>
              <Input onChange={(e) => setTitleEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标签</span>
              <Input onChange={(e) => setTag(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>标签（英文）</span>
              <Input onChange={(e) => setTagEng(e.target.value)}/>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>封面图片上传</span>
                <Upload listType='picture' onChange={(e) => setCoverImg(e.file)} maxCount={1}>
                  <Btn icon={<UploadOutlined/>}>上传图片</Btn>
                </Upload>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>新闻页图片上传</span>
                <Upload listType='picture' onChange={(e) => setImg(e.fileList)}>
                  <Btn icon={<UploadOutlined/>}>上传图片</Btn>
                </Upload>
            </div>

            
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>内容</span>
              <Ipt.TextArea
              className="resize-none"
              onChange={(e) => setContent(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>内容（英文）</span>
              <Ipt.TextArea
              className="resize-none"
              onChange={(e) => setContentEng(e.target.value)}/>
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

export default NewsInsert