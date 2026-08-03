const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

let transporter;
// Set up ethereal email for development testing
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account. ' + err.message);
    return;
  }
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
});

const JWT_SECRET = process.env.JWT_SECRET || 'syncspace_super_secret';

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/invite
// @desc    Send an invite email to a team member
// @access  Private
router.post('/invite', auth, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ msg: 'Please provide an email address' });
    }

    if (!transporter) {
      return res.status(500).json({ msg: 'Email service is not configured yet. Please try again in a few seconds.' });
    }

    const inviteToken = crypto.randomBytes(20).toString('hex');
    const inviteLink = `http://localhost:5173/join?token=${inviteToken}`;

    const mailOptions = {
      from: '"SyncSpace Team" <noreply@syncspace.io>',
      to: email,
      subject: 'You have been invited to join a SyncSpace workspace',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #a855f7;">Welcome to SyncSpace!</h2>
          <p>You have been invited to collaborate with your team.</p>
          <p>Click the link below to accept the invitation and join the workspace:</p>
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Join Workspace</a>
          </div>
          <p style="color: #666; font-size: 14px;">If you did not expect this invitation, you can safely ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    res.json({ 
      msg: 'Invite sent successfully', 
      previewUrl: nodemailer.getTestMessageUrl(info) 
    });

  } catch (err) {
    console.error('Invite Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
