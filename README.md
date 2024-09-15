# Memory Management App
This is a simple Memory Management Application built with React, TypeScript, and Tailwind CSS. The app allows users to create, view, edit, delete, and search memories. It also includes functionality for sorting memories and pagination for easier navigation. The app uses Axios for making HTTP requests to a backend server (assumed to be running locally) for memory management and includes several custom components for modular and reusable code.

## Features
* 📝 Add new memories with titles and descriptions.
* 🛠️ Edit and delete existing memories.
* 🔍 Search memories by title or description.
* 🕓 Sort memories by date (newest to oldest or oldest to newest).
* ❤️ Like memories.
* 📄 Pagination to navigate through memories.
* ✨ Animated skeleton loaders for memories while data is being fetched.

## Components
### ``` App.tsx ``` 
The main component that renders the memory list and includes logic for fetching memory data from the backend. It handles states like loading, error management, and passes data to child components.

---

### ``` MemoriesList.tsx ```
* ### Purpose: Displays a list of memories, with functionality for editing, deleting, and liking memories.
* ### Key Functions:
  * ``` handleAddMemory ```: Adds a new memory using a POST request.
  * ``` handleEditMemorySubmit ```: Submits edits to an existing memory using a PATCH request.
  * ``` handleConfirmDelete ```: Deletes a memory using a DELETE request.
  * ``` handleLike ```: Simulates liking a memory by incrementing the like count.
  * ``` filteredMemories ``` and ``` sortedMemories ```: Filters and sorts memories based on user input.
  * ``` paginatedMemories ```: Handles pagination for the memory list.

---
    
### ``` MemoryForm.tsx ```
* ### Purpose: Renders a form for adding or editing a memory.
* ### Key Functions:
  * ```handleSubmit```: Handles form submission for adding or editing a memory. Validates form inputs and triggers either the memory addition or update.

---
    
### ```MemorySummary.tsx```
* ### Purpose: Provides a summary of the total number of memories and allows the user to save a note using local storage.
* ### Key Function:
  * ```handleSaveNote```: Saves the user's note to local storage.

---
    
### ```AddMemoryButton.tsx```
* ### Purpose: A button that toggles the form for adding a new memory.
* ### Key Function:
  * Toggles memory form visibility by calling ```setIsAddingMemory```.

---
    
### ```Pagination.tsx```
* ### Purpose: Provides pagination controls to navigate through memories.
* ### Key Functions:
  * ```handlePrevious```: Navigates to the previous page if not on the first page.
  * ```handleNext```: Navigates to the next page if not on the last page.

---
    
### ```SearchBar.tsx```
* ### Purpose: Allows users to search for memories by title or description.
* ### Key Function:
  * ```onChange```: Updates the search query when the user types into the search bar.

---
    
### ```SortDropdown.tsx```
* ### Purpose: Provides a dropdown for sorting memories by date.
* ### Key Function:
  * ```onChange```: Updates the sorting option when the user selects a different sort order (newest to oldest or oldest to newest).

---

### ```ConfirmationModal.tsx```
* ### Purpose: Displays a modal to confirm the deletion of a memory.
* ### Key Functions:
  * ```onClose```: Closes the modal without deleting the memory.
  * ```onConfirm```: Confirms the deletion of the memory.

---

### ```MemorySkeleton.tsx```
* ### Purpose: Displays a loading skeleton while memory data is being fetched.
* ### Key Element: Static elements that pulse with animation to simulate content loading.

---

## Running the App

1.  ### Clone the repository:

```bash
git clone https://github.com/your-username/memory-management-app.git
cd memory-management-app 
```
2. ### Install dependencies:

```bash
npm install
```

3. ### Start the development server:

```bash
npm run dev
```
4. ### Backend Server:

```bash
npm run serve:api
```

Ensure your backend server for memory management (e.g., a Node.js/Express API) is running on http://localhost:4001.

---

## Folder Structure
```bash
/src
  /components
    AddMemoryButton.tsx
    ConfirmationModal.tsx
    MemoryForm.tsx
    MemorySkeleton.tsx
    MemorySummary.tsx
    MemoriesList.tsx
    Pagination.tsx
    SearchBar.tsx
    SortDropdown.tsx
  /assets
    golden-retriever.jpg
  /App.tsx
  /index.tsx
  /styles
    App.css
```

## Dependencies
* React
* TypeScript
* Axios
* Tailwind CSS
* React Icons
* React Bootstrap
* Headless UI

---

## License

This project is open source and available under the MIT License.
