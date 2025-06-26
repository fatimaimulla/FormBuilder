import './App.css'
import { DndContext , DragOverlay } from '@dnd-kit/core'
import CustomNavbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import FieldConfigPanel from './components/FieldConfigPanel'
import { useEffect, useState } from 'react'

function App() {
  const [elements, setElements] = useState([])
  const [activeDragItem, setActiveDragItem] = useState(null)
  const [selectedElementId, setSelectedElementId] = useState(null); // currently selected element

  function handleDragStart(event) {
    setActiveDragItem(event.active.data.current)
    //console.log(event.active.data.current)
  }

  useEffect(() =>
  {
    console.log(elements);
  },[elements])

  const handleDelete = (idToDelete) => {
    setElements(prev => prev.filter(el => el.id !== idToDelete));
    
  };
  
  function handleDragEnd(event) {
    const { over, active } = event
    if (over && over.id === 'canvas-dropzone') {
      const labelText = active.data.current?.label?.toLowerCase() || "value";
      const firstWord = labelText.split(" ")[0];
      const newField = {
        id: Date.now(),
        type: active.data.current?.type,
        label: active.data.current?.label || 'New Field',
        placeholder: ["text", "number", "date"].includes(active.data.current?.type)
          ? "Enter " + firstWord + "... "
          : undefined
      }
      setElements((prev) => [...prev, newField])
      setSelectedElementId(newField.id);
    }
    setActiveDragItem(null)
    //console.log(elements);
  }

  return (
    <DndContext onDragStart={ handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col">
        <CustomNavbar />
        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          <div className="px-6 md:w-1/5 w-full bg-white py-4 border">
            <Sidebar />
          </div>
          <div className="md:w-3/5 w-full bg-white border">
            <Canvas elements={elements} handleDelete={handleDelete} onElementSelect={setSelectedElementId}/>
          </div>
          {elements.length > 0 && (
            <div className="px-6 md:w-1/5 w-full bg-white p-4 border">
              <FieldConfigPanel elements={elements} selectedElementId={selectedElementId} setElements={setElements}/>
            </div>
          )}
        </div>
      </div>
      <DragOverlay>
        {activeDragItem ? (
          <div className="p-2 px-4 rounded border bg-white shadow-lg text-sm font-medium text-gray-800">
            {activeDragItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default App
