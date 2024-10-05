import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppStore } from '@/Store'
import { HOST, LOGOUT_ROUTE } from '@/Utils/Constant';
import React from 'react'
import { MdOutlineEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from '@/lib/api_client';
import { toast } from 'sonner';
import { getColor } from '@/lib/utils';

const ProfileInfo = () => {
    const {userInfo,setUserInfo} = useAppStore();
    const navigate = useNavigate();
    const logout=async()=>{
        try {
            const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});
            if(response.status === 200){
                navigate('/auth');
                setUserInfo(null);
            }
            toast.success(response.data.message);
        } catch (error) {
            if(error.response && error.response.data){
                toast.error(error.response.data.message || "An error occured during logout");
            }else {
                toast.error("An unexpected error occurred.");
              }
        }
    };
  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
        <div className="flex gap-3 items-center justify-center">
            <div className='w-12 h-12 relative'> 
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {userInfo.image ? (
                <AvatarImage
                  src={`${HOST}/${userInfo.image}`}
                  alt="Profile image"
                  className="object-contain w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    userInfo.color
                  )}`}
                >
                  {" "}
                  {userInfo.firstName
                    ? userInfo.firstName.split("").shift()
                    : userInfo.email.split("").shift()}{" "}
                </div>
              )}
            </Avatar>
            </div>
            <div>
                {
                    userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                }
            </div>
        </div>
        <div className="flex gap-5">
        <TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        <MdOutlineEdit className='text-purple-500 text-xl font-medium' onClick={()=>navigate('/profile')} />
    </TooltipTrigger>
    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
      Edit Profile
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
        <IoPowerSharp className='text-red-500 text-xl font-medium' onClick={logout} />
    </TooltipTrigger>
    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
      Logout
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

        </div>
    </div>
  )
}

export default ProfileInfo