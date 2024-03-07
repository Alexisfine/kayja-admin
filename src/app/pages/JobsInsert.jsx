import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance from '@/axios/axios'
import { Upload, Button as Btn, List, Input as Ipt} from 'antd'
import {message} from "antd"

export const JobsInsert = ({title, semaphore}) => {
  const [open, setOpen] = useState(false)
  const [canSubmit, setCanSubmit] = useState(true)
  const [department, setDepartment] = useState("")
  const [departmentEng, setDepartmentEng] = useState("")
  const [name, setName] = useState("")
  const [nameEng, setNameEng] = useState("")
  const [location, setLocation] = useState("")
  const [locationEng, setLocationEng] = useState("")
  const [email, setEmail] = useState("")
  const [responsibility, setResponsibility] = useState([])
  const [responsibilityEng, setResponsibilityEng] = useState([])  
  const [requirement, setRequirement] = useState([])
  const [requirementEng, setRequirementEng] = useState([])  
  const [status, setStatus] = useState(true)

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

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const result = await instance.post("http://http://120.76.205.116/:9000/jobs/upsert", {
          "department": department,
          "department_eng": departmentEng,
          "name": name,
          "name_eng": nameEng,
          "location": location,
          "location_eng": locationEng,
          "email": email,
          "responsibility":responsibility,
          "responsibility_eng": responsibilityEng, 
          "requirement": requirement, 
          "requirement_eng": requirementEng, 
          "status": status ? 1 : 0,
      })
      if (result?.data?.code === 2) {
          setOpen(false)
          semaphore(Math.random())
      }
      message.success("新增成功")
    } catch (err) {
      message.error("新增失败")
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className='my-2'>{title}</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-scroll'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>{title}</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别名称</span>
              <Input onChange={(e) => setDepartment(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别名称（英文）</span>
              <Input onChange={(e) => setDepartmentEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位名称</span>
              <Input onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位名称（英文）</span>
              <Input onChange={(e) => setNameEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>地点</span>
              <Input onChange={(e) => setLocation(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>地点（英文）</span>
              <Input onChange={(e) => setLocationEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>联系邮箱</span>
              <Input onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>岗位责任</span>
              <div className='w-full flex flex-col space-y-4'>
                <List dataSource={responsibility} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(responsibility, idx, e.target.value, setResponsibility)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(responsibility, idx, setResponsibility)}>删除</Button>
                  </List.Item>
                )}>
                </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(responsibility, setResponsibility)}>新增岗位责任</Button>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>岗位责任（英文）</span>
              <div className='w-full flex flex-col space-y-4'>
                <List dataSource={responsibilityEng} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(responsibilityEng, idx, e.target.value, setResponsibilityEng)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(responsibilityEng, idx, setResponsibilityEng)}>删除</Button>
                  </List.Item>
                )}>
                </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(responsibilityEng, setResponsibilityEng)}>新增岗位责任（英文）</Button>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>岗位要求</span>
              <div className='w-full flex flex-col space-y-4'>
                <List dataSource={requirement} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(requirement, idx, e.target.value, setRequirement)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(requirement, idx, setRequirement)}>删除</Button>
                  </List.Item>
                )}>
                </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(requirement, setRequirement)}>新增岗位要求</Button>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>岗位要求（英文）</span>
              <div className='w-full flex flex-col space-y-4'>
                <List dataSource={requirementEng} renderItem={(item, idx) => (
                  <List.Item className='flex gap-x-3'>
                    <Ipt value={item} onChange={(e) => updateItem(requirementEng, idx, e.target.value, setRequirementEng)}></Ipt>
                    <Button variant="destructive" onClick={() => removeElementAtIndex(requirementEng, idx, setRequirementEng)}>删除</Button>
                  </List.Item>
                )}>
                </List>
              </div>
            </div>
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(requirementEng, setRequirementEng)}>新增岗位要求</Button>



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

