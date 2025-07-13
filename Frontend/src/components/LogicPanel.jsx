import { Plus } from "lucide-react";

export default function LogicPanel({ elements, setElements }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-5">Conditional Logic</h2>
            <p className="text-gray-500">Define when this field should be visible based on other fields' values.</p>
            <div className="bg-gray-100 rounded border ">
                <p className="text-gray-500 p-3">Add more fields to your form to create conditional logic rules.</p>
            </div>
            <button className="w-full border border-gray-300 text-sm text-black py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                <Plus className="w-4 h-4 text-black font-semibold" />
                <span className="font-semibold">Add Rule</span>
            </button>

            {/* Future: Iterate over elements and add logic setup per field */}
            {/* Example: If field A is "yes", show field B */}
        </div>
    )
}