import { useSocket } from "@/hooks/useSocket";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";

const ChatArea = () => {
  const { sendTo, sendMessage, messages } = useSocket();
  const messageInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleSendMessage = () => {
    if (messageInputRef.current) {
      const message = messageInputRef.current.value;
      if (!message) return;

      // console.log('Sending message', message);
      if(sendTo === null){
        alert("Please select a person to send message");
      }else{
        sendMessage({msg: message, to: sendTo as string})
      }
      messageInputRef.current.value = '';
    }
  };
  return (
    <div
      className="relative h-[80vh] w-full flex flex-col"
    >
      <ScrollArea>
        {
          messages.map((msg, index) => (
            <div 
              className="p-2 my-2 bg-gray-200 rounded-lg"
              key={index}
            >
              {msg}
            </div>
          ))
        }
      </ScrollArea>
      <div
        className="w-full flex px-3 py-2 absolute bottom-0 gap-2"
      >
        <Input 
          placeholder="Type your message..."
          ref={messageInputRef}  
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button
          variant="outline"
          onClick={handleSendMessage}
        >Send</Button>
      </div>
    </div>
  );
};

export default ChatArea;