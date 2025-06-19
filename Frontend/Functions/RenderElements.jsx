export default function renderField(field) {
    switch (field.type) {
      case "text":
        return (
          <>
            <input type="text" placeholder={"Enter text"} className="border rounded px-3 py-2 w-full" />
          </>
        );
      case "number":
        return (
          <>
            <input type="number" placeholder={"Enter number"} className="border rounded px-3 py-2 w-full" />
          </>
        );
      case "select":
        return (
          <>
            <select className="border rounded px-3 py-2 w-full" defaultValue="" >
              <option value="" disabled hidden>
                Select an option
              </option>    
            </select>
          </>
        );
      case "checkbox":
        return (
          <>
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" />
              <span>{field.label}</span>
            </label>
            </>
        );
      case "radio":
        return (
          <>
            <label className="inline-flex items-center space-x-2">
              <input type="radio" />
              <span>{field.label}</span>
            </label>
          </>
        );
      case "file":
        return (
          <>
            <input type="file" className="w-full" /> 
          </>
        );
      case "date":
        return (
          <>
            <input type="date" className="border rounded px-3 py-2 w-full" />
          </>
        );
      case "section":
        return (
          <>
            <h3 className="text-lg font-bold">{field.label}</h3>
          </>
        );
      default:
        return (
        <> 
          <div className="text-gray-400 italic">Unknown field</div>
        </>
      );
    }
  }
  