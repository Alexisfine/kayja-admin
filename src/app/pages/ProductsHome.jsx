import InfoPage from '@/components/InfoPage'
import { PRODUCT_CATEGORIES } from '@/lib/category'
import React from 'react'

const ProductsHome = () => {
  return (
    <InfoPage title={PRODUCT_CATEGORIES.title} categories={PRODUCT_CATEGORIES.categories}/>

  )
}

export default ProductsHome