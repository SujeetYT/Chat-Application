import React, { useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import env from "../constants/environments";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextInterface {
  sendMessage: (msg: string) => any;
  messages: string[];
}

export const SocketContext = React.createContext<SocketContextInterface | null>(null);


export const SocketProvider: React.FC<SocketProviderProps> = ({children})=>{
  const [socket, setSocket] = React.useState<Socket>();
  const [messages, setMessages] = React.useState<string[]>([]);
  const sendMessage: SocketContextInterface["sendMessage"] = useCallback((msg)=>{
    console.log("Sending message", msg);
    if(socket){
      socket.emit("event:message", {message: msg});
    }
  }, [socket]);

  const recieveMessage = useCallback((msg: { message: string }) => {
    // console.log("Message from server", msg);
    const message = msg.message;
    // console.log("Actual message", message);
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(()=>{    
    const _socket = io(env.SERVER_URL);
    setSocket(_socket);
    _socket.on("event:message", recieveMessage);

    return ()=>{
      setSocket(undefined);
      _socket.off("event:message", recieveMessage);
      _socket.disconnect();
    }
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  )
}