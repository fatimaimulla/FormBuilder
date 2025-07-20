import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/build-forms");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-3xl animate-fadeInSlow">
        <h1 className="text-6xl md:text-5xl font-bold text-gray-900 leading-tight">
          Build Forms{" "}
          <span className="italic underline underline-offset-4 decoration-gray-300">
            Visually
          </span>{" "}
          & Effortlessly
        </h1>

        <p className="text-lg text-gray-600">Drag. Drop. Configure.</p>
        <p className="text-lg text-gray-600">Your form-building experience, redefined.</p>

        <button
          onClick={handleStartClick}
          className="bg-black text-white px-7 py-2.5 rounded hover:bg-gray-900 transition duration-300"
        >
          Start Building →
        </button>
      </div>
    </div>
  );
}
