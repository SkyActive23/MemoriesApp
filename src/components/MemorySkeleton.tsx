const MemorySkeleton = () => {
    return (
      <li className='relative mb-4 p-4 rounded bg-gray-100 shadow-lg'>
        <div className="animate-pulse">
          <div className="w-full h-48 bg-gray-200 mb-4"></div>
          <div className="h-6 bg-gray-200 mb-2 w-3/4"></div>
          <div className="h-6 bg-gray-200 mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 w-1/4"></div>
        </div>
      </li>
    );
  };
  
  export default MemorySkeleton;
  