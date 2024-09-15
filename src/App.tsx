import { useState, useEffect } from 'react';
import axios from 'axios';
import MemoriesList from './components/MemoriesList';
import './App.css';
import MemorySummary from './components/MemorySummary';
import { CubeIcon } from '@heroicons/react/20/solid';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';

function App() {
  /**
   * Memory interface defines the structure of a memory object
   * which will be used to type-check the data fetched from the API.
   */
  interface Memory {
    id: number;
    name: string;
    description: string;
    timestamp: string;
    popularity: number;
    likes: number;
  }

  // State variables for managing memories, loading status, errors, and form validation
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  /**
   * useEffect hook is used to fetch the list of memories from the backend API
   * when the component mounts. It updates the memory list or sets an error state
   * based on the API response.
   */
  useEffect(() => {
    axios
      .get('http://localhost:4001/memories')
      .then((response) => {
        setMemories(response.data.memories || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs only once after the initial render

  // URL and title for sharing memories on social media platforms
  const shareUrl = 'http://localhost:5173'; 
  const title = 'Check out this memory!';

  return (
    <div className='shadow-lg'>
      <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 mt-32'>
        <div className='overflow-hidden rounded-lg bg-slate-300 shadow h-auto'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center'>
                {/* CubeIcon is used as a logo for the "Memory Lane" section */}
                <CubeIcon className='h-16 w-16 inline-block' />
                <h1 className='text-4xl font-semibold text-gray-900 ml-4'>Memory lane</h1>
              </div>

              {/* Social media share buttons using react-share for Facebook, Twitter, and Email */}
              <div className='flex space-x-2'>
                <FacebookShareButton url={shareUrl} title={title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <EmailShareButton url={shareUrl} subject={title}>
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </div>

            {/* Displays a summary of the memory data */}
            <MemorySummary memories={memories} />

            {/* Conditionally renders the MemoriesList component or a loading message */}
            {loading ? (
              <p>Loading memories...</p>
            ) : (
              <MemoriesList
                memories={memories} // Passes the list of memories to the component
                setMemories={setMemories} // Allows the child component to modify the memory list
                formError={formError} // Passes the form error state to handle validation errors
                setFormError={setFormError} // Allows the child component to update the form error
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
