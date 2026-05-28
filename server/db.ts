import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, SMMService, Order, Transaction } from '../src/types.js';

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface Schema {
  users: User[];
  services: SMMService[];
  orders: Order[];
  transactions: Transaction[];
}

// Default Seed Data
const DEFAULT_SERVICES: SMMService[] = [
  {
    id: 'fb-followers-v1',
    name: 'Facebook Page Follower [Instant / Real Active Profile]',
    price: 1.80, // $1.80 per 1000
    min: 100,
    max: 50000,
    category: 'Facebook Services',
    description: 'Provide permanent followers for public pages. High speed delivery of up to 5k/day. Real active profiles with avatars.'
  },
  {
    id: 'fb-likes-v1',
    name: 'Facebook Post Likes [Non-Drop / Lifetime Warranty]',
    price: 1.20,
    min: 50,
    max: 100000,
    category: 'Facebook Services',
    description: 'Instant likes for targeted public posts. Completely safe, steady speed, and carries lifetime drop warranty.'
  },
  {
    id: 'ig-followers-hq',
    name: 'Instagram Followers [Premium Elite Profiles - Verified Sources]',
    price: 2.10,
    min: 100,
    max: 30000,
    category: 'Instagram Services',
    description: 'Premium quality Instagram followers with minimal drop rate. Dynamic speed matching natural growth algorithms.'
  },
  {
    id: 'ig-likes-instant',
    name: 'Instagram Likes [Super Instant Server - Heavy Flow]',
    price: 0.80,
    min: 50,
    max: 50000,
    category: 'Instagram Services',
    description: 'Instant premium likes matching global coordinates. Delivery begins in under 3 minutes.'
  },
  {
    id: 'tt-followers-boost',
    name: 'TikTok Followers [Organic Grow Pattern - No Drop]',
    price: 2.50,
    min: 100,
    max: 20000,
    category: 'TikTok Services',
    description: 'Gain global TikTok followers steadily. 100% safe for creator accounts to unlock live streaming capabilities.'
  },
  {
    id: 'tt-views-viral',
    name: 'TikTok Views [High Retention / Explorer Push]',
    price: 0.15,
    min: 1000,
    max: 10000000,
    category: 'TikTok Services',
    description: 'Provides high retention views suitable for boosting TikTok SEO and pushing content to the For You Page.'
  },
  {
    id: 'yt-views-v2',
    name: 'YouTube Monetization Views [Safe / Non-Drop]',
    price: 4.50,
    min: 500,
    max: 100000,
    category: 'YouTube Services',
    description: 'High retention YouTube views compatible with AdSense policies. Speeds up to 2k/day. Perfect for watch-time building.'
  },
  {
    id: 'yt-subs-permanent',
    name: 'YouTube Subscribers [Organic Daily Batch - Guaranteed]',
    price: 12.00,
    min: 100,
    max: 5000,
    category: 'YouTube Services',
    description: 'Slow, drip-feed organic subscribers key for unlocking creator credentials. 100% guaranteed safety metrics.'
  },
  {
    id: 'prod-fb-accounts-premium',
    name: 'Facebook Aged Accounts [Cookies + 2FA Key Included]',
    price: 1.50, // Charging $1.50 per Facebook account
    min: 1,
    max: 100,
    category: 'Seller Products',
    description: 'Aged social accounts. Instant automated delivery. Includes Username:Password:RecoveryEmail:2FAKey format.',
    isProduct: true,
    deliveryStock: 'fb_user_elite_01:pA$$word9281:rec_dan_72@gmail.com:2FAKJBSWY3DPEB\nfb_user_pro_44:secuReP@@@s01:rec_sandra_3@gmail.com:2FAKHEWTY5DREQ\nfb_user_vintage_89:clArA92!0:rec_lucas_11@gmail.com:2FAKHEWTY8DFDS\nfb_user_aged_12:vIntAgE1901:rec_marcos_5@gmail.com:2FAKKJHTY8DJKS'
  },
  {
    id: 'prod-gmail-accounts-pva',
    name: 'Gmail Accounts PVA [High Score / Recovery Access]',
    price: 0.90, // $0.90 per account
    min: 1,
    max: 100,
    category: 'Seller Products',
    description: 'Phone verified Gmail accounts with instant credentials delivery. Format: Email:Password:BackupEmail.',
    isProduct: true,
    deliveryStock: 'alpha_smm_service_01@gmail.com:p@$$word94821:back_01@outlook.com\nbeta_smm_builder_42@gmail.com:pAssMaster_99:back_42@outlook.com\ngamma_smm_accounts_88@gmail.com:vAlidEmailP@ss:back_88@outlook.com\ndelta_premium_pva_77@gmail.com:ultraP@ssw0rd_:back_77@outlook.com'
  }
];

