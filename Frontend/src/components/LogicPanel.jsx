import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function LogicPanel({ elements, setElements, selectedElementId }) {
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  const [showValue, setShowValue] = useState(null);
  const [rules, setRules] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("Equals");

  useEffect(() => {
    setShowValue(!["is_empty", "is_not_empty"].includes(selectedOperator));
    console.log(selectedOperator);
  }, [selectedOperator]);
  
  
  useEffect(() => {
    // Load rules from selected element when it changes
    if (selectedElement) {
      setRules(selectedElement.visibilityRules || []);
    }
  }, [selectedElementId]);

  const updateElementRules = (updatedRules) => {
    setElements(prev =>
      prev.map(el =>
        el.id === selectedElementId
          ? { ...el, visibilityRules: updatedRules }
          : el
      )
    );
  };

  const handleAddRule = () => {
    const newRule = {
      id: Date.now(),
      whenFieldId: '',
      operator: 'equals',
      value: '',
      action: 'show'
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    updateElementRules(updatedRules);
  };

  const handleRemoveRule = (id) => {
    const updatedRules = rules.filter(rule => rule.id !== id);
    setRules(updatedRules);
    updateElementRules(updatedRules);
  };

  const handleRuleChange = (id, key, value) => {
    const updatedRules = rules.map(rule =>
      rule.id === id ? { ...rule, [key]: value } : rule
    );
    setSelectedOperator(value);
    setRules(updatedRules);
    updateElementRules(updatedRules);
    //console.log(value);
  };

  const hasEnoughFields = elements.length > 1;

  const otherFields = elements.filter(el => el.id !== selectedElementId);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-5">Conditional Logic</h2>
      <p className="text-gray-500">
        Define when this field should be visible based on other fields' values.
      </p>

      {!hasEnoughFields && (
        <div className="bg-gray-100 rounded border p-3 text-sm text-gray-500">
          Add more fields to your form to create conditional logic rules.
        </div>
      )}

      {hasEnoughFields && rules.length === 0 && (
        <div className="bg-gray-100 rounded border p-3 text-sm text-gray-500">
          No conditional logic rules defined yet.
        </div>
      )}

      {hasEnoughFields &&
        rules.map((rule, index) => (
          <div
            key={rule.id}
            className="border rounded-lg p-4 space-y-3 bg-gray-50 relative"
          >
            <div
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => handleRemoveRule(rule.id)}
            >
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-black" />
            </div>

            <h3 className="font-semibold text-sm">Rule {index + 1}</h3>

            {/* When Field */}
            <div>
              <label className="block text-sm mb-1">When field</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={rule.whenFieldId}
                onChange={(e) => handleRuleChange(rule.id, 'whenFieldId', e.target.value)}
              >
                <option value="">Select field</option>
                {otherFields.map(el => (
                  <option key={el.id} value={el.id}>{el.label}</option>
                ))}
              </select>
            </div>

            {/* Operator */}
            <div>
              <label className="block text-sm mb-1">Operator</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={selectedOperator}
                onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value)}
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Not equals</option>
                <option value="greater_than">Greater than</option>
                <option value="less_than">Less than</option>
                <option value="contains">Contains</option>
                <option value="is_empty">Is empty</option>
                <option value="is_not_empty">Is not empty</option>
              </select>
            </div>

            {/* Value */}
            {showValue&&(<div>
              <label className="block text-sm mb-1">Value</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={rule.value}
                onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
              />
            </div>)}
            

            {/* Action */}
            
            <div>
              <label className="block text-sm mb-1">Action</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={rule.action}
                onChange={(e) => handleRuleChange(rule.id, 'action', e.target.value)}
              >
                <option value="show">Show this field</option>
                <option value="hide">Hide this field</option>
              </select>
            </div>
          </div>
        ))}

      {hasEnoughFields && (
        <button
          onClick={handleAddRule}
          className="w-full border border-gray-300 text-sm text-black py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <Plus className="w-4 h-4 text-black font-semibold" />
          <span className="font-semibold">Add Rule</span>
        </button>
      )}
    </div>
  );
}
