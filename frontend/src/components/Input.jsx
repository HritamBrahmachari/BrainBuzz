import { useState } from "react";
import Next from "./Next";
import useAuthStore from "../components/Store"; // Import Zustand store

const Input = () => {
  const [category, setCategory] = useState("");
  const { categories, setCategories } = useAuthStore(); // Zustand state

  const handleAddCategory = () => {
    if (category.trim() !== "" && categories.length < 4) {
      setCategories([...categories, category]); // Save to Zustand store
      setCategory("");
    }
  };

  const handleRemoveCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index)); // Update Zustand store
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="max-w-md px-4 mx-auto mt-12">
      <h1 className="text-indigo-600 font-medium text-center">CHOOSE UP TO 4 CATEGORIES</h1>

      <div className="relative flex flex-wrap gap-2 mt-4">
        {/* Input field */}
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Select Category"
          className="flex-1 py-3 pl-4 pr-12 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
        />
        <button
          type="button"
          className="px-4 py-2 text-white bg-indigo-600 rounded-md"
          onClick={handleAddCategory}
        >
          Add
        </button>
      </div>

      {/* Display categories as tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {categories.map((c, index) => (
          <span key={index} className="flex items-center gap-2 px-3 py-1 text-white bg-indigo-600 rounded-md">
            {c}
            <button onClick={() => handleRemoveCategory(index)} className="text-white rounded-full w-4 h-4 flex items-center justify-center">
              ❌
            </button>
          </span>
        ))}
      </div>
      <br>
      </br>

      <Next />
    </form>
  );
};

export default Input;