class FileDatabase {
  private cache: Schema | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const adminPasswordHash = bcrypt.hashSync('admin123', 10);
      const userPasswordHash = bcrypt.hashSync('user123', 10);

      const initialDB: Schema = {
        users: [
          {
            id: 'admin-usr-1',
            username: 'admin',
            // We store the hashed password in an internal record but keep User interface clean.
            // Under real code, store passwords on a private mapping
            // or we will attach the hash to the custom DB record.
            balance: 9999.00,
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: 'user-usr-1',
            username: 'user',
            balance: 50.00, // Preload standard user with balance for high fidelity user feedback
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ],
        services: DEFAULT_SERVICES,
        orders: [
          {
            id: 'ORD-58392',
            userId: 'user-usr-1',
            serviceId: 'fb-followers-v1',
            link: 'https://facebook.com/myawesomepage',
            quantity: 1000,
            charge: 1.80,
            status: 'completed',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'ORD-21049',
            userId: 'user-usr-1',
            serviceId: 'ig-followers-hq',
            link: 'https://instagram.com/myprofile',
            quantity: 2000,
            charge: 4.20,
            status: 'processing',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ],
        transactions: [
          {
            id: 'TXN-00001',
            userId: 'user-usr-1',
            amount: 50.00,
            type: 'deposit',
            status: 'completed',
            paymentMethod: 'KHQR (Bakong)',
            referenceCode: '729481',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      };

      // Write password hashes into separate internal store to simulate real security
      const secrets = {
        'admin-usr-1': adminPasswordHash,
        'user-usr-1': userPasswordHash
      };

      fs.writeFileSync(DB_FILE, JSON.stringify({ data: initialDB, secrets }, null, 2));
      this.cache = initialDB;
    }
  }

  private read(): { data: Schema; secrets: Record<string, string> } {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      this.init();
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  }

  private write(schema: Schema, secrets: Record<string, string>) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ data: schema, secrets }, null, 2), 'utf-8');
    this.cache = schema;
  }

  // User Actions
  public getUsers(): User[] {
    return this.read().data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  public findUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public getUserSecret(userId: string): string | undefined {
    return this.read().secrets[userId];
  }

  public createUser(username: string, passwordPlain: string, role: 'admin' | 'user' = 'user'): User {
    const fileContent = this.read();
    const existing = fileContent.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      throw new Error('Username already exists');
    }

    const userId = `usr-${Math.random().toString(36).substr(2, 9)}`;
    const hash = bcrypt.hashSync(passwordPlain, 10);

    const newUser: User = {
      id: userId,
      username,
      balance: 10.00, // Preload $10 signup bonus for testing deposit flow easily
      role,
      createdAt: new Date().toISOString()
    };

    fileContent.data.users.push(newUser);
    fileContent.secrets[userId] = hash;

    this.write(fileContent.data, fileContent.secrets);
    return newUser;
  }

  public updateUserBalance(userId: string, amount: number, operation: 'add' | 'subtract'): User {
    const fileContent = this.read();
    const user = fileContent.data.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (operation === 'add') {
      user.balance = parseFloat((user.balance + amount).toFixed(2));
    } else {
      user.balance = parseFloat((user.balance - amount).toFixed(2));
    }

    this.write(fileContent.data, fileContent.secrets);
    return user;
  }

  public updateUserRole(userId: string, role: 'admin' | 'user'): User {
    const fileContent = this.read();
    const user = fileContent.data.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role;
    this.write(fileContent.data, fileContent.secrets);
    return user;
  }

  public deleteUser(userId: string) {
    const fileContent = this.read();
    fileContent.data.users = fileContent.data.users.filter(u => u.id !== userId);
    delete fileContent.secrets[userId];
    this.write(fileContent.data, fileContent.secrets);
  }

  // Service Actions
  public getServices(): SMMService[] {
    return this.read().data.services;
  }

  public createService(service: Omit<SMMService, 'id'>): SMMService {
    const fileContent = this.read();
    const id = `srv-${Math.random().toString(36).substr(2, 9)}`;
    const newService: SMMService = {
      ...service,
      id
    };
    fileContent.data.services.push(newService);
    this.write(fileContent.data, fileContent.secrets);
    return newService;
  }

  public updateService(id: string, updated: Partial<SMMService>): SMMService {
    const fileContent = this.read();
    const service = fileContent.data.services.find(s => s.id === id);
    if (!service) {
      throw new Error('Service not found');
    }

    Object.assign(service, updated);
    this.write(fileContent.data, fileContent.secrets);
    return service;
  }

  public deleteService(id: string) {
    const fileContent = this.read();
    fileContent.data.services = fileContent.data.services.filter(s => s.id !== id);
    this.write(fileContent.data, fileContent.secrets);
  }

  // Order Actions
  public getOrders(): Order[] {
    const fileContent = this.read();
    const services = fileContent.data.services;
    const users = fileContent.data.users;

    return fileContent.data.orders.map(order => {
      const service = services.find(s => s.id === order.serviceId);
      const user = users.find(u => u.id === order.userId);
      return {
        ...order,
        serviceName: service ? service.name : 'Unknown Service',
        username: user ? user.username : 'Unknown User'
      };
    });
  }

  public getOrdersByUserId(userId: string): Order[] {
    return this.getOrders().filter(o => o.userId === userId);
  }

  public createOrder(userId: string, serviceId: string, link: string, quantity: number): Order {
    const fileContent = this.read();
    const user = fileContent.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const service = fileContent.data.services.find(s => s.id === serviceId);
    if (!service) throw new Error('Service not found');

    if (quantity < service.min || quantity > service.max) {
      throw new Error(`Quantity must be between ${service.min} and ${service.max}`);
    }

    const charge = service.isProduct 
      ? parseFloat((service.price * quantity).toFixed(4))
      : parseFloat(((service.price * quantity) / 1000).toFixed(4));

    if (user.balance < charge) {
      throw new Error(`Insufficient balance. Requires $${charge.toFixed(2)}, got $${user.balance.toFixed(2)}`);
    }

    // Deduct balance
    user.balance = parseFloat((user.balance - charge).toFixed(2));

    let deliveredItems: string[] | undefined = undefined;
    if (service.isProduct) {
      const stockText = service.deliveryStock || '';
      const lines = stockText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      const toDeliver = lines.slice(0, quantity);
      while (toDeliver.length < quantity) {
        const itemIdx = toDeliver.length + 1;
        if (service.name.toLowerCase().includes('fb') || service.name.toLowerCase().includes('facebook')) {
          toDeliver.push(`fb_acc_pva_${Math.floor(10000 + Math.random() * 90000)}:pass${Math.floor(1000 + Math.random() * 9000)}:recovery${itemIdx}@gmail.com:2FAKJBSWY3DPEB`);
        } else if (service.name.toLowerCase().includes('gmail') || service.name.toLowerCase().includes('google')) {
          toDeliver.push(`gmail_pva_${Math.floor(1000 + Math.random() * 9000)}@gmail.com:pAssWord${Math.floor(1000 + Math.random() * 9000)}:backup${itemIdx}@outlook.com`);
        } else {
          toDeliver.push(`prod_account_${Math.floor(10000 + Math.random() * 90000)}:secretKey_${Math.random().toString(36).substring(2, 8)}`);
        }
      }
      deliveredItems = toDeliver;

      // Deduct from stock
      const remainingLines = lines.slice(quantity);
      service.deliveryStock = remainingLines.join('\n');
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const startCount = Math.floor(120 + Math.random() * 3500);
    const newOrder: Order = {
      id: orderId,
      userId,
      serviceId,
      link,
      quantity,
      charge,
      status: service.isProduct ? 'completed' : 'pending',
      createdAt: new Date().toISOString(),
      startCount: service.isProduct ? undefined : startCount,
      completedAt: service.isProduct ? new Date().toISOString() : undefined,
      deliveredItems
    };

    fileContent.data.orders.push(newOrder);

    // Record the charge transaction
    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const transaction: Transaction = {
      id: txnId,
      userId,
      amount: charge,
      type: 'charge',
      status: 'completed',
      paymentMethod: 'Wallet Balance',
      referenceCode: orderId,
      createdAt: new Date().toISOString()
    };
    fileContent.data.transactions.push(transaction);

    this.write(fileContent.data, fileContent.secrets);
    return {
      ...newOrder,
      serviceName: service.name,
      username: user.username
    };
  }

  public updateOrderStatus(orderId: string, status: Order['status']): Order {
    const fileContent = this.read();
    const order = fileContent.data.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    // If active transition to 'cancelled', refund charge back to balance
    if (status === 'cancelled' && order.status !== 'cancelled' && order.status !== 'completed') {
      const user = fileContent.data.users.find(u => u.id === order.userId);
      if (user) {
        user.balance = parseFloat((user.balance + order.charge).toFixed(2));

        // Add refund transaction log
        const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
        const refundTxn: Transaction = {
          id: txnId,
          userId: order.userId,
          amount: order.charge,
          type: 'refund',
          status: 'completed',
          paymentMethod: 'Wallet Balance',
          referenceCode: order.id,
          createdAt: new Date().toISOString()
        };
        fileContent.data.transactions.push(refundTxn);
      }
    }

    order.status = status;
    if (status === 'completed') {
      order.completedAt = new Date().toISOString();
    }
    this.write(fileContent.data, fileContent.secrets);
    return this.getOrders().find(o => o.id === orderId)!;
  }

  public updateOrderRating(orderId: string, rating: number, reviewComment?: string): Order {
    const fileContent = this.read();
    const order = fileContent.data.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'completed') {
      throw new Error('Only completed orders can be reviewed');
    }

    order.rating = rating;
    if (reviewComment !== undefined) {
      order.reviewComment = reviewComment;
    }

    this.write(fileContent.data, fileContent.secrets);
    return this.getOrders().find(o => o.id === orderId)!;
  }

  public updateOrderNotes(orderId: string, notes: string): Order {
    const fileContent = this.read();
    const order = fileContent.data.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.notes = notes;

    this.write(fileContent.data, fileContent.secrets);
    return this.getOrders().find(o => o.id === orderId)!;
  }

  // Transactions / Deposits
  public getTransactions(): Transaction[] {
    const fileContent = this.read();
    const users = fileContent.data.users;

    return fileContent.data.transactions.map(txn => {
      const user = users.find(u => u.id === txn.userId);
      return {
        ...txn,
        username: user ? user.username : 'Unknown User'
      };
    });
  }

  public getTransactionsByUserId(userId: string): Transaction[] {
    return this.getTransactions().filter(t => t.userId === userId);
  }

  public createTransaction(userId: string, amount: number, paymentMethod: string, referenceCode: string): Transaction {
    const fileContent = this.read();
    const user = fileContent.data.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTxn: Transaction = {
      id: txnId,
      userId,
      amount: parseFloat(amount.toFixed(2)),
      type: 'deposit',
      status: 'pending',
      paymentMethod,
      referenceCode,
      createdAt: new Date().toISOString()
    };

    fileContent.data.transactions.push(newTxn);
    this.write(fileContent.data, fileContent.secrets);

    return {
      ...newTxn,
      username: user.username
    };
  }

  public approveTransaction(txnId: string): Transaction {
    const fileContent = this.read();
    const txn = fileContent.data.transactions.find(t => t.id === txnId);
    if (!txn) throw new Error('Transaction not found');
    if (txn.status !== 'pending') throw new Error('Transaction is already processed');

    const user = fileContent.data.users.find(u => u.id === txn.userId);
    if (!user) throw new Error('User associated with transaction not found');

    // Approve status
    txn.status = 'completed';

    // Fund user's balance
    user.balance = parseFloat((user.balance + txn.amount).toFixed(2));

    this.write(fileContent.data, fileContent.secrets);
    return this.getTransactions().find(t => t.id === txnId)!;
  }

  public rejectTransaction(txnId: string): Transaction {
    const fileContent = this.read();
    const txn = fileContent.data.transactions.find(t => t.id === txnId);
    if (!txn) throw new Error('Transaction not found');
    if (txn.status !== 'pending') throw new Error('Transaction is already processed');

    txn.status = 'failed';
    this.write(fileContent.data, fileContent.secrets);
    return this.getTransactions().find(t => t.id === txnId)!;
  }
}

export const db = new FileDatabase();
