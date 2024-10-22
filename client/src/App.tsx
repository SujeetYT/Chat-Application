import './App.css'
import Navbar from './components/custom/Navbar';
import Sidebar from './components/custom/Sidebar';
import ChatArea from './components/custom/ChatArea';

function App() {
  return (
    <div
      className='flex'
    >
      <Sidebar />
      <div className='w-full'>
        <Navbar />
        <ChatArea />
      </div>
    </div>
  )
}

export default App
