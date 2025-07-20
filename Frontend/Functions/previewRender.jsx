import React from 'react';

// 🧠 Logic evaluator for visibility based on formData and rules
const evaluateVisibility = (element, formData, elements) => {
  if (!element || !element.visibilityRules || element.visibilityRules.length === 0) return true;

  return element.visibilityRules.every(rule => {
    const targetValue = formData[rule.whenFieldId];
    const expectedValue = rule.value;

    switch (rule.operator) {
      case 'equals':
        return rule.action === 'show' ? targetValue === expectedValue : targetValue !== expectedValue;
      case 'not_equals':
        return rule.action === 'show' ? targetValue !== expectedValue : targetValue === expectedValue;
        
      default:
            return true;
    
    }
  });
};


// ✅ Clean preview renderer component
const PreviewRenderer = ({ elements, formData, onChange }) => {
  return (
    <div className="space-y-4">
      {elements.map((el) => {
        if (!el) return null;
        const isVisible = evaluateVisibility(el, formData, elements);
        if (!isVisible) return null;

        const handleChange = (e) => {
          const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
          onChange(el.id, value);
        };

        switch (el.type) {
          case 'text':
            return (
              <input
                key={el.id}
                type="text"
                value={formData[el.id] || ''}
                placeholder={el.placeholder}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            );
          case 'number':
            return (
              <input
                key={el.id}
                type="number"
                value={formData[el.id] || ''}
                placeholder={el.placeholder}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            );
          case 'select':
            return (
              <select
                key={el.id}
                value={formData[el.id] || ''}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select</option>
                {el.options?.map((opt, i) => (
                  <option key={i} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            );
          case 'checkbox':
            return (
              <label key={el.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData[el.id] || false}
                  onChange={handleChange}
                />
                {el.label}
              </label>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default PreviewRenderer;
