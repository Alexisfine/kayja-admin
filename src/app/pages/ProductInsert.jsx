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

const ProductInsert = ({semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState("")
    const [name, setName] = useState("")
    const [nameEng, setNameEng] = useState("")
    const [desc, setDesc] = useState("")
    const [descEng, setDescEng] = useState("")
    const [status, setStatus] = useState(true)
    const [isTop, setIsTop] = useState(false)
    const [coverImg, setCoverImg] = useState(null)
    const [img, setImg] = useState([])
    const [detail, setDetail] = useState("")
    const [detailEng, setDetailEng] = useState("")
    const [characteristics, setCharacteristics] = useState([])
    const [characteristicsEng, setCharacteristicsEng] = useState([])
    const [application, setApplication] = useState([])
    const [applicationEng, setApplicationEng] = useState([])
    const [ranking, setRanking] = useState(0)

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await instance.get("http://120.76.205.116:9000/product_categories/get_all_for_admin")
            const data = res.data.data
            setCategories(data)
        }
        fetchCategories()
    }, [])


  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const res = await uploadImage("1001", coverImg.originFileObj)
      var imgUrls = []
      
      for (var i = 0; i < img.length; i++) {
          const resImg = await uploadImage("1001", img[i].originFileObj)
          imgUrls.push("https://kayja-img.oss-cn-shenzhen.aliyuncs.com/" + resImg)
      }

      var cat 
      for (var i = 0; i < categories.length; i++) {
          if (categories[i].name == category) {
              cat = categories[i]
              break  
          }
      }
      const result = await instance.post("http://120.76.205.116:9000/products/upsert", {
          "category_id": cat.id,
          "category_name": cat.name,
          "category_name_eng": cat.name_eng,
          "name": name,
          "name_eng": nameEng,
          "description": desc,
          "description_eng": descEng,
          "status": status ? 1 : 0,
          "to_top": isTop,
          "cover_img_url": "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/" + res,
          "img_urls": imgUrls,
          "detail": detail,
          "detail_eng": detailEng,
          "characteristics":characteristics,
          "characteristicsEng": characteristicsEng,
          "applications": application,
          "applications_eng": applicationEng,
          "ranking":parseInt(ranking),
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
          <Button className='my-2'>新增产品</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>新增产品</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别</span>
                <Select onValueChange={(e) => setCategory(e)} defaultValue={1}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat, idx) => (
                            <SelectItem key={idx} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品名称</span>
              <Input onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品名称（英文）</span>
              <Input onChange={(e) => setNameEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品简介</span>
              <Ipt.TextArea
              className="resize-none"
              onChange={(e) => setDesc(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品简介（英文）</span>
              <Ipt.TextArea
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
              <span className='whitespace-nowrap min-w-40'>是否置顶</span>
              <Switch
                checked={isTop}
                onCheckedChange={() => setIsTop(!isTop)}/>
            </div>
          <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>排名（从上往下）</span>
              <Input value={ranking} onChange={(e) => setRanking(e.target.value)}/>
          </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>封面图片上传</span>
                <Upload listType='picture' onChange={(e) => setCoverImg(e.file)} maxCount={1}>
                  <Btn icon={<UploadOutlined/>}>上传图片</Btn>
                </Upload>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品详情页图片上传</span>
                <Upload listType='picture' onChange={(e) => setImg(e.fileList)}>
                  <Btn icon={<UploadOutlined/>}>上传图片</Btn>
                </Upload>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品详情</span>
              <Ipt.TextArea
              className="resize-none"
              onChange={(e) => setDetail(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品详情（英文）</span>
              <Ipt.TextArea
              className="resize-none"
              onChange={(e) => {setDetailEng(e.target.value)}}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品特点</span>
              <div className='w-full flex flex-col space-y-4'>
                <List dataSource={characteristics} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(characteristics, idx, e.target.value, setCharacteristics)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(characteristics, idx, setCharacteristics)}>删除</Button>
                  </List.Item>
                )}>
                </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(characteristics, setCharacteristics)}>新增产品特点</Button>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品特点（英文）</span>
              <div className='w-full flex flex-col space-y-4'>
              <List dataSource={characteristicsEng} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(characteristicsEng, idx, e.target.value, setCharacteristicsEng)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(characteristicsEng, idx, setCharacteristicsEng)}>删除</Button>
                  </List.Item>
                )}>
              </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(characteristicsEng, setCharacteristicsEng)}>新增产品特点（英文）</Button>


            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>应用场景</span>
              <div className='w-full flex flex-col space-y-4'>
                <List dataSource={application} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(application, idx, e.target.value, setApplication)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(application, idx, setApplication)}>删除</Button>
                  </List.Item>
                )}>
                </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(application, setApplication)}>新增应用场景</Button>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>应用场景（英文）</span>
              <div className='w-full flex flex-col space-y-4'>
              <List dataSource={applicationEng} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(applicationEng, idx, e.target.value, setApplicationEng)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(applicationEng, idx, setApplicationEng)}>删除</Button>
                  </List.Item>
                )}>
              </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(applicationEng, setApplicationEng)}>新增应用场景（英文）</Button>

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

export default ProductInsert