const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
const port = 4001;
const db = new sqlite3.Database('memories.db');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Initialize the database with the memories table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      timestamp DATE
    )
  `);
});

// Get all memories
app.get('/memories', (req, res) => {
  db.all('SELECT * FROM memories', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ memories: rows });
  });
});

// Get a specific memory by ID
app.get('/memories/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }
    res.json({ memory: row });
  });
});

// Create a new memory
app.post('/memories', (req, res) => {
  const { name, description, timestamp } = req.body;

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    });
    return;
  }

  const stmt = db.prepare(
    'INSERT INTO memories (name, description, timestamp) VALUES (?, ?, ?)'
  );
  stmt.run(name, description, timestamp, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // After successfully inserting, retrieve the newly created memory with its ID
    const newMemoryId = this.lastID; // Get the ID of the newly inserted memory
    db.get('SELECT * FROM memories WHERE id = ?', [newMemoryId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ memory: row }); // Return the newly created memory
    });
  });
});

// Update a memory (Partial update with PATCH)
app.patch('/memories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // Validate incoming data
  let updateFields = [];
  let queryParams = [];

  if (name) {
    updateFields.push('name = ?');
    queryParams.push(name);
  }
  if (description) {
    updateFields.push('description = ?');
    queryParams.push(description);
  }

  queryParams.push(id); // Add ID to query parameters for the WHERE clause

  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const query = `UPDATE memories SET ${updateFields.join(', ')} WHERE id = ?`;

  // Check if memory exists before updating
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    // Prepare and run the update query
    const stmt = db.prepare(query);
    stmt.run(queryParams, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Fetch the updated memory to return it in the response
      db.get('SELECT * FROM memories WHERE id = ?', [id], (err, updatedRow) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Memory updated successfully', memory: updatedRow });
      });
    });

    stmt.finalize(); // Finalize statement to free resources
  });
});


// Delete a memory by ID
app.delete('/memories/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Memory deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
