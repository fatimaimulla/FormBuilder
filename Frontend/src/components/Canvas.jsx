// Canvas.jsx
import { useDroppable } from '@dnd-kit/core';

export default function Canvas({ elements }) {
  const { setNodeRef } = useDroppable({
    id: 'canvas-dropzone',
  });

  return (
    <div ref={setNodeRef} className="w-full h-full bg-gray-100 p-6 overflow-auto">
      <div className="bg-white rounded-lg p-6 min-h-[100px] max-w-3xl mx-auto border-2 border-collapse border-gray-300">
        {elements.length === 0 ? (
          <p className="text-xl font-semibold text-gray-400">Drop form elements here</p>
        ) : (
          <div className="space-y-4">
            {elements.map((el, index) => (
              <div
                
                key={el.id}
                className="p-2 border rounded bg-white shadow-sm"
              >
                {el.label} ({el.type})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
