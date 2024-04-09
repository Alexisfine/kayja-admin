'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import instance from "@/axios/axios";
import Sidebar from "@/components/Sidebar";
import Headbar from "@/components/Headbar";
import ProductsHome from "./pages/ProductsHome";
import CasesHome from "./pages/CasesHome";
import PartnersHome from "./pages/PartnersHome";
import NewsHome from "./pages/NewsHome";
import JobsHome from "./pages/JobsHome";
import FaqHome from "./pages/FaqHome";
import HonorHome from "./pages/HonorHome";
import TimelineHome from "./pages/TimelineHome";
import MessageHome from "./pages/MessageHome";
import DynamicContentHome from "./pages/DynamicContent";

const Home = () => {
  const router = useRouter();
  const [page, setPage] = useState('products')

  useEffect(() => {
    // Replace this with your actual login check
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/users/login');
    }
  }, [router]);

  const getCurrentPage = () => {
    switch (page) {
      case 'products':
        return <ProductsHome/>  
      case 'cases':
        return <CasesHome/>  
      case 'partners':
        return <PartnersHome/>
      case 'news':
        return <NewsHome/>
      case 'jobs':
        return <JobsHome/>
      // case 'faq':
      //   return <FaqHome/>
      // case 'timeline':
      //   return <TimelineHome/>
      case 'honor':
        return <HonorHome/>  
      // case 'message':
      //   return <MessageHome/>
      case 'dynamic_content':
        return <DynamicContentHome/>
      default:
        return <ProductsHome/>
    }
  }

  const handleLogout = async () => {
    const res = await instance.post("http://120.76.205.116:9000/users/logout")
    if (res.status === 200 || res.status === 204) {
      localStorage.clear("token")
      localStorage.clear("refresh_token")
      router.push("/users/login")
    }
  }
  return (
    <div className="flex">
    <Sidebar setPage={setPage}/>
    <div className="flex flex-col h-screen flex-grow space-y-2 overflow-y-scroll">
      <Headbar handleLogout={handleLogout}/>
      {getCurrentPage()}
    </div>
    </div>
  );
}

export default Home