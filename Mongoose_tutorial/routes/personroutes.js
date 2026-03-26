const express = require('express');
const router = express.Router();

// require your model (adjust path)
const Person = require('../models/person'); // <-- make sure this file exports the model

// Create
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // debug:
    // console.log('POST body:', data);

    const newPerson = new Person(data);
    const response = await newPerson.save();
    console.log('Person saved:', response._id);
    res.status(201).json(response);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const data = await Person.find();
    console.log('Fetched persons:', data.length);
    res.status(200).json(data);
  } catch (err) {
    console.error('GET / error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read by worktype (chef/manager/waiter)
router.get('/work/:worktype', async (req, res) => {
  try {
    const worktype = req.params.worktype;
    if (['chef', 'manager', 'waiter'].includes(worktype)) {
      const response = await Person.find({ work: worktype });
      console.log('response fetched for', worktype);
      return res.status(200).json(response);
    }
    res.status(404).json({ error: 'Invalid work type' });
  } catch (err) {
    console.error('GET /work/:worktype error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update by id
router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const updatePersonData = req.body;

    // debug:
    // console.log('PUT', personId, updatePersonData);

    const response = await Person.findByIdAndUpdate(personId, updatePersonData, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      return res.status(404).json({ error: 'Person not found' });
    }
    console.log('Data Updated for id', personId);
    res.status(200).json(response);
  } catch (err) {
    console.error('PUT error:', err);
    // if it's a CastError (invalid id) you can return 400
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete by id
router.delete('/:id', async (req, res) => {
  try {
    const personId = req.params.id;

    const deleted = await Person.findByIdAndDelete(personId); // or findByIdAndRemove
    if (!deleted) {
      return res.status(404).json({ error: 'Person not found' });
    }

    console.log('Data Deleted for id', personId);
    // 200 with message or 204 no content; choose what you prefer
    return res.status(200).json({ message: 'Person deleted successfully', id: personId });
  } catch (err) {
    console.error('DELETE error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;