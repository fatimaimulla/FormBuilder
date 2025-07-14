import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function LogicPanel({ elements, setElements }) {
  const [rules, setRules] = useState([]);

  const handleAddRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: Date.now(),
        whenFieldId: '',
        operator: 'equals',
        value: '',
        action: 'show'
      }
    ]);
  };

  const handleRemoveRule = (id) => {
    setRules((prev) => prev.filter(rule => rule.id !== id));
  };

  const handleRuleChange = (id, key, value) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === id ? { ...rule, [key]: value } : rule
      )
    );
  };

  const hasEnoughFields = elements.length > 1;

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
            <div className="absolute right-3 top-3 cursor-pointer" onClick={() => handleRemoveRule(rule.id)}>
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-black" />
            </div>

            <h3 className="font-semibold text-sm">Rule {index + 1}</h3>

            <div>
              <label className="block text-sm mb-1">When field</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={rule.whenFieldId}
                onChange={(e) => handleRuleChange(rule.id, 'whenFieldId', e.target.value)}
              >
                <option value="">Select field</option>
                {elements.map(el => (
                  <option key={el.id} value={el.id}>{el.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Operator</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={rule.operator}
                onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value)}
              >
                <option value="equals">Equals</option>
                <option value="not-equals">Not equals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Value</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={rule.value}
                onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
              />
            </div>

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
