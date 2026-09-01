export type Notice = { noticeId:number; title:string; content:string; pinned:boolean; createdAt:string; updatedAt:string };
export type NoticePage = { content:Notice[]; totalElements:number; totalPages:number; number:number; size:number; first:boolean; last:boolean };
export type NoticeInput = { title:string; content:string; pinned:boolean };
