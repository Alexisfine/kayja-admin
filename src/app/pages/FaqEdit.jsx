import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReloadIcon } from "@radix-ui/react-icons"
import instance from '@/axios/axios'
import { Button as Btn, message } from 'antd';


const FaqEdit = ({info, semaphore}) => {
    const [open, setOpen] = useState(false)
    const [canSubmit, setCanSubmit] = useState(true)
    const [question, setQuestion] = useState(info.question)
    const [questionEng, setQuestionEng] = useState(info.question_eng)
    const [answer, setAnswer] = useState(info.answer)
    const [answerEng, setAnswerEng] = useState(info.answer_eng)

  const handleSubmit = async () => {
    setCanSubmit(false)
    try {
      await instance.post("http://http://120.76.205.116/:9000/faqs/upsert", {
          "id": info.id,   
          "question": question,
          "question_eng": questionEng,
          "answer": answer,
          "answer_eng": answerEng,
      })

      message.success("更新成功")
      setOpen(false)
      semaphore(Math.random())

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
            <div className='flex items-center space-x-4 -z-10'>
              <span className='whitespace-nowrap min-w-40'>问题</span>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>问题（英文）</span>
              <Input value={questionEng} onChange={(e) => setQuestionEng(e.target.value)}/>
            </div>

            <div className='flex items-center space-x-4 -z-10'>
              <span className='whitespace-nowrap min-w-40'>解答</span>
              <Input value={answer} onChange={(e) => setAnswer(e.target.value)}/>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='whitespace-nowrap min-w-40'>解答（英文）</span>
              <Input value={answerEng} onChange={(e) => setAnswerEng(e.target.value)}/>
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

export default FaqEdit