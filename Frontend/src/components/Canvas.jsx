import { useDroppable } from '@dnd-kit/core';
import renderField from '../../Functions/RenderElements';
import { Trash2 } from 'lucide-react';
export default function Canvas({ elements ,handleDelete}) {
  const { setNodeRef } = useDroppable({
    id: 'canvas-dropzone',
  });

  const withLabelAboveInput = (type) => {
    return ["text", "number", "select", "file", "date"].includes(type);
  };

  return (
    <div ref={setNodeRef} className="w-full h-full bg-gray-100 p-6 overflow-auto">
      <div className="bg-white rounded-lg p-6 min-h-[100px] max-w-3xl mx-auto">
        {elements.length === 0 ? (
          <p className="text-xl font-semibold text-gray-400">Drop form elements here</p>
        ) : (
          <div className="space-y-4">
            {elements.map((el) => (
              <div key={el.id} className="group p-2 border rounded bg-white shadow-sm space-y-1">
                {withLabelAboveInput(el.type) ? (
                  <>
                    {/* Label */}
                    <label className="block font-medium text-sm px-2 text-gray-700">
                      {el.label}
                    </label>

                    {/* Input + Delete */}
                    <div className="group flex items-center justify-between gap-2 p-2">
                      <div className="flex-1">
                        {renderField({ ...el, label: "" })} {/* No duplicate label */}
                      </div>
                      <Trash2
                        className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 cursor-pointer text-gray-400"
                        onClick={() => handleDelete(el.id)}
                      />
                    </div>
                  </>
                ) : (
                  // For checkbox, radio, section
                  <div className="flex justify-between items-center p-2">
                    <div>{renderField(el)}</div>
                    <Trash2
                      className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 cursor-pointer text-gray-400"
                      onClick={() => handleDelete(el.id)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
