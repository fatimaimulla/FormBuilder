export default function Sidebar() {
  const formElements = ["Input", "Textarea", "Checkbox", "Radio", "Select", "Button"];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
      <ul className="space-y-2">
        {formElements.map((el, index) => (
          <li
            key={index}
            className="cursor-pointer p-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          >
            {el}
          </li>
        ))}
      </ul>
    </div>
  );
}
