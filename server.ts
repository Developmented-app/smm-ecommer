import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cambo_smm_panel_jwt_secret_key_8491823';

// Extends Request for Express to hold user authentication references
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: 'admin' | 'user';
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // CORS headers just in case
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Authentication Middleware
  const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  };

  // Admin authorization Guard
  const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrative privileges required' });
    }
    next();
  };

  // --- API ROUTES ---

  // Auth Routes
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      if (username.length < 3 || password.length < 5) {
        return res.status(400).json({ error: 'Username (min 3 chars) and password (min 5 chars) too short' });
      }

      const user = db.createUser(username.trim(), password);
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({ user, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = db.findUserByUsername(username.trim());
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const passwordHash = db.getUserSecret(user.id);
      if (!passwordHash || !bcrypt.compareSync(password, passwordHash)) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ user, token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = db.findUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(user);
  });

  // Services API
  app.get('/api/services', (req: Request, res: Response) => {
    res.json(db.getServices());
  });

  app.post('/api/services', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, price, min, max, category, description } = req.body;
      if (!name || price === undefined || !min || !max || !category) {
        return res.status(400).json({ error: 'Missing required SMM service fields' });
      }

      const created = db.createService({
        name,
        price: parseFloat(price),
        min: parseInt(min),
        max: parseInt(max),
        category,
        description: description || ''
      });
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/services/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const updated = db.updateService(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/services/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      db.deleteService(req.params.id);
      res.json({ message: 'Service removed successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Orders API
  app.get('/api/orders', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    if (req.user!.role === 'admin') {
      res.json(db.getOrders());
    } else {
      res.json(db.getOrdersByUserId(req.user!.id));
    }
  });

  app.post('/api/orders', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { serviceId, link, quantity } = req.body;
      if (!serviceId || !link || !quantity) {
        return res.status(400).json({ error: 'Missing link, quantity, or service ID' });
      }

      const order = db.createOrder(req.user!.id, serviceId, link, parseInt(quantity));
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/orders/:id/cancel', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const orders = db.getOrders();
      const order = orders.find(o => o.id === id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to cancel this order' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending orders can be cancelled' });
      }

      const updated = db.updateOrderStatus(id, 'cancelled');
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/orders/:id/download-txt', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const orders = db.getOrders();
      const order = orders.find(o => o.id === id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to download this order detail' });
      }

      const delivered = order.deliveredItems || [];
      const itemFormatStr = delivered.length > 0
        ? delivered.join('\r\n')
        : 'No digital accounts/items attached.';

      const content = `=====================================================
SMM DIGITAL STORE - PURCHASE DELIVERY
=====================================================
Order ID:        ${order.id}
Product Name:    ${order.serviceName || 'SMM Seller Product'}
Total Quantity:  ${order.quantity}
Paid Charge:     $${(order.charge || 0).toFixed(4)}
Transaction Date:${new Date(order.createdAt).toLocaleString()}
-----------------------------------------------------

DELIVERED CREDENTIALS / KEYS:
-----------------------------------------------------
${itemFormatStr}

=====================================================
Thank you for your purchase via SMM Panel Social Store!
=====================================================`;

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="smm_delivery_${order.id}.txt"`);
      return res.send(content);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/orders/:id/rate', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { rating, reviewComment } = req.body;
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Valid star rating (1-5) is required' });
      }

      const orders = db.getOrders();
      const order = orders.find(o => o.id === id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to rate this order' });
      }

      const updated = db.updateOrderRating(id, rating, reviewComment);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/orders/:id/notes', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      if (typeof notes !== 'string') {
        return res.status(400).json({ error: 'Notes must be a string' });
      }

      const orders = db.getOrders();
      const order = orders.find(o => o.id === id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to modify notes for this order' });
      }

      const updated = db.updateOrderNotes(id, notes.trim());
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'New status required' });
      }
      const updated = db.updateOrderStatus(req.params.id, status);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Transactions API
  app.get('/api/transactions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    if (req.user!.role === 'admin') {
      res.json(db.getTransactions());
    } else {
      res.json(db.getTransactionsByUserId(req.user!.id));
    }
  });

  // Submit dynamic deposit request
  app.post('/api/transactions', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, paymentMethod, referenceCode } = req.body;
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Valid deposit amount required' });
      }
      if (!referenceCode) {
        return res.status(400).json({ error: 'Valid transaction reference code required' });
      }

      const txn = db.createTransaction(req.user!.id, parseFloat(amount), paymentMethod || 'KHQR (Bakong)', referenceCode);
      res.status(201).json(txn);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Admin approves transaction manually / webhook simulations trigger
  app.post('/api/transactions/:id/approve', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const txn = db.approveTransaction(req.params.id);

      // Telegram Bot Simulation bonus feature logging to stdout
      console.log(`\n======================================================`);
      console.log(`🤖 TELEGRAM BOT NOTIFICATION SENT`);
      console.log(`📢 Payment Approved:`);
      console.log(`👤 User: ${txn.username} (ID: ${txn.userId})`);
      console.log(`💰 Amount: $${txn.amount.toFixed(2)} USD via ${txn.paymentMethod}`);
      console.log(`🔑 Ref Code: ${txn.referenceCode}`);
      console.log(`📅 Timestamp: ${new Date().toISOString()}`);
      console.log(`======================================================\n`);

      res.json({ message: 'Transaction approved and account balance credited', transaction: txn });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/transactions/:id/reject', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const txn = db.rejectTransaction(req.params.id);
      res.json({ message: 'Transaction rejected successfully', transaction: txn });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Stats / Dashboard metadata API
  app.get('/api/stats', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = db.findUserById(req.user!.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const myOrders = db.getOrdersByUserId(user.id);
      const activeOrders = myOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const totalSpent = myOrders
        .filter(o => o.status === 'completed' || o.status === 'processing' || o.status === 'pending')
        .reduce((sum, o) => sum + o.charge, 0);

      const response: any = {
        totalOrders: myOrders.length,
        totalSpent: parseFloat(totalSpent.toFixed(4)),
        activeOrders,
        walletBalance: user.balance,
        servicesCount: db.getServices().length
      };

      if (user.role === 'admin') {
        const allUsers = db.getUsers();
        const allOrders = db.getOrders();
        const allTransactions = db.getTransactions();

        response.totalUsers = allUsers.length;
        response.allOrdersCount = allOrders.length;
        response.totalDeposited = parseFloat(
          allTransactions
            .filter(t => t.type === 'deposit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0)
            .toFixed(2)
        );
        response.pendingDepositsCount = allTransactions.filter(t => t.type === 'deposit' && t.status === 'pending').length;
      }

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin users dashboard controller list
  app.get('/api/admin/users', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const list = db.getUsers().map(u => ({
      id: u.id,
      username: u.username,
      balance: u.balance,
      role: u.role,
      createdAt: u.createdAt
    }));
    res.json(list);
  });

  app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { role } = req.body;
      if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ error: 'Invalid role' });
      }
      const updated = db.updateUserRole(req.params.id, role);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/admin/users/:id/balance', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, action } = req.body;
      if (amount === undefined || isNaN(amount) || amount < 0) {
        return res.status(400).json({ error: 'Valid amount required' });
      }
      const updated = db.updateUserBalance(req.params.id, parseFloat(amount), action === 'subtract' ? 'subtract' : 'add');
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.params.id === req.user!.id) {
        return res.status(400).json({ error: 'Cannot delete your own administrative account' });
      }
      db.deleteUser(req.params.id);
      res.json({ message: 'User account removed successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Simulated Instant Webhook Simulator (deposits immediately via Bakong API logic)
  app.post('/api/simulate-webhook', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, referenceCode, paymentMethod } = req.body;
      if (!amount || amount <= 0 || !referenceCode) {
        return res.status(400).json({ error: 'Invalid parameters' });
      }

      // 1. Create a pending txn log under the client
      const txn = db.createTransaction(req.user!.id, parseFloat(amount), paymentMethod || 'KHQR (Bakong Link)', referenceCode);

      // 2. Approve it instantly (representing simulated Bakong instant notification arrival)
      const approvedTxn = db.approveTransaction(txn.id);

      // 3. Trigger dynamic Telegram logging and response
      console.log(`\n======================================================`);
      console.log(`🤖 TELEGRAM WEBHOOK: INSTANT KHQR DEPOSIT COMPLETED`);
      console.log(`🔔 Webhook payload received! Auto-crediting:`);
      console.log(`👤 Client User: ${approvedTxn.username}`);
      console.log(`💵 Funds Deposited: $${approvedTxn.amount.toFixed(2)}`);
      console.log(`✅ Reference Verification: OK [${approvedTxn.referenceCode}]`);
      console.log(`======================================================\n`);

      res.status(200).json({
        message: 'Mock instant KHQR bank callback triggered successfully! Wallet accredited.',
        transaction: approvedTxn
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI-Powered SMM Assistant route (Uses Server-Side Gemini API!)
  app.post('/api/ai/copilot', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback simulated response if no API key is specified, so that the user handles it gracefully
        return res.json({
          response: `👋 Hello there SMM Specialist! I'm your AI Marketing Copilot. 🚀\n\nTo unlock customized AI strategic advice powered by real Google Gemini intelligence, please populate the **GEMINI_API_KEY** secret in your AI Studio build settings.\n\nHere is a handy SMM Tip: On **Instagram**, posting premium reels with trending audio is currently driving 40% organic reach boosts. Combine standard SMM panel views and dynamic link sharing to push your post directly to the discovery explore grid! 💫`
        });
      }

      // Dynamic Node GoogleGenAI dynamic import (matching the gemini-api recommendations)
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const servicesList = db.getServices().map(s => `- [ID: ${s.id}] ${s.name} - $${s.price.toFixed(2)} per 1000 (Min: ${s.min}, Max: ${s.max})`).join('\n');

      const systemInstruction = `You are the Angkor SMM Panel Campaign Copilot, an elite AI Social Media Growth Strategist.
Your goal is to help SMM Panel users formulate outstanding marketing campaigns, recommending specific SMM panel services from our list based on their platform target and goals.

Available SMM Services:
${servicesList}

Always:
- Give professional, concrete, actionable social media growth hacks.
- Reference the specific service descriptions and prices to construct a step-by-step growth bundle.
- Keep responses friendly, elegant, clear, and structured with clean markdown lines.
- Refrain from using complex technical paths or development specifications. Address them like a real social media agency manager.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `User request: "${prompt}"\n\nCurrent context: ${JSON.stringify(context || {})}` }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ response: response.text });
    } catch (e: any) {
      console.error('Gemini Copilot Error:', e);
      res.status(500).json({ error: `Gemini API copilot encountered an error to process advice: ${e.message}` });
    }
  });


  // --- FRONTEND INTEGRATION & CLIENT ROUTING ---

  // Build mode configuration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend assets representing the built application bundle
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 for container ingress
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully booted on port ${PORT}`);
    console.log(`SMM Panel App link ready.`);
  });
}

startServer().catch(err => {
  console.error('FATAL SERVER START ERROR:', err);
});
