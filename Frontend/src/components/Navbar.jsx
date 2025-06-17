import { Undo } from 'lucide-react';
import { Redo } from 'lucide-react';
import { Download } from 'lucide-react';
import { Upload } from 'lucide-react';

export default function CustomNavbar() {
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
        <button className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded border border-gray-300">
          <Upload className='w-4 h-4'/>Import
        </button>
        <button className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded">
          <Download className='w-4 h-4'/>Export
        </button>
      </div>
    </header>
  );
}
