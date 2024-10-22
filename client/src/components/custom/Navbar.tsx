import React, { useEffect } from "react";
import PersonDetail from "./PersonDetail";
import { useSocket } from "@/hooks/useSocket";

const Navbar = () => {
  const [name, setName] = React.useState<string>("");
  const { sendTo } = useSocket();

  //set the name whenever localstorage changes
  useEffect(()=>{
    if(sendTo){
      setName(sendTo);
    }
  }, [sendTo]);

  return (
    <div
      className="w-[100%] h-[100px] bg-gray-800 text-white p-6 flex justify-between items-center"
    >
      <PersonDetail name={name} />
    </div>
  );
};

export default Navbar;