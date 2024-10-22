import React, { useEffect } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import PersonDetail from "./PersonDetail";
import { useSocket } from "@/hooks/useSocket";

const Sidebar = () => {
  const [personalName, setPersonalName] = React.useState<string>("");

  // exclude personal name from the list
  const [allNames, setAllNames] = React.useState<string[]>([]);
  const { sendTo, setSendTo, socket, activeSockets } = useSocket();
  
  console.log("Active sockets", activeSockets);
  
  const handleSendTo = (name: string) => {
    if (setSendTo) {
      setSendTo(name);
    }
  }
  
  useEffect(()=>{
    // get socketd of socket from socket.io
    setPersonalName(socket?.id || "");

    setAllNames(activeSockets.filter((name)=> name !== socket?.id));
  }, [activeSockets]);

  return (
    <div
      className="w-[350px] h-screen bg-gray-800 text-white p-6 border-r"  
    >
      <PersonDetail name={personalName} />
      <hr />
      <div
        className="text-lg font-bold my-6"
      >Active People</div>
      <ScrollArea>
        <ScrollBar orientation="vertical"/>
        {
          allNames.map((name, index) => (
            <div
              key={index}
              onClick={()=>handleSendTo(name)}
              className={`cursor-pointer hover:bg-gray-700 p-2 rounded-lg ${sendTo === name ? "bg-gray-700" : ""}`}
            >
              <PersonDetail name={name}/>
            </div>
          ))
        }
      </ScrollArea>
    </div>
  );
};

export default Sidebar;