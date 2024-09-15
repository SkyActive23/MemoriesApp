import EllipsisVerticalIcon from '@heroicons/react/20/solid/EllipsisVerticalIcon';
import { useState, useEffect } from 'react';

interface Memory {
  id: number;
  name: string;
  description: string;
  timestamp: string;
  popularity: number;
  likes: number;
}

interface MemorySummaryProps {
  memories: Memory[];
}

const MemorySummary = ({ memories }: MemorySummaryProps) => {
  /**
   * State to store userNote that can be saved locally by the user.
   * State to track whether the user is currently editing the note.
   */
  const [userNote, setUserNote] = useState<string>(''); 
  const [isEditing, setIsEditing] = useState<boolean>(false);

  /**
   * useEffect to load the saved user note from localStorage (if available)
   * when the component first mounts. This allows for persistence across page reloads.
   */
  useEffect(() => {
    const savedNote = localStorage.getItem('userNote');
    if (savedNote) {
      setUserNote(savedNote);
    }
  }, []); // Empty dependency array ensures this runs only once after the initial render

  /**
   * Function to save the userNote into localStorage and stop the editing mode.
   */
  const handleSaveNote = () => {
    localStorage.setItem('userNote', userNote); 
    setIsEditing(false); 
  };

  // Calculate the total number of memories for display purposes
  const totalMemories = memories.length;

  return (
    <div className="mb-6 p-4 bg-gray-100 rounded shadow-lg relative">
      {/* Display the total number of memories */}
      <p className='text-sm text-gray-500 mb-2'>Total Memories: {totalMemories}</p>

      <div className="mt-4">
        {isEditing ? (
          <div>
            {/* Textarea for editing the user note */}
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              rows={4}
            />
            <button
              className="mt-2 px-4 py-2 bg-white text-black border rounded hover:bg-gray-300"
              onClick={handleSaveNote}
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            {/* Display the user note or default message if no note is written */}
            <p className='text-lg font-semibold mt-2'>{userNote || 'No note written yet...'}</p>
          </div>
        )}
      </div>

      {/* Button to toggle editing mode, represented by an ellipsis icon */}
      <button
        className="absolute top-0 right-0 mt-2 mr-2 inline-flex justify-center rounded-md bg-white px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        onClick={() => setIsEditing(true)}
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MemorySummary;
