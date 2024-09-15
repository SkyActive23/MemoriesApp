import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, HeartIcon as FilledHeartIcon } from '@heroicons/react/20/solid';
import { HeartIcon as UnfilledHeartIcon } from '@heroicons/react/24/outline';
import MemoryForm from './MemoryForm'; 
import ConfirmationModal from '../modal/ConfirmationModal'; 
import { Card, Image } from 'react-bootstrap'; 
import Dog from '../assets/golden-retriever.jpg'; 
import axios from 'axios';

import SearchBar from './Buttons/SearchBar'; 
import SortDropdown from './Buttons/SortDropDown'; 
import AddMemoryButton from './Buttons/AddMemoryButton'; 
import Pagination from './Buttons/Pagination'; 
import MemorySkeleton from './MemorySkeleton'; 

interface Memory {
  id: number;
  name: string;
  description: string;
  timestamp: string;
  popularity: number;
  likes: number;
}

interface MemoriesListProps {
  memories: Memory[];
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  formError: string;
  setFormError: (error: string) => void;
}

const MemoriesList = ({
  memories,
  setMemories,
  formError,
  setFormError,
}: MemoriesListProps) => {
  // State management for memory deletion, likes, loading, pagination, etc.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState<Memory | null>(null);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true); 
  const [editingMemoryId, setEditingMemoryId] = useState<number | null>(null);
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [sortOption, setSortOption] = useState('newToOld');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const memoriesPerPage = 6; 

  // Simulates loading state for 2 seconds
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); 
  }, []);

  /**
   * Opens the confirmation modal for deleting a memory.
   * @param memory The memory to be deleted.
   */
  const confirmDelete = (memory: Memory) => {
    setMemoryToDelete(memory);
    setIsModalOpen(true);
  };

  /**
   * Handles memory deletion confirmation by making a DELETE request.
   * Updates the state to remove the deleted memory from the list.
   */
  const handleConfirmDelete = () => {
    if (memoryToDelete) {
      axios
        .delete(`http://localhost:4001/memories/${memoryToDelete.id}`)
        .then(() => {
          setMemories((prevMemories) => prevMemories.filter((memory) => memory.id !== memoryToDelete.id));
          setIsModalOpen(false);
        })
        .catch((error) => setFormError(`Error deleting memory: ${error.message}`));
    }
  };

  /**
   * Sets the memory being edited by updating the state with the memory's id.
   * @param memory The memory to be edited.
   */
  const handleEditMemory = (memory: Memory) => {
    setEditingMemoryId(memory.id);
  };

  /**
   * Handles the submission of the edited memory by making a PATCH request.
   * Updates the state with the new memory data.
   */
  const handleEditMemorySubmit = (id: number, name: string, description: string) => {
    axios
      .patch(`http://localhost:4001/memories/${id}`, { name, description })
      .then((response) => {
        setMemories((prevMemories) =>
          prevMemories.map((memory) =>
            memory.id === id
              ? { ...memory, name: response.data.memory.name, description: response.data.memory.description }
              : memory
          )
        );
        setEditingMemoryId(null);
      })
      .catch((error) => setFormError(`Error editing memory: ${error.message}`));
  };

  /**
   * Handles adding a new memory by making a POST request.
   * Adds the new memory to the state and closes the add memory form.
   */
  const handleAddMemory = (name: string, description: string) => {
    axios
      .post('http://localhost:4001/memories', {
        name,
        description,
        timestamp: new Date().toISOString(),
      })
      .then((response) => {
        const newMemory = response.data.memory;
        setMemories((prevMemories) => [...prevMemories, newMemory]);
        setIsAddingMemory(false);
      })
      .catch((error) => {
        setFormError('Error adding memory: ' + error.message);
      });
  };

  /**
   * Cancels editing or adding a memory, resetting the respective states.
   */
  const handleCancel = () => {
    setIsAddingMemory(false); 
    setEditingMemoryId(null);  
  };

  /**
   * Handles the like functionality for a memory.
   * Increments the like count for the memory in the local state.
   */
  const handleLike = (id: number) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: (prevLikes[id] || 0) + 1,
    }));
  };

  /**
   * Filters the memories based on the search query.
   * @returns The filtered memories.
   */
  const filteredMemories = () => {
    return memories.filter((memory) =>
      memory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  /**
   * Sorts the filtered memories based on the selected sort option.
   * @returns The sorted memories.
   */
  const sortedMemories = () => {
    const filtered = filteredMemories();
    if (sortOption === 'oldToNew') {
      return filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } else if (sortOption === 'newToOld') {
      return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return filtered;
  };

  /**
   * Handles pagination by slicing the sorted memories to only show a subset for the current page.
   * @returns The paginated memories.
   */
  const paginatedMemories = sortedMemories().slice(
    (currentPage - 1) * memoriesPerPage,
    currentPage * memoriesPerPage
  );

  return (
    <>
      {/* Render SearchBar, SortDropdown, and AddMemoryButton */}
      <div className="mb-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="flex items-center justify-between">
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />

          <AddMemoryButton isAddingMemory={isAddingMemory} setIsAddingMemory={setIsAddingMemory} />
        </div>
      </div>

      {/* Conditional rendering for the MemoryForm */}
      {isAddingMemory && editingMemoryId === null && (
        <MemoryForm
          onAddMemory={handleAddMemory}
          formError={formError}
          setFormError={setFormError}
          handleCancel={handleCancel} 
        />
      )}

      {/* Render Memory List or Loading Skeleton */}
      {loading ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <MemorySkeleton key={index} />
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedMemories.map((memory) => (
            <li key={memory.id} className="relative mb-4 p-4 rounded bg-gray-100 shadow-lg">
              {/* Memory card content */}
              <div className="flex justify-between">
                <div>
                  {editingMemoryId === memory.id ? (
                    <MemoryForm
                      onEditMemory={handleEditMemorySubmit}
                      memoryToEdit={{ id: memory.id, name: memory.name, description: memory.description }}
                      formError={formError}
                      setFormError={setFormError}
                      handleCancel={handleCancel}
                      onAddMemory={function (name: string, description: string): void {
                        throw new Error('Function not implemented.');
                      }}                    
                    />
                  ) : (
                    <Card key={memory.id} className="overflow-hidden rounded-lg">
                      <Image
                        src={Dog}
                        alt="Dog"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <p className="text-sm text-gray-500 mb-2">{new Date(memory.timestamp).toLocaleString()}</p>
                      <h3 className="text-2xl font-semibold text-gray-900">{memory.name}</h3>
                      <p className="text-lg font-semibold mt-2">{memory.description}</p>
                    </Card>
                  )}
                </div>
                {/* Menu for edit/delete actions */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="inline-flex justify-center w-full rounded-md ml-2 bg-white px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </MenuButton>
                  </div>
                  <Transition
                    as="div"
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              className={`${active ? 'bg-gray-100' : ''} group flex items-center px-4 py-2 text-sm text-gray-700`}
                              onClick={() => handleEditMemory(memory)}
                            >
                              Edit
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              className={`${active ? 'bg-gray-100' : ''} group flex items-center px-4 py-2 text-sm text-red-600`}
                              onClick={() => confirmDelete(memory)}
                            >
                              Delete
                            </button>
                          )}
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>

              {/* Like button and count */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <button
                  onClick={() => handleLike(memory.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  {likes[memory.id] || memory.likes > 0 ? (
                    <FilledHeartIcon className="h-6 w-6" />
                  ) : (
                    <UnfilledHeartIcon className="h-6 w-6" />
                  )}
                </button>
                <span>{likes[memory.id] || memory.likes}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalMemories={sortedMemories().length}
        memoriesPerPage={memoriesPerPage}
      />

      {/* Confirmation modal for deleting a memory */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        memoryName={memoryToDelete ? memoryToDelete.name : ''}
      />
    </>
  );
};

export default MemoriesList;
