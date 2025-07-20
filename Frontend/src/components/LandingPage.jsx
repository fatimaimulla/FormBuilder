import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/build-forms");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-center px-4">
      <div className="flex-col space-y-7 animate-fadeInSlow">
        <h1 className="text-6xl md:text-5xl font-bold text-gray-900 leading-tight">
          Build Forms{" "}
          <span className="italic underline underline-offset-4 decoration-gray-400">
            Visually
          </span>
          {" "}
          & Effortlessly
        </h1>
      
        <p className="text-xl text-black">Drag. Drop. Configure.</p>
        <p className="text-lg text-black">Your Form-building experience, Redefined.</p>

        <button
          onClick={handleStartClick}
          className="bg-black text-white px-7 py-2.5 rounded hover:bg-gray-700 transition duration-300">
          <span className="flex gap-3"> Start Building <ArrowRight/> </span>
        </button>
      </div>
    </div>
  );
}
