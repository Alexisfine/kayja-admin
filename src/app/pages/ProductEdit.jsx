import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance, { uploadImage } from '@/axios/axios'
import "rsuite/dist/rsuite.css"
import Image from 'next/image'
import { Button as Btn, List, message, Select, Space, Upload, Input as Ipt} from 'antd';
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

const ProductEdit = ({id, semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [categories, setCategories] = useState([])
    const [categoriesName, setCategoriesName] = useState([])
    const [category, setCategory] = useState("")
    const [name, setName] = useState("")
    const [nameEng, setNameEng] = useState("")
    const [desc, setDesc] = useState("")
    const [descEng, setDescEng] = useState("")
    const [status, setStatus] = useState(true)
    const [isTop, setIsTop] = useState(false)
    const [coverImg, setCoverImg] = useState(null)
    const [newCoverImg, setNewCoverImg] = useState(null)
    const [img, setImg] = useState([])
    const [deletedImg, setDeletedImg] = useState([])
    const [newImg, setNewImg] = useState([])
    const [detail, setDetail] = useState("")
    const [detailEng, setDetailEng] = useState("")
    const [characteristics, setCharacteristics] = useState([])
    const [characteristicsEng, setCharacteristicsEng] = useState([])
    const [application, setApplication] = useState([])
    const [applicationEng, setApplicationEng] = useState([])

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await instance.get("http://120.76.205.116:9000/product_categories/get_all_for_admin")
            setCategories(res.data.data)
        }
        fetchCategories()
    }, [])

    useEffect(() => {
      var temp = categories.map(cat => {
        return {
          value : cat.name,
          label: cat.name,
        }
      });
      setCategoriesName(temp);
    }, [categories]);

    useEffect(() => {
      const fetchProduct = async () => {
        const res = await instance.get("http://120.76.205.116:9000/products/get_for_admin/" + id)
        const data = res.data.data
        setCategory(data.category_name)
        setName(data.name)
        setNameEng(data.name_eng)
        setDesc(data.description)
        setDescEng(data.description_eng)
        setStatus(data.status)
        setIsTop(data.to_top)
        setCoverImg(data.cover_img_url)
        setImg(data.img_urls)
        setDetail(data.detail)
        setDetailEng(data.detail_eng)
        setCharacteristics(data.characteristics ? data.characteristics : [])
        setCharacteristicsEng(data.characteristics_eng ? data.characteristics_eng : [])
        setApplication(data.applications)
        setApplicationEng(data.applications_eng)
      }
      fetchProduct()
    }, [id, coverImg])

  const handleSelect = (value) => {
    setCategory(value)
  } 
  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const prefix = "https://kayja-img.oss-cn-shenzhen.aliyuncs.com/"
      var coverImgUrl = coverImg
      if (newCoverImg) {
        // update new coverImg
        const res = await uploadImage("1001", newCoverImg.originFileObj)
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

      // add new images 
      var newImgUrls = []
      if (newImg.length > 0) {
        for (var i = 0; i < newImg.length; i++) {
          const res = await uploadImage("1001", newImg[i].originFileObj)
          newImgUrls.push(prefix + res)
        }
      }
      newImgUrls = [...img, ...newImgUrls]
      var cat 
      for (var i = 0; i < categories.length; i++) {
          if (categories[i].name == category) {
              cat = categories[i]
              break  
          }
      }
      const result = await instance.post("http://120.76.205.116:9000/products/upsert", {
          "id":id,
          "category_id": cat.id,
          "category_name": cat.name,
          "category_name_eng": cat.name_eng,
          "name": name,
          "name_eng": nameEng,
          "description": desc,
          "description_eng": descEng,
          "status": status ? 1 : 0,
          "to_top": isTop,
          "cover_img_url": coverImgUrl,
          "img_urls": newImgUrls,
          "detail": detail,
          "detail_eng": detailEng,
          "characteristics": characteristics,
          "characteristics_eng": characteristicsEng,
          "applications": application,
          "applications_eng": applicationEng,
      })
      if (result.data.code === 2) {
        message.success("更新产品成功")
        setOpen(false)
        semaphore(Math.random())
      }
    } catch (err) {
      message.error("更新产品失败")
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button className='my-2'>修改产品</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>修改产品</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4 z-50'>
              <span className='whitespace-nowrap min-w-40'>产品类别</span>
                <Space wrap>
                  <Select defaultValue={category} className='w-[120px]' 
                  onChange={handleSelect} options={categoriesName}/>
                </Space>
            </div>
            <div className='flex items-center space-x-4 -z-10'>
              <span className='whitespace-nowrap min-w-40'>产品名称</span>
              <Input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品名称（英文）</span>
              <Input value={nameEng} onChange={(e) => setNameEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品简介</span>
              <Ipt.TextArea value={desc} 
              className="resize-none"
              onChange={(e) => setDesc(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品简介（英文）</span>
              <Ipt.TextArea value={descEng}
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
              <span className='whitespace-nowrap min-w-40'>产品详情页图片</span>
              <div className='grid grid-cols-3 gap-x-3 gap-y-3'>
                {img.map((cur, idx) => (
                  <div className='flex relative'>
                    <Image src={cur} width={200} height={200} alt=""/>
                    <div className='absolute rounded-full bg-red-500 cursor-pointer
                      -right-1 -top-1 w-6 h-6 items-center text-center justify-center text-white'
                      onClick={() => {
                        appendList(deletedImg, setDeletedImg, cur)
                        removeElementAtIndex(img, idx, setImg)
                      }}>X</div>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品详情页新图片上传</span>
                <Upload listType='picture' onChange={(e) => setNewImg(e.fileList)}>
                <Btn icon={<UploadOutlined />}>上传图片</Btn>
                </Upload>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品详情</span>
              <Ipt.TextArea
              className="resize-none" value={detail}
              onChange={(e) => setDetail(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品详情（英文）</span>
              <Ipt.TextArea
              className="resize-none" value={detailEng}
              onChange={(e) => setDetailEng(e.target.value)}/>
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

export default ProductEdit