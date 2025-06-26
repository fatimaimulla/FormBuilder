export default function renderField(field, canvas = true)
{
  
  const commonInputClass = "border rounded px-4 py-2 w-full bg-white text-sm";
  
  const withLabelWrapper = (element) => (
    <div className="flex flex-col gap-3">
      <label className="block font-semibold text-sm text-gray-700">{field.label}</label> 
      {element}
    
    </div>
  );

  switch (field.type) {
    case "text":
      return withLabelWrapper(<input type="text" placeholder={field.placeholder || "Enter text..."} className={commonInputClass} disabled={canvas} />);
    case "number":
      return withLabelWrapper(<input type="number" placeholder="Enter number..." className={commonInputClass} disabled={canvas}/>);
    case "select":
      return withLabelWrapper(
        <select className={commonInputClass} defaultValue="" disabled={canvas}>
          <option value="" disabled hidden>Select an option...</option>
        </select>
      );
    case "file":
      return withLabelWrapper(<input type="file" className="w-full" disabled={canvas}/>);
    case "date":
      return withLabelWrapper(<input type="date" className={commonInputClass} disabled={canvas}/>);
    case "checkbox":
      return (
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" disabled={canvas}/>
          <span>{" "+field.label}</span>
        </label>
      );
    case "radio":
      return (
        withLabelWrapper(
         
        <label className="inline-flex items-center space-x-2" >
          <input type="radio" disabled={canvas}/>
            <span>{ " option 1"}</span>
        </label>)
      );
    case "section":
      return <div className="">
        <h3 className="text-lg font-bold">{field.label}</h3>
        <p className="text-gray-500">{field.label}</p> 
      </div>;
    default:
      return <div className="text-gray-400 italic">Unknown field</div>;
  }
}