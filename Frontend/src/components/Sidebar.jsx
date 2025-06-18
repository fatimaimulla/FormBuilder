// Sidebar.jsx
import {
  Type, Hash, ListFilter, CheckSquare,
  Check, FileText, Calendar, AlignLeft
} from "lucide-react";
import { useDraggable } from '@dnd-kit/core';

const DraggableItem = ({ id, label, Icon, type }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { type, label,Icon},
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-pointer p-2.5 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 flex items-center gap-3"
    >
      <Icon className="w-4 h-4 text-gray-600" />
      <span>{label}</span>
    </li>
  );
};

export default function Sidebar() {
  const formElements = [
    { label: "Text Input", icon: Type, type: "text" },
    { label: "Number Input", icon: Hash, type: "number" },
    { label: "Dropdown", icon: ListFilter, type: "select" },
    { label: "Checkbox", icon: CheckSquare, type: "checkbox" },
    { label: "Radio Group", icon: Check, type: "radio" },
    { label: "File Upload", icon: FileText, type: "file" },
    { label: "Date Picker", icon: Calendar, type: "date" },
    { label: "Section Title", icon: AlignLeft, type: "section" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
      <p className="mb-4 text-gray-500">Drag and drop elements onto the canvas</p>
      <ul className="space-y-2">
        {formElements.map((el, index) => (
          <DraggableItem
            key={index}
            id={`draggable-${index}`}
            label={el.label}
            type={el.type}
            Icon={el.icon}
          />
        ))}
      </ul>
    </div>
  );
}
