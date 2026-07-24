const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Room = require('../models/Room');
const crypto = require('crypto');

// @route   POST api/rooms
// @desc    Create a new room
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ msg: 'Please enter a room name' });
    }

    const roomId = crypto.randomBytes(3).toString('hex').toUpperCase();

    const newRoom = new Room({
      roomId,
      name,
      creator: req.user.id
    });

    const room = await newRoom.save();
    // Return room mapping roomId to id for frontend
    res.json({ id: room.roomId, name: room.name, creator: room.creator, createdAt: room.createdAt });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rooms
// @desc    Get all rooms for the logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { creator: req.user.id },
        { participants: req.user.id }
      ]
    }).populate('creator', 'username').sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/rooms/:id
// @desc    Get room by ID and join it
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.id });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Add user to participants if not creator and not already in participants
    if (room.creator.toString() !== req.user.id && !room.participants.includes(req.user.id)) {
      room.participants.push(req.user.id);
      await room.save();
    }

    res.json({ id: room.roomId, name: room.name, creator: room.creator, participants: room.participants, createdAt: room.createdAt });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
