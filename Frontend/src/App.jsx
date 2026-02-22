import './App.css'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import CustomNavbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import axios from 'axios'
import { BACKEND_BASE_URL } from './lib/apiClient'
import Canvas from './components/Canvas'
import FieldConfigPanel from './components/FieldConfigPanel'
import FormPreview from './components/FormPreview'
import LogicPanel from './components/LogicPanel'
import ImportModal from './components/ImportModal'
import PublishModal from './components/PublishModal'
import { useEffect, useState } from 'react'
import { useAuth } from './auth/AuthContext'
import apiClient from './lib/apiClient'
import { useSearchParams } from 'react-router-dom'

function App()
{
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const editFormId = searchParams.get("form");
   useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await axios.get(BACKEND_BASE_URL);
        console.log('🎉 Backend is awake!');
      } catch (error) {
        console.error('❌ Failed to wake backend:', error);
      }
    };

    wakeUpServer();
  }, []);
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
  const [forceShowPanel, setForceShowPanel] = useState(false)
  const [initialLoadError, setInitialLoadError] = useState("")
  const [initialLoading, setInitialLoading] = useState(Boolean(editFormId))
  const [baselineSnapshot, setBaselineSnapshot] = useState(null)

  function handleDragStart(event) {
    setActiveDragItem(event.active.data.current)
  }
  useEffect(() => {
    const loadFormForEditing = async () => {
      if (!editFormId) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await apiClient.get(`/forms/${editFormId}/mine`);
        const fetched = res?.data?.data?.form?.config || [];
        if (Array.isArray(fetched) && fetched.length > 0) {
          setElements(fetched);
          setForceShowPanel(true);
        }
        setBaselineSnapshot(JSON.stringify(Array.isArray(fetched) ? fetched : []));
      } catch (error) {
        setInitialLoadError("Failed to load existing form for editing.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadFormForEditing();
  }, [editFormId])

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
      setForceShowPanel(true)
    }
    setActiveDragItem(null)
  }

  const isOnlySectionPresent = elements.length === 1 && elements[0].type === "section";
  const shouldShowPanel = !isOnlySectionPresent || forceShowPanel;
  const isEditMode = Boolean(editFormId);
  const hasUnsavedChanges = isEditMode
    ? baselineSnapshot !== null && JSON.stringify(elements) !== baselineSnapshot
    : true;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col overflow-hidden">
        <CustomNavbar
          mode={mode}
          setMode={setMode}
          elements={elements}
          setElements={setElements}
          user={user}
          onLogout={logout}
          onImportClick={() => setShowImportModal(true)}
          onPublishClick={() => setShowPublishModal(true)}
          showViewButtons={shouldShowPanel}
          publishLabel={isEditMode ? "Publish Edits" : "Publish"}
          publishDisabled={isEditMode && !hasUnsavedChanges}
        />

        <div className="flex flex-1 overflow-hidden">
          {initialLoading ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-600">
              Loading form...
            </div>
          ) : (
            <>
          {initialLoadError && (
            <div className="absolute top-24 right-6 z-40 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {initialLoadError}
            </div>
          )}
          {/* Sidebar */}
          <div className="w-[20%] bg-white border px-6 py-4 overflow-hidden">
            <Sidebar />
          </div>

          {/* Canvas */}
          <div className={`transition-all duration-300 ${shouldShowPanel ? 'w-[57%]' : 'flex-grow'} border bg-white overflow-y-auto`}>
            <Canvas
              elements={elements}
              handleDelete={handleDelete}
              onElementSelect={(id) => {
                setSelectedElementId(id);
                setForceShowPanel(true);
              }}
            />
          </div>

          {/* Config Panel */}
          {shouldShowPanel && (
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
            </>
          )}
        </div>
      </div>

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={(importedFields) => {
            setElements(importedFields)
            setSelectedElementId(null)
            setForceShowPanel(true)
          }}
        />
      )}

      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          elements={elements}
          formId={editFormId}
          onPublished={() => {
            if (isEditMode) {
              setBaselineSnapshot(JSON.stringify(elements));
            }
          }}
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
