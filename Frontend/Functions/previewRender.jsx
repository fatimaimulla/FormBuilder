import React from "react";

const commonInputClass =
  "border rounded px-4 py-2 w-full bg-white text-sm";

const withLabelWrapper = (element, label, required) => (
  <div className="flex flex-col gap-3">
    <label className="block font-semibold text-sm text-gray-700">
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </label>
    {element}
  </div>
);

const evaluateVisibility = (element, formData, elements) => {
  if (!element || !element.visibilityRules || element.visibilityRules.length === 0) return true;

  return element.visibilityRules.every((rule) => {
    const targetValue = formData[rule.whenFieldId];
    const expectedValue = rule.value;

    switch (rule.operator) {
      case "equals":
        return rule.action === "show"
          ? targetValue === expectedValue
          : targetValue !== expectedValue;
      case "not_equals":
        return rule.action === "show"
          ? targetValue !== expectedValue
          : targetValue === expectedValue;
      case "greater_than":
        return rule.action === "show"
          ? parseFloat(targetValue) > parseFloat(expectedValue)
          : parseFloat(targetValue) <= parseFloat(expectedValue);
      case "less_than":
        return rule.action === "show"
          ? parseFloat(targetValue) < parseFloat(expectedValue)
          : parseFloat(targetValue) >= parseFloat(expectedValue);
      case "contains":
        return rule.action === "show"
          ? (targetValue || "").includes(expectedValue)
          : !(targetValue || "").includes(expectedValue);
      case "is_empty":
        return rule.action === "show"
          ? !targetValue || targetValue === ""
          : targetValue && targetValue !== "";
      case "is_not_empty":
        return rule.action === "show"
          ? targetValue && targetValue !== ""
          : !targetValue || targetValue === "";
      default:
        return true;
    }
  });
};

const PreviewRenderer = ({ elements, formData, onChange }) => {
  return (
    <div className="space-y-4">
      {elements.map((el) => {
        if (!el) return null;
        const isVisible = evaluateVisibility(el, formData, elements);
        if (!isVisible) return null;

        const handleChange = (e) => {
          const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
          onChange(el.id, value);
        };

        switch (el.type) {
          case "text":
            return withLabelWrapper(
              <input
                type="text"
                value={formData[el.id] || ""}
                placeholder={el.placeholder || "Enter text..."}
                onChange={handleChange}
                className={commonInputClass}
              />, el.label, el.required
            );
          case "number":
            return withLabelWrapper(
              <input
                type="number"
                value={formData[el.id] || ""}
                placeholder={el.placeholder || "Enter number..."}
                onChange={handleChange}
                className={commonInputClass}
              />, el.label, el.required
            );
          case "select":
            return withLabelWrapper(
              <select
                value={formData[el.id] || ""}
                onChange={handleChange}
                className={commonInputClass}
              >
                <option value="" disabled hidden>
                  Select an option...
                </option>
                {el.options?.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>, el.label, el.required
            );
          case "checkbox":
            return (
              <label key={el.id} className="inline-flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData[el.id] || false}
                  onChange={handleChange}
                />
                <span>
                  {el.label} {el.required && <span style={{ color: "red" }}>*</span>}
                </span>
              </label>
            );
          case "file":
            return withLabelWrapper(
              <input
                type="file"
                onChange={handleChange}
                className="w-full"
              />, el.label, el.required
            );
          case "date":
            return withLabelWrapper(
              <input
                type="date"
                value={formData[el.id] || ""}
                onChange={handleChange}
                className={commonInputClass}
              />, el.label, el.required
            );
          case "section":
            return (
              <div key={el.id}>
                <h3 className="text-lg font-bold">{el.label}</h3>
                {el.description && <p className="text-gray-500">{el.description}</p>}
              </div>
            );
        case "radio":
            return (
                <div key={el.id} className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-gray-700">
                    {el.label} {el.required && <span style={{ color: 'red' }}>*</span>}
                </label>
                {el.options?.map((opt, i) => (
                    <label key={i} className="inline-flex items-center gap-2">
                    <input
                        type="radio"
                        name={`radio-${el.id}`} // ensures grouped radios
                        value={opt.value}
                        checked={formData[el.id] === opt.value}
                        onChange={(e) => onChange(el.id, e.target.value)}
                    />
                    <span className="p-1">{opt.label}</span>
                    </label>
                ))}
                </div>
            );
        
          default:
            return <div key={el.id} className="text-gray-400 italic">Unknown field</div>;
        }
      })}
    </div>
  );
};

export default PreviewRenderer;
