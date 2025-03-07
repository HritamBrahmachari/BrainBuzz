const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/test', { 
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('Connection failed:', err.message));

// Schema and Model
const schema = new mongoose.Schema({
  
   datas:{name: {type: String, required: true} ,  email: {type: String, required: true}, password : {type : String, required: true}}}
);
const Model = mongoose.model('Template', schema);

// Route to Add an Item
app.post('/add', async (req, res) => {}
 );

// Route to Get All Items
app.get('/items', async (req, res) => {
  
});

// Route to Delete an Item by ID
app.delete('/items/:id', async (req, res) => {
 
});

// Start the Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
