import {
  Type,
  Hash,
  ListFilter,
  CheckSquare,
  Check,
  FileText,
  Calendar,
  AlignLeft
} from "lucide-react";

export default function Sidebar() {
  const formElements = [
    { label: "Text Input", icon: Type },
    { label: "Number Input", icon: Hash },
    { label: "Dropdown", icon: ListFilter },
    { label: "Checkbox", icon: CheckSquare },
    { label: "Radio Group", icon: Check },
    { label: "File Upload", icon: FileText },
    { label: "Date Picker", icon: Calendar },
    { label: "Section Title", icon: AlignLeft }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
      <p className="mb-4 text-gray-500">Drag and drop elements onto the canvas</p>
      <ul className="space-y-2">
        {formElements.map((el, index) => (
          <li
            key={index}
            className="cursor-pointer p-2.5 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 flex items-center gap-3"
          >
            <el.icon className="w-4 h-4 text-gray-600" />
            <span>{el.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
