import { Undo, Redo, Download, Upload, Eye, Settings, WandSparkles } from 'lucide-react';

export default function CustomNavbar({ mode, setMode ,elements, setElements, onImportClick })
{
  let hasElements = elements.length > 0;
  
  const handleExport = () => {
  const formData = {
    fields: elements,
  };

  const jsonString = JSON.stringify(formData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "form-data.json";
  a.click();
  URL.revokeObjectURL(url);
};


  const handleImport = () =>
  {
    
  }
  return (
    <header className="bg-white text-black px-6 py-4 flex justify-between items-center shadow-md h-20">
      {/* Left: Project Name + Undo/Redo */}
      <div className="flex items-center space-x-5">
        <h1 className="text-2xl font-bold">Form Builder</h1>
        <div className='flex items-center space-x-3'>
          <button className="bg-white text-black px-2 py-2 rounded border border-gray-100">
            <Undo className='w-5 h-5 text-gray-400'/> 
          </button>
          <button className="bg-white text-black px-2 py-2 rounded border border-gray-100">
            <Redo className='w-5 h-5 text-gray-400'/>
          </button>
        </div>
      </div>

      {/* Right: Import/Export */}
      <div className="flex items-center space-x-5">
        {hasElements && (
          <div className='flex items-center space-x-0 h-10 bg-gray-100 py-1 px-1 rounded'>
            <button
              onClick={() => setMode('config')}
              className={`flex items-center gap-2 px-2 py-2 rounded h-8 ${
                mode === 'config' ? 'bg-white text-balck' : 'bg-gray-100 text-gray-600'
              }`}>
              <Settings className="w-4 h-4" /> Configure
            </button>

            <button
              onClick={() => setMode('logic')}
              className={`flex items-center gap-2 px-3 py-2 rounded h-8 ${
                mode === 'logic' ? 'bg-white text-balck' : 'bg-gray-100 text-gray-600'
              }`}>
              <WandSparkles className='w-4 h-4' /> Logic
            </button>

            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-3 py-2 rounded h-8 ${
                mode === 'preview' ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'
              }`}>
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
        )}

        <button className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded border border-gray-300" onClick={onImportClick}>
          <Upload className='w-4 h-4'/>Import
        </button>
        <button className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded" onClick={handleExport}>
          <Download className='w-4 h-4'/>Export
        </button>
      </div>
    </header>
  );
}
