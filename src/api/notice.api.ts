import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { Notice, NoticeInput, NoticePage } from "../type/notice.type";
type ApiResponse<T>={success:boolean;message:string;data:T};

export const useNotices=(page=0)=>useQuery({queryKey:["notices",page],queryFn:async()=>{
  const {data}=await apiClient.get<ApiResponse<NoticePage>>("/api/notices",{params:{page,size:10}}); return data.data;
}});
export const useNotice=(id?:number)=>useQuery({queryKey:["notice",id],queryFn:async()=>{
  const {data}=await apiClient.get<ApiResponse<Notice>>(`/api/notices/${id}`); return data.data;
},enabled:Number.isFinite(id)});
export const useSaveNotice=()=>{const qc=useQueryClient();return useMutation({mutationFn:async({id,input}:{id?:number;input:NoticeInput})=>{
  const {data}=id?await apiClient.patch<ApiResponse<Notice>>(`/api/admin/notices/${id}`,input):await apiClient.post<ApiResponse<Notice>>("/api/admin/notices",input); return data;
},onSuccess:async()=>{await qc.invalidateQueries({queryKey:["notices"]});}})};
export const useDeleteNotice=()=>{const qc=useQueryClient();return useMutation({mutationFn:async(id:number)=>apiClient.delete(`/api/admin/notices/${id}`),onSuccess:async()=>qc.invalidateQueries({queryKey:["notices"]})})};
export const uploadNoticeImage=async(file:File)=>{const form=new FormData();form.append("file",file);const {data}=await apiClient.post<ApiResponse<{url:string}>>("/api/admin/notices/images",form);return data.data.url;};
