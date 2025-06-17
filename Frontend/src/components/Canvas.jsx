import { useState } from "react";

export default function Canvas() {
  const [elements, setElements] = useState([]);

  return (
    <div className="w-full h-full bg-gray-100 p-6 overflow-auto">
      <div className="bg-white rounded-lg p-6 h-28 max-w-3xl mx-auto">
        {elements.length === 0 ? (
          <p className="w-full text-xl font-semibold border border-gray-200 rounded px-7 py-2 ">New Form</p>
        ) : (
          <div className="space-y-4">
            {elements.map((el, index) => (
              <div
                key={index}
                className="p-2 border rounded bg-white shadow-sm"
              >
                {el.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
