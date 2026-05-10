import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database in memory (normally this would be a DB or file)
  const users: any[] = [
    { uid: '1', email: 'admin@umkm.id', displayName: 'Super Admin', role: 'admin', businessId: 'system', status: 'active' },
    { uid: '2', email: 'owner@warung.com', displayName: 'Budi Santoso', role: 'owner', businessId: 'warung-123', status: 'active' },
  ];

  // API Routes
  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  app.post('/api/users', async (req, res) => {
    const { email, password, role, displayName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      displayName: displayName || email.split('@')[0],
      role: role || 'user',
      businessId: 'new-business',
      status: 'active',
      // In a real app, you wouldn't store hashedPassword in this same meta list, 
      // but for this mock simulation it works
      passwordHash: hashedPassword,
    };

    users.push(newUser);
    // Return user without password hash
    const { passwordHash, ...userResponse } = newUser;
    res.status(201).json(userResponse);
  });

  app.put('/api/users/:uid', async (req, res) => {
    const { uid } = req.params;
    const { role, status, displayName } = req.body;
    
    const index = users.findIndex(u => u.uid === uid);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[index] = {
      ...users[index],
      role: role || users[index].role,
      status: status || users[index].status,
      displayName: displayName || users[index].displayName,
    };

    const { passwordHash, ...userResponse } = users[index];
    res.json(userResponse);
  });

  app.delete('/api/users/:uid', (req, res) => {
    const { uid } = req.params;
    const index = users.findIndex(u => u.uid === uid);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(index, 1);
    res.status(204).end();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
