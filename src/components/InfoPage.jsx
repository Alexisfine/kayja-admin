import { Product } from '@/app/pages/Product'
import { ProductCategory } from '@/app/pages/ProductCategory'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

const InfoPage = ({title, categories}) => {
  const [cat,setCat] = useState(0)
  return (
    <div className='w-full flex flex-col py-3 px-8'>
      <h2 className='text-4xl'>{title}</h2>
      <div className='w-full flex rounded-b-xl py-5'>
            <div className='w-full flex items-center justify-around'>
                {categories.length > 1 && 
                categories.map((category, index) => {
                    return <span key={index} className={cn(index === cat ? "font-bold" : "font-light", "text-lg")}
                  onClick={() =>setCat(index)}>{category.name}</span>
                })
            }
            </div>
      </div>
      {categories[cat].view}
    </div>
  )
}

export default InfoPage