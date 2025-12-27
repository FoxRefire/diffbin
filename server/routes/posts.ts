import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Post } from '../models/Post';

const router = express.Router();

// Create a new post
router.post('/', (req, res) => {
  try {
    const { encrypted_data, iv, expires_in_hours } = req.body;

    if (!encrypted_data || !iv) {
      return res.status(400).json({ error: 'encrypted_data and iv are required' });
    }

    const id = uuidv4();
    const expires_at = expires_in_hours
      ? new Date(Date.now() + expires_in_hours * 60 * 60 * 1000)
      : null;

    const post = Post.create({
      id,
      encrypted_data,
      iv,
      expires_at,
    });

    res.status(201).json({ id: post.id, created_at: post.created_at });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get a post by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const post = Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if expired
    if (post.expires_at && new Date(post.expires_at) < new Date()) {
      Post.deleteExpired();
      return res.status(404).json({ error: 'Post has expired' });
    }

    res.json({
      id: post.id,
      encrypted_data: post.encrypted_data,
      iv: post.iv,
      created_at: post.created_at,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

export default router;

