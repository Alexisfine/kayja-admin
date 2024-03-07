import { Product } from "@/app/pages/Product";
import { ProductCategory } from "@/app/pages/ProductCategory";

export const PRODUCT_CATEGORIES = {
    title: "产品管理",
    categories: [
        {
            name:"产品类型管理",
            view: <ProductCategory/>
        },
        {
            name:"产品管理",
            view: <Product/>
        }
    ]
}