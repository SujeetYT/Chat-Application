import { SocketContext } from "@/context/SocketProvider";
import { useContext } from "react";

export const useSocket = ()=>{
  
  const state = useContext(SocketContext);
  
  if(!state){
    throw new Error("useSocket must be used within a SocketProvider");
  }
  
  return state;
}