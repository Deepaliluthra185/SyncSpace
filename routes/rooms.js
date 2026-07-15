const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Room = require('../models/Room');

// @route   POST api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ msg: 'Please enter a room name' });
    }

    const newRoom = new Room({
      name,
      creator: req.user.id
    });

    const room = await newRoom.save();
    // Return room mapping _id to id for frontend
    res.json({ id: room._id, name: room.name, creator: room.creator, createdAt: room.createdAt });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rooms/:id
// @desc    Get room by ID
// @access  Public or Private
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ id: room._id, name: room.name, creator: room.creator, createdAt: room.createdAt });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
