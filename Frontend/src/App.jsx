import './App.css'
import CustomNavbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import FieldConfigPanel from './components/FieldConfigPanel'

function App() {
  
  return (
    <>
      <div className="h-screen flex flex-col">
      <CustomNavbar />
      <div className="flex flex-col md:flex-row flex-1 overflow-auto">
        <div className="md:w-1/5 w-full bg-white p-4 rounded border">
          <Sidebar />
        </div>
        <div className="md:w-3/5 w-full bg-white p-4 rounded border">
          <Canvas />
        </div>
        <div className="md:w-1/5 w-full bg-white p-4 rounded border">
          <FieldConfigPanel />
        </div>
      </div>
    </div>
    </>
  )
}

export default App
