import { useState, useEffect } from 'react';

interface MemoryFormProps {
  onAddMemory: (name: string, description: string) => void; 
  onEditMemory?: (id: number, name: string, description: string) => void; 
  memoryToEdit?: { id: number; name: string; description: string }; 
  formError: string; 
  setFormError: (error: string) => void; 
  handleCancel: () => void; 
}

const MemoryForm = ({
  onAddMemory,
  onEditMemory,
  memoryToEdit,
  formError,
  setFormError,
  handleCancel,
}: MemoryFormProps) => {
  /**
   * State to manage form fields - name and description.
   * If editing an existing memory, they are initialized with the memory's data.
   */
  const [name, setName] = useState(memoryToEdit ? memoryToEdit.name : '');
  const [description, setDescription] = useState(memoryToEdit ? memoryToEdit.description : '');

  /**
   * useEffect hook to update the form fields if a memory is selected for editing.
   * It ensures that the form pre-fills with the existing memory's title and description.
   */
  useEffect(() => {
    if (memoryToEdit) {
      setName(memoryToEdit.name);
      setDescription(memoryToEdit.description);
    }
  }, [memoryToEdit]); // This runs when `memoryToEdit` changes

  /**
   * Function to handle form submission, either adding a new memory or updating an existing one.
   * It validates the form fields, checking for empty values, and calls the appropriate handler.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setFormError(''); // Clear any previous error messages
    
    // Form validation - ensures name and description fields are not empty
    if (name.trim() === '' || description.trim() === '') {
      setFormError('Title and Description are required.');
      return;
    }

    // If editing an existing memory, call onEditMemory with updated data
    if (memoryToEdit && onEditMemory) {
      onEditMemory(memoryToEdit.id, name, description);
    } else {
      // Otherwise, add a new memory and reset the form fields
      onAddMemory(name, description);
      setName(''); 
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 mb-4">
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
        <input
          type="text"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="block w-full p-2 border border-gray-300 rounded"
          placeholder="Enter memory title"
        />
      </div>

      {/* Memory Description Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="block w-full p-2 border border-gray-300 rounded"
          placeholder="Enter memory description"
        />
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          {memoryToEdit ? 'Update Memory' : 'Add Memory'}
        </button>

        <button
          type="button"
          onClick={handleCancel} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MemoryForm;
