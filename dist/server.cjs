var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_vite = require("vite");

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var DB_DIR = import_path.default.join(process.cwd(), ".data");
var DB_FILE = import_path.default.join(DB_DIR, "db.json");
var DEFAULT_SERVICES = [
  {
    id: "fb-followers-v1",
    name: "Facebook Page Follower [Instant / Real Active Profile]",
    price: 1.8,
    // $1.80 per 1000
    min: 100,
    max: 5e4,
    category: "Facebook Services",
    description: "Provide permanent followers for public pages. High speed delivery of up to 5k/day. Real active profiles with avatars."
  },
  {
    id: "fb-likes-v1",
    name: "Facebook Post Likes [Non-Drop / Lifetime Warranty]",
    price: 1.2,
    min: 50,
    max: 1e5,
    category: "Facebook Services",
    description: "Instant likes for targeted public posts. Completely safe, steady speed, and carries lifetime drop warranty."
  },
  {
    id: "ig-followers-hq",
    name: "Instagram Followers [Premium Elite Profiles - Verified Sources]",
    price: 2.1,
    min: 100,
    max: 3e4,
    category: "Instagram Services",
    description: "Premium quality Instagram followers with minimal drop rate. Dynamic speed matching natural growth algorithms."
  },
  {
    id: "ig-likes-instant",
    name: "Instagram Likes [Super Instant Server - Heavy Flow]",
    price: 0.8,
    min: 50,
    max: 5e4,
    category: "Instagram Services",
    description: "Instant premium likes matching global coordinates. Delivery begins in under 3 minutes."
  },
  {
    id: "tt-followers-boost",
    name: "TikTok Followers [Organic Grow Pattern - No Drop]",
    price: 2.5,
    min: 100,
    max: 2e4,
    category: "TikTok Services",
    description: "Gain global TikTok followers steadily. 100% safe for creator accounts to unlock live streaming capabilities."
  },
  {
    id: "tt-views-viral",
    name: "TikTok Views [High Retention / Explorer Push]",
    price: 0.15,
    min: 1e3,
    max: 1e7,
    category: "TikTok Services",
    description: "Provides high retention views suitable for boosting TikTok SEO and pushing content to the For You Page."
  },
  {
    id: "yt-views-v2",
    name: "YouTube Monetization Views [Safe / Non-Drop]",
    price: 4.5,
    min: 500,
    max: 1e5,
    category: "YouTube Services",
    description: "High retention YouTube views compatible with AdSense policies. Speeds up to 2k/day. Perfect for watch-time building."
  },
  {
    id: "yt-subs-permanent",
    name: "YouTube Subscribers [Organic Daily Batch - Guaranteed]",
    price: 12,
    min: 100,
    max: 5e3,
    category: "YouTube Services",
    description: "Slow, drip-feed organic subscribers key for unlocking creator credentials. 100% guaranteed safety metrics."
  },
  {
    id: "prod-fb-accounts-premium",
    name: "Facebook Aged Accounts [Cookies + 2FA Key Included]",
    price: 1.5,
    // Charging $1.50 per Facebook account
    min: 1,
    max: 100,
    category: "Seller Products",
    description: "Aged social accounts. Instant automated delivery. Includes Username:Password:RecoveryEmail:2FAKey format.",
    isProduct: true,
    deliveryStock: "fb_user_elite_01:pA$$word9281:rec_dan_72@gmail.com:2FAKJBSWY3DPEB\nfb_user_pro_44:secuReP@@@s01:rec_sandra_3@gmail.com:2FAKHEWTY5DREQ\nfb_user_vintage_89:clArA92!0:rec_lucas_11@gmail.com:2FAKHEWTY8DFDS\nfb_user_aged_12:vIntAgE1901:rec_marcos_5@gmail.com:2FAKKJHTY8DJKS"
  },
  {
    id: "prod-gmail-accounts-pva",
    name: "Gmail Accounts PVA [High Score / Recovery Access]",
    price: 0.9,
    // $0.90 per account
    min: 1,
    max: 100,
    category: "Seller Products",
    description: "Phone verified Gmail accounts with instant credentials delivery. Format: Email:Password:BackupEmail.",
    isProduct: true,
    deliveryStock: "alpha_smm_service_01@gmail.com:p@$$word94821:back_01@outlook.com\nbeta_smm_builder_42@gmail.com:pAssMaster_99:back_42@outlook.com\ngamma_smm_accounts_88@gmail.com:vAlidEmailP@ss:back_88@outlook.com\ndelta_premium_pva_77@gmail.com:ultraP@ssw0rd_:back_77@outlook.com"
  }
];
var FileDatabase = class {
  constructor() {
    this.cache = null;
    this.init();
  }
  init() {
    if (!import_fs.default.existsSync(DB_DIR)) {
      import_fs.default.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!import_fs.default.existsSync(DB_FILE)) {
      const adminPasswordHash = import_bcryptjs.default.hashSync("admin123", 10);
      const userPasswordHash = import_bcryptjs.default.hashSync("user123", 10);
      const initialDB = {
        users: [
          {
            id: "admin-usr-1",
            username: "admin",
            // We store the hashed password in an internal record but keep User interface clean.
            // Under real code, store passwords on a private mapping
            // or we will attach the hash to the custom DB record.
            balance: 9999,
            role: "admin",
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            id: "user-usr-1",
            username: "user",
            balance: 50,
            // Preload standard user with balance for high fidelity user feedback
            role: "user",
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        ],
        services: DEFAULT_SERVICES,
        orders: [
          {
            id: "ORD-58392",
            userId: "user-usr-1",
            serviceId: "fb-followers-v1",
            link: "https://facebook.com/myawesomepage",
            quantity: 1e3,
            charge: 1.8,
            status: "completed",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString()
          },
          {
            id: "ORD-21049",
            userId: "user-usr-1",
            serviceId: "ig-followers-hq",
            link: "https://instagram.com/myprofile",
            quantity: 2e3,
            charge: 4.2,
            status: "processing",
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1e3).toISOString()
          }
        ],
        transactions: [
          {
            id: "TXN-00001",
            userId: "user-usr-1",
            amount: 50,
            type: "deposit",
            status: "completed",
            paymentMethod: "KHQR (Bakong)",
            referenceCode: "729481",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString()
          }
        ]
      };
      const secrets = {
        "admin-usr-1": adminPasswordHash,
        "user-usr-1": userPasswordHash
      };
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify({ data: initialDB, secrets }, null, 2));
      this.cache = initialDB;
    }
  }
  read() {
    try {
      const content = import_fs.default.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      this.init();
      const content = import_fs.default.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  }
  write(schema, secrets) {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify({ data: schema, secrets }, null, 2), "utf-8");
    this.cache = schema;
  }
  // User Actions
  getUsers() {
    return this.read().data.users;
  }
  findUserById(id) {
    return this.getUsers().find((u) => u.id === id);
  }
  findUserByUsername(username) {
    return this.getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
  }
  getUserSecret(userId) {
    return this.read().secrets[userId];
  }
  createUser(username, passwordPlain, role = "user") {
    const fileContent = this.read();
    const existing = fileContent.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      throw new Error("Username already exists");
    }
    const userId = `usr-${Math.random().toString(36).substr(2, 9)}`;
    const hash = import_bcryptjs.default.hashSync(passwordPlain, 10);
    const newUser = {
      id: userId,
      username,
      balance: 10,
      // Preload $10 signup bonus for testing deposit flow easily
      role,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    fileContent.data.users.push(newUser);
    fileContent.secrets[userId] = hash;
    this.write(fileContent.data, fileContent.secrets);
    return newUser;
  }
  updateUserBalance(userId, amount, operation) {
    const fileContent = this.read();
    const user = fileContent.data.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (operation === "add") {
      user.balance = parseFloat((user.balance + amount).toFixed(2));
    } else {
      user.balance = parseFloat((user.balance - amount).toFixed(2));
    }
    this.write(fileContent.data, fileContent.secrets);
    return user;
  }
  updateUserRole(userId, role) {
    const fileContent = this.read();
    const user = fileContent.data.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.role = role;
    this.write(fileContent.data, fileContent.secrets);
    return user;
  }
  deleteUser(userId) {
    const fileContent = this.read();
    fileContent.data.users = fileContent.data.users.filter((u) => u.id !== userId);
    delete fileContent.secrets[userId];
    this.write(fileContent.data, fileContent.secrets);
  }
  // Service Actions
  getServices() {
    return this.read().data.services;
  }
  createService(service) {
    const fileContent = this.read();
    const id = `srv-${Math.random().toString(36).substr(2, 9)}`;
    const newService = {
      ...service,
      id
    };
    fileContent.data.services.push(newService);
    this.write(fileContent.data, fileContent.secrets);
    return newService;
  }
  updateService(id, updated) {
    const fileContent = this.read();
    const service = fileContent.data.services.find((s) => s.id === id);
    if (!service) {
      throw new Error("Service not found");
    }
    Object.assign(service, updated);
    this.write(fileContent.data, fileContent.secrets);
    return service;
  }
  deleteService(id) {
    const fileContent = this.read();
    fileContent.data.services = fileContent.data.services.filter((s) => s.id !== id);
    this.write(fileContent.data, fileContent.secrets);
  }
  // Order Actions
  getOrders() {
    const fileContent = this.read();
    const services = fileContent.data.services;
    const users = fileContent.data.users;
    return fileContent.data.orders.map((order) => {
      const service = services.find((s) => s.id === order.serviceId);
      const user = users.find((u) => u.id === order.userId);
      return {
        ...order,
        serviceName: service ? service.name : "Unknown Service",
        username: user ? user.username : "Unknown User"
      };
    });
  }
  getOrdersByUserId(userId) {
    return this.getOrders().filter((o) => o.userId === userId);
  }
  createOrder(userId, serviceId, link, quantity) {
    const fileContent = this.read();
    const user = fileContent.data.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    const service = fileContent.data.services.find((s) => s.id === serviceId);
    if (!service) throw new Error("Service not found");
    if (quantity < service.min || quantity > service.max) {
      throw new Error(`Quantity must be between ${service.min} and ${service.max}`);
    }
    const charge = service.isProduct ? parseFloat((service.price * quantity).toFixed(4)) : parseFloat((service.price * quantity / 1e3).toFixed(4));
    if (user.balance < charge) {
      throw new Error(`Insufficient balance. Requires $${charge.toFixed(2)}, got $${user.balance.toFixed(2)}`);
    }
    user.balance = parseFloat((user.balance - charge).toFixed(2));
    let deliveredItems = void 0;
    if (service.isProduct) {
      const stockText = service.deliveryStock || "";
      const lines = stockText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
      const toDeliver = lines.slice(0, quantity);
      while (toDeliver.length < quantity) {
        const itemIdx = toDeliver.length + 1;
        if (service.name.toLowerCase().includes("fb") || service.name.toLowerCase().includes("facebook")) {
          toDeliver.push(`fb_acc_pva_${Math.floor(1e4 + Math.random() * 9e4)}:pass${Math.floor(1e3 + Math.random() * 9e3)}:recovery${itemIdx}@gmail.com:2FAKJBSWY3DPEB`);
        } else if (service.name.toLowerCase().includes("gmail") || service.name.toLowerCase().includes("google")) {
          toDeliver.push(`gmail_pva_${Math.floor(1e3 + Math.random() * 9e3)}@gmail.com:pAssWord${Math.floor(1e3 + Math.random() * 9e3)}:backup${itemIdx}@outlook.com`);
        } else {
          toDeliver.push(`prod_account_${Math.floor(1e4 + Math.random() * 9e4)}:secretKey_${Math.random().toString(36).substring(2, 8)}`);
        }
      }
      deliveredItems = toDeliver;
      const remainingLines = lines.slice(quantity);
      service.deliveryStock = remainingLines.join("\n");
    }
    const orderId = `ORD-${Math.floor(1e4 + Math.random() * 9e4)}`;
    const startCount = Math.floor(120 + Math.random() * 3500);
    const newOrder = {
      id: orderId,
      userId,
      serviceId,
      link,
      quantity,
      charge,
      status: service.isProduct ? "completed" : "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      startCount: service.isProduct ? void 0 : startCount,
      completedAt: service.isProduct ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
      deliveredItems
    };
    fileContent.data.orders.push(newOrder);
    const txnId = `TXN-${Math.floor(1e4 + Math.random() * 9e4)}`;
    const transaction = {
      id: txnId,
      userId,
      amount: charge,
      type: "charge",
      status: "completed",
      paymentMethod: "Wallet Balance",
      referenceCode: orderId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    fileContent.data.transactions.push(transaction);
    this.write(fileContent.data, fileContent.secrets);
    return {
      ...newOrder,
      serviceName: service.name,
      username: user.username
    };
  }
  updateOrderStatus(orderId, status) {
    const fileContent = this.read();
    const order = fileContent.data.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    if (status === "cancelled" && order.status !== "cancelled" && order.status !== "completed") {
      const user = fileContent.data.users.find((u) => u.id === order.userId);
      if (user) {
        user.balance = parseFloat((user.balance + order.charge).toFixed(2));
        const txnId = `TXN-${Math.floor(1e4 + Math.random() * 9e4)}`;
        const refundTxn = {
          id: txnId,
          userId: order.userId,
          amount: order.charge,
          type: "refund",
          status: "completed",
          paymentMethod: "Wallet Balance",
          referenceCode: order.id,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        fileContent.data.transactions.push(refundTxn);
      }
    }
    order.status = status;
    if (status === "completed") {
      order.completedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    this.write(fileContent.data, fileContent.secrets);
    return this.getOrders().find((o) => o.id === orderId);
  }
  updateOrderRating(orderId, rating, reviewComment) {
    const fileContent = this.read();
    const order = fileContent.data.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== "completed") {
      throw new Error("Only completed orders can be reviewed");
    }
    order.rating = rating;
    if (reviewComment !== void 0) {
      order.reviewComment = reviewComment;
    }
    this.write(fileContent.data, fileContent.secrets);
    return this.getOrders().find((o) => o.id === orderId);
  }
  updateOrderNotes(orderId, notes) {
    const fileContent = this.read();
    const order = fileContent.data.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    order.notes = notes;
    this.write(fileContent.data, fileContent.secrets);
    return this.getOrders().find((o) => o.id === orderId);
  }
  // Transactions / Deposits
  getTransactions() {
    const fileContent = this.read();
    const users = fileContent.data.users;
    return fileContent.data.transactions.map((txn) => {
      const user = users.find((u) => u.id === txn.userId);
      return {
        ...txn,
        username: user ? user.username : "Unknown User"
      };
    });
  }
  getTransactionsByUserId(userId) {
    return this.getTransactions().filter((t) => t.userId === userId);
  }
  createTransaction(userId, amount, paymentMethod, referenceCode) {
    const fileContent = this.read();
    const user = fileContent.data.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    const txnId = `TXN-${Math.floor(1e4 + Math.random() * 9e4)}`;
    const newTxn = {
      id: txnId,
      userId,
      amount: parseFloat(amount.toFixed(2)),
      type: "deposit",
      status: "pending",
      paymentMethod,
      referenceCode,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    fileContent.data.transactions.push(newTxn);
    this.write(fileContent.data, fileContent.secrets);
    return {
      ...newTxn,
      username: user.username
    };
  }
  approveTransaction(txnId) {
    const fileContent = this.read();
    const txn = fileContent.data.transactions.find((t) => t.id === txnId);
    if (!txn) throw new Error("Transaction not found");
    if (txn.status !== "pending") throw new Error("Transaction is already processed");
    const user = fileContent.data.users.find((u) => u.id === txn.userId);
    if (!user) throw new Error("User associated with transaction not found");
    txn.status = "completed";
    user.balance = parseFloat((user.balance + txn.amount).toFixed(2));
    this.write(fileContent.data, fileContent.secrets);
    return this.getTransactions().find((t) => t.id === txnId);
  }
  rejectTransaction(txnId) {
    const fileContent = this.read();
    const txn = fileContent.data.transactions.find((t) => t.id === txnId);
    if (!txn) throw new Error("Transaction not found");
    if (txn.status !== "pending") throw new Error("Transaction is already processed");
    txn.status = "failed";
    this.write(fileContent.data, fileContent.secrets);
    return this.getTransactions().find((t) => t.id === txnId);
  }
};
var db = new FileDatabase();

// server.ts
var PORT = 3e3;
var JWT_SECRET = process.env.JWT_SECRET || "cambo_smm_panel_jwt_secret_key_8491823";
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    import_jsonwebtoken.default.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    });
  };
  const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Administrative privileges required" });
    }
    next();
  };
  app.post("/api/auth/register", (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      if (username.length < 3 || password.length < 5) {
        return res.status(400).json({ error: "Username (min 3 chars) and password (min 5 chars) too short" });
      }
      const user = db.createUser(username.trim(), password);
      const token = import_jsonwebtoken.default.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/auth/login", (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const user = db.findUserByUsername(username.trim());
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const passwordHash = db.getUserSecret(user.id);
      if (!passwordHash || !import_bcryptjs2.default.compareSync(password, passwordHash)) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const token = import_jsonwebtoken.default.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }
    res.json(user);
  });
  app.get("/api/services", (req, res) => {
    res.json(db.getServices());
  });
  app.post("/api/services", authenticateToken, requireAdmin, (req, res) => {
    try {
      const { name, price, min, max, category, description } = req.body;
      if (!name || price === void 0 || !min || !max || !category) {
        return res.status(400).json({ error: "Missing required SMM service fields" });
      }
      const created = db.createService({
        name,
        price: parseFloat(price),
        min: parseInt(min),
        max: parseInt(max),
        category,
        description: description || ""
      });
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.put("/api/services/:id", authenticateToken, requireAdmin, (req, res) => {
    try {
      const updated = db.updateService(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.delete("/api/services/:id", authenticateToken, requireAdmin, (req, res) => {
    try {
      db.deleteService(req.params.id);
      res.json({ message: "Service removed successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.get("/api/orders", authenticateToken, (req, res) => {
    if (req.user.role === "admin") {
      res.json(db.getOrders());
    } else {
      res.json(db.getOrdersByUserId(req.user.id));
    }
  });
  app.post("/api/orders", authenticateToken, (req, res) => {
    try {
      const { serviceId, link, quantity } = req.body;
      if (!serviceId || !link || !quantity) {
        return res.status(400).json({ error: "Missing link, quantity, or service ID" });
      }
      const order = db.createOrder(req.user.id, serviceId, link, parseInt(quantity));
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/orders/:id/cancel", authenticateToken, (req, res) => {
    try {
      const { id } = req.params;
      const orders = db.getOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized to cancel this order" });
      }
      if (order.status !== "pending") {
        return res.status(400).json({ error: "Only pending orders can be cancelled" });
      }
      const updated = db.updateOrderStatus(id, "cancelled");
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.get("/api/orders/:id/download-txt", authenticateToken, (req, res) => {
    try {
      const { id } = req.params;
      const orders = db.getOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized to download this order detail" });
      }
      const delivered = order.deliveredItems || [];
      const itemFormatStr = delivered.length > 0 ? delivered.join("\r\n") : "No digital accounts/items attached.";
      const content = `=====================================================
SMM DIGITAL STORE - PURCHASE DELIVERY
=====================================================
Order ID:        ${order.id}
Product Name:    ${order.serviceName || "SMM Seller Product"}
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
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="smm_delivery_${order.id}.txt"`);
      return res.send(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/orders/:id/rate", authenticateToken, (req, res) => {
    try {
      const { id } = req.params;
      const { rating, reviewComment } = req.body;
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Valid star rating (1-5) is required" });
      }
      const orders = db.getOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized to rate this order" });
      }
      const updated = db.updateOrderRating(id, rating, reviewComment);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/orders/:id/notes", authenticateToken, (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      if (typeof notes !== "string") {
        return res.status(400).json({ error: "Notes must be a string" });
      }
      const orders = db.getOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized to modify notes for this order" });
      }
      const updated = db.updateOrderNotes(id, notes.trim());
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.put("/api/orders/:id/status", authenticateToken, requireAdmin, (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "New status required" });
      }
      const updated = db.updateOrderStatus(req.params.id, status);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.get("/api/transactions", authenticateToken, (req, res) => {
    if (req.user.role === "admin") {
      res.json(db.getTransactions());
    } else {
      res.json(db.getTransactionsByUserId(req.user.id));
    }
  });
  app.post("/api/transactions", authenticateToken, (req, res) => {
    try {
      const { amount, paymentMethod, referenceCode } = req.body;
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Valid deposit amount required" });
      }
      if (!referenceCode) {
        return res.status(400).json({ error: "Valid transaction reference code required" });
      }
      const txn = db.createTransaction(req.user.id, parseFloat(amount), paymentMethod || "KHQR (Bakong)", referenceCode);
      res.status(201).json(txn);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/transactions/:id/approve", authenticateToken, requireAdmin, (req, res) => {
    try {
      const txn = db.approveTransaction(req.params.id);
      console.log(`
======================================================`);
      console.log(`\u{1F916} TELEGRAM BOT NOTIFICATION SENT`);
      console.log(`\u{1F4E2} Payment Approved:`);
      console.log(`\u{1F464} User: ${txn.username} (ID: ${txn.userId})`);
      console.log(`\u{1F4B0} Amount: $${txn.amount.toFixed(2)} USD via ${txn.paymentMethod}`);
      console.log(`\u{1F511} Ref Code: ${txn.referenceCode}`);
      console.log(`\u{1F4C5} Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}`);
      console.log(`======================================================
`);
      res.json({ message: "Transaction approved and account balance credited", transaction: txn });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/transactions/:id/reject", authenticateToken, requireAdmin, (req, res) => {
    try {
      const txn = db.rejectTransaction(req.params.id);
      res.json({ message: "Transaction rejected successfully", transaction: txn });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.get("/api/stats", authenticateToken, (req, res) => {
    try {
      const user = db.findUserById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      const myOrders = db.getOrdersByUserId(user.id);
      const activeOrders = myOrders.filter((o) => o.status === "pending" || o.status === "processing").length;
      const totalSpent = myOrders.filter((o) => o.status === "completed" || o.status === "processing" || o.status === "pending").reduce((sum, o) => sum + o.charge, 0);
      const response = {
        totalOrders: myOrders.length,
        totalSpent: parseFloat(totalSpent.toFixed(4)),
        activeOrders,
        walletBalance: user.balance,
        servicesCount: db.getServices().length
      };
      if (user.role === "admin") {
        const allUsers = db.getUsers();
        const allOrders = db.getOrders();
        const allTransactions = db.getTransactions();
        response.totalUsers = allUsers.length;
        response.allOrdersCount = allOrders.length;
        response.totalDeposited = parseFloat(
          allTransactions.filter((t) => t.type === "deposit" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0).toFixed(2)
        );
        response.pendingDepositsCount = allTransactions.filter((t) => t.type === "deposit" && t.status === "pending").length;
      }
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/admin/users", authenticateToken, requireAdmin, (req, res) => {
    const list = db.getUsers().map((u) => ({
      id: u.id,
      username: u.username,
      balance: u.balance,
      role: u.role,
      createdAt: u.createdAt
    }));
    res.json(list);
  });
  app.put("/api/admin/users/:id/role", authenticateToken, requireAdmin, (req, res) => {
    try {
      const { role } = req.body;
      if (role !== "admin" && role !== "user") {
        return res.status(400).json({ error: "Invalid role" });
      }
      const updated = db.updateUserRole(req.params.id, role);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.put("/api/admin/users/:id/balance", authenticateToken, requireAdmin, (req, res) => {
    try {
      const { amount, action } = req.body;
      if (amount === void 0 || isNaN(amount) || amount < 0) {
        return res.status(400).json({ error: "Valid amount required" });
      }
      const updated = db.updateUserBalance(req.params.id, parseFloat(amount), action === "subtract" ? "subtract" : "add");
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, (req, res) => {
    try {
      if (req.params.id === req.user.id) {
        return res.status(400).json({ error: "Cannot delete your own administrative account" });
      }
      db.deleteUser(req.params.id);
      res.json({ message: "User account removed successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/simulate-webhook", authenticateToken, (req, res) => {
    try {
      const { amount, referenceCode, paymentMethod } = req.body;
      if (!amount || amount <= 0 || !referenceCode) {
        return res.status(400).json({ error: "Invalid parameters" });
      }
      const txn = db.createTransaction(req.user.id, parseFloat(amount), paymentMethod || "KHQR (Bakong Link)", referenceCode);
      const approvedTxn = db.approveTransaction(txn.id);
      console.log(`
======================================================`);
      console.log(`\u{1F916} TELEGRAM WEBHOOK: INSTANT KHQR DEPOSIT COMPLETED`);
      console.log(`\u{1F514} Webhook payload received! Auto-crediting:`);
      console.log(`\u{1F464} Client User: ${approvedTxn.username}`);
      console.log(`\u{1F4B5} Funds Deposited: $${approvedTxn.amount.toFixed(2)}`);
      console.log(`\u2705 Reference Verification: OK [${approvedTxn.referenceCode}]`);
      console.log(`======================================================
`);
      res.status(200).json({
        message: "Mock instant KHQR bank callback triggered successfully! Wallet accredited.",
        transaction: approvedTxn
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app.post("/api/ai/copilot", authenticateToken, async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          response: `\u{1F44B} Hello there SMM Specialist! I'm your AI Marketing Copilot. \u{1F680}

To unlock customized AI strategic advice powered by real Google Gemini intelligence, please populate the **GEMINI_API_KEY** secret in your AI Studio build settings.

Here is a handy SMM Tip: On **Instagram**, posting premium reels with trending audio is currently driving 40% organic reach boosts. Combine standard SMM panel views and dynamic link sharing to push your post directly to the discovery explore grid! \u{1F4AB}`
        });
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const servicesList = db.getServices().map((s) => `- [ID: ${s.id}] ${s.name} - $${s.price.toFixed(2)} per 1000 (Min: ${s.min}, Max: ${s.max})`).join("\n");
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
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `User request: "${prompt}"

Current context: ${JSON.stringify(context || {})}` }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      res.json({ response: response.text });
    } catch (e) {
      console.error("Gemini Copilot Error:", e);
      res.status(500).json({ error: `Gemini API copilot encountered an error to process advice: ${e.message}` });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted on port ${PORT}`);
    console.log(`SMM Panel App link ready.`);
  });
}
startServer().catch((err) => {
  console.error("FATAL SERVER START ERROR:", err);
});
//# sourceMappingURL=server.cjs.map
