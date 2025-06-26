import { useDroppable } from '@dnd-kit/core';
import renderField from '../../Functions/RenderElements';
import { Trash2, Grip  } from 'lucide-react';
import { useState, useEffect } from 'react';


export default function Canvas({ elements ,handleDelete}) {
 
  const { setNodeRef } = useDroppable({
    id: 'canvas-dropzone',
  });
  const [selectedId, setSelectedId] = useState(null);
  
  useEffect(() =>
  {
    console.log(selectedId)
  },[selectedId])

  return (
    <div ref={setNodeRef} className="w-full h-full bg-gray-100 p-6 overflow-auto">
      <div className="bg-white rounded-lg p-6 min-h-[100px] max-w-3xl mx-auto">
        {elements.length === 0 ? (
          <p className="text-xl font-semibold text-gray-400">Drop form elements here</p>
        ) : (
          <div className="space-y-4">
            {elements.map((el) => (
              <div
              key={el.id}
              onClick={() => setSelectedId(el.id)}
              className={`group p-2 border rounded bg-white shadow-sm transition-all duration-200 ${
                selectedId === el.id ? 'border-blue-500 ring-2 ring-blue-300' : ''
              }`}
            >
                <div className="flex items-center justify-between gap-2">
                  <Grip className="h-5 cursor-grab active:cursor-grabbing opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 cursor-pointer text-gray-400 mt-1" />
                  <div className="flex-1 pointer-events-none">{renderField(el)}</div>
                  <Trash2
                    className="h-5 cursor-move opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 cursor-pointer text-gray-400 mt-1"
                    onClick={() => handleDelete(el.id)}
                  />
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}