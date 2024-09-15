interface AddMemoryButtonProps {
    isAddingMemory: boolean; //
    setIsAddingMemory: (adding: boolean) => void; 
  }
  
  const AddMemoryButton = ({ isAddingMemory, setIsAddingMemory }: AddMemoryButtonProps) => {
    return (
      !isAddingMemory && ( // Only show the button if the 'add memory' form is not active
        <button
          className="px-4 py-2 bg-white text-black border rounded-md hover:bg-gray-300"
          onClick={() => setIsAddingMemory(true)} // Set 'isAddingMemory' to true to display the form when clicked
        >
          + New Memory
        </button>
      )
    );
  };
  
  export default AddMemoryButton;
  