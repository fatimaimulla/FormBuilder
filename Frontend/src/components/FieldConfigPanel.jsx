import TextConfig from "./FieldConfigPanel/TextConfig";
import NumberConfig from "./FieldConfigPanel/NumberConfig";
import SelectConfig from "./FieldConfigPanel/SelectConfig";
import CheckboxConfig from "./FieldConfigPanel/CheckboxConfig";
import RadioConfig from "./FieldConfigPanel/RadioConfig";
import FileConfig from "./FieldConfigPanel/FileConfig";
import DateConfig from "./FieldConfigPanel/DateConfig";
import SectionConfig from "./FieldConfigPanel/SectionConfig";

export default function FieldConfigPanel({ elements, selectedElementId, setElements }) {
  const selectedElement = elements.find(el => el.id === selectedElementId);

  const updateField = (key, value) => {
    const updated = elements.map(el =>
      el.id === selectedElementId ? { ...el, [key]: value } : el
    );
    setElements(updated);
  };

  if(elements.length===0){
    return <div className="text-gray-400 italic">No elements in the Form. Please Add one.</div>;
  }
  else if (!selectedElement ) {
    return <div className="text-gray-400 italic">Click a field to configure it</div>;
  }

  const props = { field: selectedElement, updateField };

  // 🔁 Component router
  let ConfigComponent;
  switch (selectedElement.type) {
    case "text":
      ConfigComponent = TextConfig;
      break;
    case "number":
      ConfigComponent = NumberConfig;
      break;
    case "select":
      ConfigComponent = SelectConfig;
      break;
    case "checkbox":
      ConfigComponent = CheckboxConfig;
      break;
    case "radio":
      ConfigComponent = RadioConfig;
      break;
    case "file":
      ConfigComponent = FileConfig;
      break;
    case "date":
      ConfigComponent = DateConfig;
      break;
    case "section":
      ConfigComponent = SectionConfig;
      break;
    default:
      return <div className="text-gray-400 italic">Unsupported field type</div>;
  }

  return (
    <div className="space-y-4">
      {/* Common Heading */}
      <h2 className="text-lg font-semibold mb-5">Field Configuration</h2>

      <div>
        <label className="block text-md font-medium mb-1">Label</label>
        <input
          type="text"
          value={selectedElement.label || ""}
          onChange={(e) => updateField("label", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      
      <ConfigComponent {...props} />
    </div>
  );
}
