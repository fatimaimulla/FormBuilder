import './App.css'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import CustomNavbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import FieldConfigPanel from './components/FieldConfigPanel'
import FormPreview from './components/FormPreview'
import LogicPanel from './components/LogicPanel'
import ImportModal from './components/ImportModal'
import PublishModal from './components/PublishModal'
import { useEffect, useState } from 'react'

function App() {
  const [elements, setElements] = useState([
    {
      id: 1753076598430,
      type: "section",
      label: "New Form",
      visibilityRules: []
    }
  ]);
  const [activeDragItem, setActiveDragItem] = useState(null)
  const [selectedElementId, setSelectedElementId] = useState(null)
  const [mode, setMode] = useState("config")
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  function handleDragStart(event) {
    setActiveDragItem(event.active.data.current)
  }

  useEffect(() => {
    console.log(elements)
  }, [elements])

  const handleDelete = (idToDelete) => {
    setElements(prev => prev.filter(el => el.id !== idToDelete))
  }

  function handleDragEnd(event) {
    const { over, active } = event
    if (over && over.id === 'canvas-dropzone') {
      const type = active.data.current?.type
      const label = active.data.current?.label || "New Field"
      const firstWord = label.toLowerCase().split(" ")[0]

      const newField = {
        id: Date.now(),
        type,
        label,
        placeholder: ["text", "number", "date"].includes(type)
          ? "Enter " + firstWord + "..."
          : undefined,
        options: ["select", "radio"].includes(type)
          ? [{ label: "Option 1", value: "option-1" }]
          : undefined,
        visibilityRules: [],
      }

      setElements((prev) => [...prev, newField])
      setSelectedElementId(newField.id)
    }
    setActiveDragItem(null)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col overflow-hidden">
        <CustomNavbar
          mode={mode}
          setMode={setMode}
          elements={elements}
          setElements={setElements}
          onImportClick={() => setShowImportModal(true)}
          onPublishClick={() => setShowPublishModal(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-[20%] bg-white border px-6 py-4 overflow-hidden">
            <Sidebar />
          </div>

          {/* Canvas */}
          <div className={`transition-all duration-300 ${elements.length > 0 ? 'w-[57%]' : 'flex-grow'} border bg-white overflow-y-auto`}>
            <Canvas elements={elements} handleDelete={handleDelete} onElementSelect={setSelectedElementId} />
          </div>

          {/* Config Panel */}
          {elements.length > 0 && (
            <div className="w-[23%] bg-white p-4 overflow-y-auto border">
              {mode === 'config' && (
                <FieldConfigPanel
                  elements={elements}
                  selectedElementId={selectedElementId}
                  setElements={setElements}
                />
              )}
              {mode === 'logic' && (
                <LogicPanel
                  elements={elements}
                  setElements={setElements}
                  selectedElementId={selectedElementId}
                />
              )}
              {mode === 'preview' && (
                <FormPreview elements={elements} />
              )}
            </div>
          )}
        </div>
      </div>

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={(importedFields) => {
            setElements(importedFields)
            setSelectedElementId(null)
          }}
        />
      )}

      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          elements={elements}
        />
      )}

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
