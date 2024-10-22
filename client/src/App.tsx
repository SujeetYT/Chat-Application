import React from 'react';
import './App.css'
import { useSocket } from './hooks/useSocket'

function App() {
  const { sendMessage, messages } = useSocket();
  const messageInputRef = React.useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (messageInputRef.current) {
      const message = messageInputRef.current.value;
      if (!message) return;
      // console.log('Sending message', message);
      sendMessage(message);
      messageInputRef.current.value = '';
    }
  }

  console.log("Messages", messages);

  return (
    <div>
      <div className="">
        <h1>Chat Application</h1>
      </div>
      <div className="">
        <input 
          type="text" 
          ref={messageInputRef}
          placeholder='Message...'
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className='w-3/4 p-3 border rounded-lg outline-none'
        />
        <button 
          type='button'
          onClick={handleSendMessage}
          className='h-12 w-28 p-3 rounded-lg bg-blue-500 text-white'
        >Send</button>
      </div>
      <div>
        {
          messages.map((message, index) => (
            <div key={index} className='p-3 border rounded-lg my-2'>
              {message}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App
