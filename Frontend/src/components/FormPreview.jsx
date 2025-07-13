import renderField from "../../functions/RenderElements"

export default function FormPreview ({ elements }) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-4">Form Preview</h2>
            <div className="border rounded-md">
                <form className="space-y-4 p-5">
                    {elements.map((el) => (
                    <div key={el.id}>{renderField(el, false)}</div> // canvas = false
                    ))}
                    <button className="w-full bg-black text-white rounded p-2">Submit</button>
                </form>
            </div>
        </div>
    )
}