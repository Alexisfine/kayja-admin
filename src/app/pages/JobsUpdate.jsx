import React, {  useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance from '@/axios/axios'
import { List, message, Input as Ipt} from 'antd';


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

const JobsUpdate = ({info, semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [department, setDepartment] = useState(info.department)
    const [departmentEng, setDepartmentEng] = useState(info.department_eng)
    const [name, setName] = useState(info.name)
    const [nameEng, setNameEng] = useState(info.name_eng)
    const [location, setLocation] = useState(info.location)
    const [locationEng, setLocationEng] = useState(info.location_eng)
    const [email, setEmail] = useState(info.email)
    const [responsibility, setResponsibility] = useState(info.responsibility)
    const [responsibilityEng, setResponsibilityEng] = useState(info.responsibility_eng)  
    const [requirement, setRequirement] = useState(info.requirement)
    const [requirementEng, setRequirementEng] = useState(info.requirement_eng)  
    const [status, setStatus] = useState(info.status)

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      const result = await instance.post("http://http://120.76.205.116/:9000/jobs/upsert", {
          "id":info.id,
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
      if (result.data.code === 2) {
        message.success("更新产品成功")
        setOpen(false)
        semaphore(Math.random())
      }
    } catch (err) {
      message.error("更新产品失败")
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
              <span className='whitespace-nowrap min-w-40'>产品类别名称</span>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>产品类别名称（英文）</span>
              <Input value={departmentEng} onChange={(e) => setDepartmentEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位名称</span>
              <Input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位名称（英文）</span>
              <Input value={nameEng} onChange={(e) => setNameEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>地点</span>
              <Input value={location} onChange={(e) => setLocation(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>地点（英文）</span>
              <Input value={locationEng} onChange={(e) => setLocationEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>联系邮箱</span>
              <Input value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>是否上线</span>
              <Switch
                checked={status}
                onCheckedChange={() => setStatus(!status)}/>
            </div>
           
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位职责</span>
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
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(responsibility, setResponsibility)}>新增职责</Button>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位职责（英文）</span>
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
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(responsibilityEng, setResponsibilityEng)}>新增职责（英文）</Button>


            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位要求</span>
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
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(requirement, setRequirement)}>新增要求</Button>

            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>职位要求（英文）</span>
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
            <Button className='w-3/4' variant="secondary" onClick={() => appendList(requirementEng, setRequirementEng)}>新增要求（英文）</Button>

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

export default JobsUpdate