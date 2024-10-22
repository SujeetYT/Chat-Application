import React, { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import env from "../constants/environments";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SendMessageInterface{
  msg: string, 
  to:string
}

interface SocketContextInterface {
  sendMessage: ({msg, to}:SendMessageInterface) => any;
  messages: MessageInterface[];
  activeSockets: string[];
  socket?: Socket;
  setSendTo?: React.Dispatch<React.SetStateAction<string | null>>;
  sendTo?: string | null;
}

export interface MessageInterface {
  message: string;
  socketId: string;
}

export const SocketContext = React.createContext<SocketContextInterface | null>(null);


export const SocketProvider: React.FC<SocketProviderProps> = ({children})=>{
  const [socket, setSocket] = React.useState<Socket>();
  const [messages, setMessages] = React.useState<MessageInterface[]>([]);
  const [activeSockets, setActiveSockets] = React.useState<string[]>([]);
  const [sendTo, setSendTo] = React.useState<string | null>(null);


  const sendMessage: SocketContextInterface["sendMessage"] = useCallback(({msg, to}:SendMessageInterface)=>{
    console.log("Sending message", msg);
    if(socket){
      socket.emit("event:message", {message: msg, to: to});
    }
  }, [socket]);

  const recieveMessage = useCallback((msg: MessageInterface) => {
    // console.log("Recieved message", msg);
    const message:MessageInterface = msg;
    setMessages((prev) => [...prev, message]);
  }, []);
  console.log("Messages", messages);
  
  const getAllActiveSockets = useCallback((sockets: string[])=>{
    // console.log("All active sockets", sockets);
    setActiveSockets(sockets);
  }, []);

  useEffect(()=>{   
    // making socket connection to the server 
    if(env.SERVER_URL === ""){
      console.error("Server URL missing!");
      return;
    }
    const _socket = io(env.SERVER_URL);
    setSocket(_socket);
    _socket.on("event:message", recieveMessage);
    _socket.on("event:sockets", getAllActiveSockets);

    return ()=>{
      setSocket(undefined);
      _socket.off("event:message", recieveMessage);
      _socket.disconnect();
    }
  }, []);

  return (
    <SocketContext.Provider value={{ sendTo, setSendTo, socket, sendMessage, messages, activeSockets }}>
      {children}
    </SocketContext.Provider>
  )
}