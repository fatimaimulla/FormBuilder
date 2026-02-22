import { Download, Upload, Eye, Settings, WandSparkles, Share2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomNavbar({
  mode,
  setMode,
  elements,
  onImportClick,
  onPublishClick,
  showViewButtons,
  user,
  onLogout,
  publishLabel = "Publish",
  publishDisabled = false,
}) {
  const navigate = useNavigate();

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

  return (
    <header className="bg-white text-black px-6 py-4 flex justify-between items-center shadow-md h-20">
      {/* Left: Project Name */}
      <div className="flex items-center space-x-5">
        <h1 className="text-2xl font-bold">Form Builder</h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-5">
        {showViewButtons && (
          <div className='flex items-center space-x-0 h-10 bg-gray-100 py-1 px-1 rounded'>
            <button
              onClick={() => setMode('config')}
              className={`flex items-center gap-2 px-2 py-2 rounded h-8 ${mode === 'config' ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'}`}>
              <Settings className="w-4 h-4" /> Configure
            </button>

            <button
              onClick={() => setMode('logic')}
              className={`flex items-center gap-2 px-3 py-2 rounded h-8 ${mode === 'logic' ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'}`}>
              <WandSparkles className='w-4 h-4' /> Logic
            </button>

            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-2 px-3 py-2 rounded h-8 ${mode === 'preview' ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'}`}>
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
        )}

        <button className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded border border-gray-300" onClick={onImportClick}>
          <Upload className='w-4 h-4' />Import
        </button>
        <button
          className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded border border-gray-300"
          onClick={() => navigate("/dashboard/forms")}
        >
          My Forms
        </button>
        <button className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded border" onClick={handleExport}>
          <Download className='w-4 h-4' />Export
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-2 rounded border ${
            elements.length === 0 ||
            (elements.length === 1 && elements[0].type === "section") ||
            publishDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black text-white"
          }`}
          onClick={elements.length > 1 ? onPublishClick : null}
          disabled={
            elements.length === 0 ||
            (elements.length === 1 && elements[0].type === "section") ||
            publishDisabled
          }>
          <Share2 className="w-4 h-4" />{publishLabel}
        </button>

        <div className="flex items-center gap-3 border-l pl-4">
          <div className="text-right leading-tight">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="text-sm font-medium text-gray-900">{user?.name || user?.email || "Creator"}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded border border-gray-300 text-sm hover:bg-gray-100"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
