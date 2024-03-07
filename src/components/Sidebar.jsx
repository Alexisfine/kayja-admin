import { Aperture, Box, Handshake, HelpCircle, MessageCircle, Newspaper, Notebook, Timer, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import KayjaLogo from "@/../images/kayja.png"

const Sidebar = ({setPage}) => {
    return (
      <aside className="w-64" aria-label="Sidebar">
        <div className="h-screen overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
            <Image
              className="mx-auto h-12 w-auto mb-3"
              src={KayjaLogo} 
              alt="kayjaopt"
            />
          <ul className="space-y-2">
            <li>
              <div href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('products')}>
                <Aperture/>
                <span className="ml-3">产品管理</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('cases')}>
                <Box/>
                <span className="ml-3">案例管理</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('partners')}>
                <Handshake/>
                <span className="ml-3">合作伙伴管理</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('news')}>
                <Newspaper/>
                <span className="ml-3">新闻管理</span>
              </div>
            </li>
            <li>
              <div  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('jobs')}>
                <Notebook/>
                <span className="ml-3">招聘管理</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('faq')}>
                <HelpCircle/>
                <span className="ml-3">常见问题管理</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('timeline')}>
                <Timer/>
                <span className="ml-3">公司时间线管理</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('honor')}>
                <Trophy/>
                <span className="ml-3">公司荣誉管理</span>
              </div>
            </li>
            <li>
              <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setPage('message')}>
                <MessageCircle/>
                <span className="ml-3">网站留言管理</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;