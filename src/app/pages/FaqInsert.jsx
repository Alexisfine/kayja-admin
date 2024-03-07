import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance, { uploadImage } from '@/axios/axios'
import { Button as Btn, message, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons'



const FaqInsert = ({semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [question, setQuestion] = useState("")
    const [questionEng, setQuestionEng] = useState("")
    const [answer, setAnswer] = useState("")
    const [answerEng, setAnswerEng] = useState("")

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {

      const result = await instance.post("http://120.76.205.116:9000/faqs/upsert", {
          "question": question,
          "question_eng": questionEng,
          "answer": answer,
          "answer_eng": answerEng,
      })
      if (result?.data?.code === 2) {
          setOpen(false)
          semaphore(Math.random())
      }
      message.success("新增常见问题成功")
    } catch (err) {
      message.error("新增常见问题失败")
      console.log(err)
    } finally {
      setCanSubmit(true)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogTrigger asChild>
          <Button className='my-2'>新增常见问题</Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
          <DialogTitle className='text-3xl text-black'>新增常见问题</DialogTitle>
          <DialogDescription className='text-center mt-5 space-y-3 text-lg text-black'>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>问题</span>
              <Input onChange={(e) => setQuestion(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>问题（英文）</span>
              <Input onChange={(e) => setQuestionEng(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>解答</span>
              <Input onChange={(e) => setAnswer(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>解答（英文）</span>
              <Input onChange={(e) => setAnswerEng(e.target.value)}/>
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

export default FaqInsert