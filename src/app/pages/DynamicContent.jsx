"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import instance from "@/axios/axios"
import { Button } from "@/components/ui/button";
import { message } from "antd";
import { ReloadIcon } from "@radix-ui/react-icons";


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

const DynamicContentHome = () => {
    const [canSubmit, setCanSubmit] = React.useState(true)
    const [semaphore, setSemaphore] = React.useState(0.0)
    const [id, setId] = React.useState("")
    const [products, setProducts] = React.useState([])
    const [news, setNews] = React.useState([])
    const [urls, setUrls] = React.useState([])

    const handleSubmit = async () => {
        const payload = {
            "id":id, 
            "products":products,
            "news":news, 
            "links":{
                "urls":urls,
            }
        }
        try {
            setCanSubmit(false)
            const res = await instance.post("http://120.76.205.116:9000/dynamic_content/upsert", payload)
            if (res.data.code === 2) {
                message.success("更新成功")
                setSemaphore(Math.random())
            }
        } catch (err) {
            console.log(err)
            message.error("更新失败")
            setSemaphore(Math.random())
        } finally {
            setCanSubmit(true)
        }
    }
    React.useEffect(() => {
        const fetchCases = async () => {
            const res = await instance.get('http://120.76.205.116:9000/dynamic_content/get_all')
            if (res.data.code === 2) {
                setId(res.data.data.id)
                setProducts(res.data.data.products)
                setNews(res.data.data.news)
                setUrls(res.data.data.links.urls)
            } else {
                console.log("failed to fetch data")
            }
        }
        fetchCases()
    }, [semaphore])
    return (
        <div className="w-full flex flex-col py-3 px-8 space-y-3">
            <h2 className="text-4xl">手里动态页面信息管理</h2>
            <div className="space-y-2">
                <h3 className="text-2xl">最新产品</h3>
                <h4 className="text-lg">请输入想要添加产品的ID号</h4>
                <div className="flex flex-col space-y-3">
                    {products?.map((p, idx) => (
                        <div key={p} className="flex space-x-10">
                            <Input value={p} onChange={(e) => updateItem(products, idx, e.target.value, setProducts)}/>
                            <Button variant="destructive" onClick={() => removeElementAtIndex(products, idx, setProducts)}>删除</Button>
                        </div>
                    ))}
                </div>
                <Button className='' variant="secondary" onClick={() => appendList(products, setProducts)}>新增产品</Button>
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl">热点新闻</h3>
                <h4 className="text-lg">请输入想要添加新闻的ID号</h4>
                <div className="flex flex-col space-y-3">
                    {news?.map((p, idx) => (
                        <div key={p} className="flex space-x-10">
                            <Input value={p} onChange={(e) => updateItem(news, idx, e.target.value, setNews)}/>
                            <Button variant="destructive" onClick={() => removeElementAtIndex(news, idx, setNews)}>删除</Button>
                        </div>
                    ))}
                </div>
                <Button className='' variant="secondary" onClick={() => appendList(news, setNews)}>新增新闻</Button>
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl">相关链接</h3>
                <h4 className="text-lg">请输入想要添加的链接</h4>
                <div className="flex flex-col space-y-3">
                    {urls?.map((url, idx) => (
                        <div key={idx} className="flex space-x-10 items-center">
                            <span className="whitespace-nowrap">链接名称：</span>
                            <Input value={url.name} onChange={(e) => updateItem(urls, idx, {
                                name : e.target.value,
                                url: url.url 
                            }, setUrls)}/>
                            <span className="whitespace-nowrap">链接地址：</span>
                            <Input value={url.url} onChange={(e) => updateItem(urls, idx, {
                                name: url.name,
                                url: e.target.value,
                            }, setUrls)}/>
                            <Button variant="destructive" onClick={() => removeElementAtIndex(urls, idx, setUrls)}>删除</Button>
                        </div>
                    ))}
                </div>
                <Button className='' variant="secondary" onClick={() => appendList(urls, setUrls)}>新增链接</Button>
            </div>
            <Button className='w-full' onClick={handleSubmit} disabled={!canSubmit}>
              {!canSubmit && <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>}
              提交
            </Button>
        </div>
    )
}

export default DynamicContentHome
