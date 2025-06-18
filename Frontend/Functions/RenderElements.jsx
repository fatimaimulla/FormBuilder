export default function renderField(field) {
    switch (field.type) {
      case "text":
        return(
        <>
          
          {field.label}
          <input type="text" placeholder={field.label} className="border rounded px-3 py-2 w-full" />
        </>);
      case "number":
        return (<>
          {field.label}
          
          <input type="number" placeholder={field.label} className="border rounded px-3 py-2 w-full" /></>);
      case "select":
        return (
          <>
           {field.label} 
          <select className="border rounded px-3 py-2 w-full" placeholder="hello">
           
            <option></option>
            </select>
            </>
        );
      case "checkbox":
        return (
          <>
            {field.label}
          <label className="inline-flex items-center space-x-2">
            <input type="checkbox" />
            <span>{field.label}</span>
            </label>
            </>
        );
      case "radio":
        return (
          <>
            {field.label}
          <label className="inline-flex items-center space-x-2">
            <input type="radio" />
            <span>{field.label}</span>
            </label>
            </>
        );
      case "file":
            
            
        return <>
          {field.label}
          <input type="file" className="w-full" /> </>;
      case "date":
           
        return <>
          {field.label}
          <input type="date" className="border rounded px-3 py-2 w-full" /></>;
      case "section":
        return <>
          {field.label}
          <h3 className="text-lg font-bold">{field.label}</h3></>;
      default:
        return <>
          {field.label}
          <div className="text-gray-400 italic">Unknown field</div></>;
    }
  }
  