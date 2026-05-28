import React, { useState, useEffect } from 'react';
import { 
  translations, 
  Language, 
  TranslationSchema 
} from './lib/translations.js';
import { 
  User, 
  SMMService, 
  Order, 
  Transaction, 
  DashboardStats,
  AppNotification
} from './types.js';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Layers, 
  History, 
  Wallet, 
  ShieldAlert, 
  LogOut, 
  Globe, 
  Search, 
  Loader2, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Sparkles, 
  Coins, 
  CreditCard, 
  RefreshCw, 
  Trash2, 
  Check, 
  ChevronRight, 
  Bot, 
  UserPlus, 
  TrendingUp, 
  Edit,
  FileText,
  Bell,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy
} from 'lucide-react';
import { KHQRGenerator } from './components/KHQRGenerator.jsx';
import { AICopilot } from './components/AICopilot.jsx';
import { OrderFeedbackPanel } from './components/OrderFeedbackPanel.jsx';
import { ReorderDrawer } from './components/ReorderDrawer.jsx';
import { OrderNotesPanel } from './components/OrderNotesPanel.jsx';

export default function App() {
  // Locale / Language State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('smm_language');
    return (saved === 'km' ? 'km' : 'en') as Language;
  });
  const t: TranslationSchema = translations[lang];

  // Authentication state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smm_jwt_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smm_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth Forms
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // App Level Navigation Tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-order' | 'services' | 'history' | 'wallet' | 'admin'>('dashboard');

  // Core Data Resource States
  const [services, setServices] = useState<SMMService[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

  // Notifications State & Dropdown Controller
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('smm_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const stored = localStorage.getItem(`smm_notifications_${u.id}`);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Sync notifications when user swaps
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`smm_notifications_${user.id}`);
      setNotifications(stored ? JSON.parse(stored) : []);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const playNotificationSound = () => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 musical note, warm tone
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio autoplay is sometimes blocked by browsers, fail silently
    }
  };

  // Loading indicator states
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Order State Management
  const [orderCategory, setOrderCategory] = useState<string>('');
  const [orderServiceId, setOrderServiceId] = useState<string>('');
  const [orderLink, setOrderLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState<number>(0);

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState<string>('10.00');
  const [depositRefSubmitted, setDepositRefSubmitted] = useState<string>('');
  const [curKHQRRef, setCurKHQRRef] = useState<string>('');
  const [showKHQRFrame, setShowKHQRFrame] = useState(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  // Services Catalog Filters
  const [catalogCategory, setCatalogCategory] = useState<string>('all');
  const [servicesSearchQuery, setServicesSearchQuery] = useState('');

  // Admin Level Actions Forms States
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [adminSelectedUser, setAdminSelectedUser] = useState<User | null>(null);
  const [showAdjustBalanceModal, setShowAdjustBalanceModal] = useState(false);
  const [adjustAmountInput, setAdjustAmountInput] = useState('');
  const [adjustAction, setAdjustAction] = useState<'add' | 'subtract'>('add');

  // Admin New Service Object Creator State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('1.50');
  const [newServiceMin, setNewServiceMin] = useState('100');
  const [newServiceMax, setNewServiceMax] = useState('10000');
  const [newServiceCategory, setNewServiceCategory] = useState('Facebook Services');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceIsProduct, setNewServiceIsProduct] = useState(false);
  const [newServiceStock, setNewServiceStock] = useState('');

  // SMM Campaign Order filtering state
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // Sorting state for Order History
  const [orderSortField, setOrderSortField] = useState<string>('createdAt');
  const [orderSortDirection, setOrderSortDirection] = useState<'asc' | 'desc'>('desc');

  // Expanded order row state for showing start count and completion details
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Quick Reorder Drawer variables
  const [reorderOrder, setReorderOrder] = useState<Order | null>(null);
  const [isReorderOpen, setIsReorderOpen] = useState<boolean>(false);

  // Setup Notification Fader
  const triggerNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Persist language selections
  useEffect(() => {
    localStorage.setItem('smm_language', lang);
  }, [lang]);

  // Load backend stats & listings when authenticated
  const loadCoreData = async (isBackground = false) => {
    if (!token) return;
    if (!isBackground) setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Load services (Public API)
      const resServices = await fetch('/api/services');
      const dataServices = await resServices.json();
      if (resServices.ok) setServices(dataServices);

      // Load dynamic stats (Dashboard counters)
      const resStats = await fetch('/api/stats', { headers });
      const dataStats = await resStats.json();
      if (resStats.ok) {
        setStats(dataStats);
        // Sync local user profile balance dynamically
        if (user) {
          const updatedUser = { ...user, balance: dataStats.walletBalance };
          setUser(updatedUser);
          localStorage.setItem('smm_user', JSON.stringify(updatedUser));
        }
      }

      // Load user specifics (orders and deposit claims logs)
      const resOrders = await fetch('/api/orders', { headers });
      const dataOrders = await resOrders.json();
      if (resOrders.ok) {
        // Evaluate status changes for in-app notifications
        if (orders.length > 0) {
          const newNotifs: AppNotification[] = [];
          dataOrders.forEach((newOrd: Order) => {
            const oldOrd = orders.find(o => o.id === newOrd.id);
            if (oldOrd && oldOrd.status !== newOrd.status) {
              const notifId = `NOT-${Math.floor(10000 + Math.random() * 90000)}`;
              newNotifs.push({
                id: notifId,
                orderId: newOrd.id,
                serviceName: newOrd.serviceName || 'SMM Service',
                oldStatus: oldOrd.status,
                newStatus: newOrd.status,
                createdAt: new Date().toISOString(),
                read: false
              });
              // Show absolute beautiful in-app toast for status change
              const statusCapitalized = newOrd.status.toUpperCase();
              triggerNotification('success', `Order #${newOrd.id} (${newOrd.serviceName || 'Service'}) successfully changed to ${statusCapitalized}!`);
            }
          });

          if (newNotifs.length > 0) {
            setNotifications(prev => {
              const merged = [...newNotifs, ...prev];
              if (user) {
                localStorage.setItem(`smm_notifications_${user.id}`, JSON.stringify(merged));
              }
              return merged;
            });
            playNotificationSound();
          }
        }
        setOrders(dataOrders);
      }

      const resTxns = await fetch('/api/transactions', { headers });
      const dataTxns = await resTxns.json();
      if (resTxns.ok) setTransactions(dataTxns);

      // If administrator, query enrolled users register
      if (user?.role === 'admin') {
        const resUsers = await fetch('/api/admin/users', { headers });
        const dataUsers = await resUsers.json();
        if (resUsers.ok) setAdminUsers(dataUsers);
      }

    } catch (e: any) {
      if (!isBackground) {
        triggerNotification('error', `Data loading fault: ${e.message}`);
      }
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  };

  // Background polling for real-time state changes
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      loadCoreData(true);
    }, 10000); // Check for updates every 10 seconds
    return () => clearInterval(interval);
  }, [token, orders]);

  useEffect(() => {
    if (token) {
      loadCoreData();
    }
  }, [token, activeTab]);

  // Setup initial categories on services loading
  useEffect(() => {
    if (services.length > 0 && !orderCategory) {
      setOrderCategory(services[0].category);
    }
  }, [services]);

  // Handle Order service auto selection when category changes
  useEffect(() => {
    if (orderCategory) {
      const filtered = services.filter(s => s.category === orderCategory);
      const currentServiceStillValid = filtered.some(s => s.id === orderServiceId);
      if (currentServiceStillValid) {
        return;
      }
      if (filtered.length > 0) {
        setOrderServiceId(filtered[0].id);
        const savedMin = filtered[0].min;
        setOrderQuantity(savedMin);
      } else {
        setOrderServiceId('');
        setOrderQuantity(0);
      }
    }
  }, [orderCategory, services]);

  // --- Auth Handlers ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsAuthLoading(true);

    if (!usernameInput.trim() || !passwordInput) {
      setAuthError('Please complete all credential fields');
      setIsAuthLoading(false);
      return;
    }

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('smm_jwt_token', data.token);
        localStorage.setItem('smm_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        triggerNotification('success', authMode === 'login' ? 'Signed in successfully!' : 'Account registered & loaded with standard signup bonus!');
        setAuthSuccess('Redirecting...');
        // Clean forms
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setAuthError(data.error || 'Authentication credential error');
      }
    } catch (err: any) {
      setAuthError(`Connection server fault: ${err.message}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smm_jwt_token');
    localStorage.removeItem('smm_user');
    setToken(null);
    setUser(null);
    triggerNotification('success', 'Logged out of social store manager');
  };

  // --- Order Submission ---
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find(s => s.id === orderServiceId);
    if (!service) return;

    let finalLink = orderLink.trim();
    if (service.isProduct && !finalLink) {
      finalLink = "Instant Download / Delivery";
    }

    if (!orderServiceId || !finalLink || !orderQuantity) {
      triggerNotification('error', 'Please fill out all order coordinates');
      return;
    }

    if (orderQuantity < service.min || orderQuantity > service.max) {
      triggerNotification('error', `Requested quantities fall out of bounds [${service.min} - ${service.max}]`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: orderServiceId,
          link: finalLink,
          quantity: orderQuantity
        })
      });

      const data = await response.json();
      if (response.ok) {
        triggerNotification('success', `Order ${data.id} placed successfully!`);
        // Reset form variables
        setOrderLink('');
        // Reload Stats immediately
        loadCoreData();
        setActiveTab('history');
      } else {
        triggerNotification('error', data.error || 'Unable to place SMM order');
      }
    } catch (e: any) {
      triggerNotification('error', `Connection error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Deposit/KHQR Handler ---
  const handleGenerateKHQR = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(depositAmount);
    if (isNaN(parsed) || parsed < 1.00) {
      triggerNotification('error', t.minDepositWarning);
      return;
    }

    // Generate random 6-digit virtual verification receipt reference code
    const generatedRef = Math.floor(100000 + Math.random() * 900000).toString();
    setCurKHQRRef(generatedRef);
    setShowKHQRFrame(true);
  };

  const handleSubmitDepositClaim = async () => {
    if (!depositAmount || !curKHQRRef) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          paymentMethod: 'KHQR (Bakong Gateway)',
          referenceCode: curKHQRRef
        })
      });

      const data = await response.json();
      if (response.ok) {
        triggerNotification('success', `KHQR Deposit Claim submitted! Ref: ${curKHQRRef}`);
        setShowKHQRFrame(false);
        setDepositRefSubmitted(curKHQRRef);
        loadCoreData();
      } else {
        triggerNotification('error', data.error || 'Failed to submit transaction claim');
      }
    } catch (e: any) {
      triggerNotification('error', `Server communication err: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Automated Webhook Simulation
  const triggerAutomatedWebhookSimulation = async () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < 1.00) {
      triggerNotification('error', t.minDepositWarning);
      return;
    }

    setIsSimulatingWebhook(true);
    const simulatedRef = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const response = await fetch('/api/simulate-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amt,
          referenceCode: simulatedRef,
          paymentMethod: 'KHQR Automated Callback'
        })
      });

      const data = await response.json();
      if (response.ok) {
        triggerNotification('success', `Webhook callback trigger successful! Balance added instantly.`);
        setShowKHQRFrame(false);
        loadCoreData();
      } else {
        triggerNotification('error', data.error || 'Simulated Webhook Failure');
      }
    } catch (e: any) {
      triggerNotification('error', `Connection error: ${e.message}`);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  // --- Admin Handlers ---
  const handleAddServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice || !newServiceMin || !newServiceMax || !newServiceCategory) {
      triggerNotification('error', 'Please complete all service fields');
      return;
    }

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newServiceName,
          price: parseFloat(newServicePrice),
          min: parseInt(newServiceMin),
          max: parseInt(newServiceMax),
          category: newServiceCategory,
          description: newServiceDesc,
          isProduct: newServiceIsProduct,
          deliveryStock: newServiceStock
        })
      });

      if (response.ok) {
        triggerNotification('success', 'New service catalog added!');
        setShowAddServiceModal(false);
        // Clear inputs
        setNewServiceName('');
        setNewServiceDesc('');
        setNewServiceIsProduct(false);
        setNewServiceStock('');
        loadCoreData();
      } else {
        const d = await response.json();
        triggerNotification('error', d.error || 'Fault adding service');
      }
    } catch (err: any) {
      triggerNotification('error', err.message);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to remove this service from active store catalog?')) return;
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        triggerNotification('success', 'SMM Service catalogs revised');
        loadCoreData();
      } else {
        const d = await response.json();
        triggerNotification('error', d.error || 'Failed to clean service records');
      }
    } catch (err: any) {
      triggerNotification('error', err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        triggerNotification('success', `Order #${orderId} status shifted to ${status}`);
        loadCoreData();
      } else {
        const d = await response.json();
        triggerNotification('error', d.error || 'Action denied');
      }
    } catch (e: any) {
      triggerNotification('error', e.message);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        triggerNotification('success', lang === 'km' ? `ការកម្ម៉ង់សេវាកម្ម #${orderId} ត្រូវបានបោះបង់ និងបង្វិលសងប្រាក់វិញ!` : `Order #${orderId} cancelled successfully and refunded!`);
        loadCoreData();
      } else {
        const d = await response.json();
        triggerNotification('error', d.error || 'Unable to cancel order');
      }
    } catch (e: any) {
      triggerNotification('error', e.message);
    }
  };

  const handleDownloadDeliveryTxt = async (orderId: string, serviceName: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/download-txt`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Could not download delivery file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smm_${orderId}_delivery.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      triggerNotification('success', lang === 'km' ? 'បានទាញយកឯកសារលម្អិតជោគជ័យ!' : 'Delivery file TXT downloaded successfully!');
    } catch (e: any) {
      triggerNotification('error', `Download error: ${e.message}`);
    }
  };

  const handleFeedbackSaved = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleNotesSaved = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleSort = (field: string) => {
    if (orderSortField === field) {
      setOrderSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderSortField(field);
      setOrderSortDirection('desc');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    if (user) {
      localStorage.setItem(`smm_notifications_${user.id}`, JSON.stringify(updated));
    }
    triggerNotification('success', lang === 'km' ? 'បានសម្គាល់ថាអានរួចទាំងអស់!' : 'All notifications marked as read!');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`smm_notifications_${user.id}`);
    }
    triggerNotification('success', lang === 'km' ? 'បានលុបការជូនដំណឹងទាំងអស់!' : 'Cleared all notifications!');
  };

  const handleToggleNotificationRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setNotifications(updated);
    if (user) {
      localStorage.setItem(`smm_notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  const handleReorder = (ord: Order) => {
    const service = services.find(s => s.id === ord.serviceId) || services.find(s => s.name === ord.serviceName);
    if (service) {
      setReorderOrder(ord);
      setIsReorderOpen(true);
    } else {
      triggerNotification('error', lang === 'km' ? 'សេវាកម្មនេះមិនត្រូវបានរកឃើញនៅក្នុងកាតាឡុកទៀតទេ' : 'This service is no longer available in the catalog');
    }
  };

  const handleApproveDeposit = async (txnId: string) => {
    try {
      const response = await fetch(`/api/transactions/${txnId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        triggerNotification('success', 'Transaction approved! Balance balance credited to client wallet.');
        loadCoreData();
      } else {
        const d = await response.json();
        triggerNotification('error', d.error || 'Approval error');
      }
    } catch (e: any) {
      triggerNotification('error', e.message);
    }
  };

  const handleRejectDeposit = async (txnId: string) => {
    try {
      const response = await fetch(`/api/transactions/${txnId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        triggerNotification('success', 'Deposit claim discarded');
        loadCoreData();
      } else {
        const d = await response.json();
        triggerNotification('error', d.error || 'Rejection error');
      }
    } catch (e: any) {
      triggerNotification('error', e.message);
    }
  };

  const handleAdjustBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSelectedUser || !adjustAmountInput || isNaN(parseFloat(adjustAmountInput))) {
      triggerNotification('error', 'Select user and amount');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${adminSelectedUser.id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(adjustAmountInput),
          action: adjustAction
        })
      });

      if (response.ok) {
        triggerNotification('success', `Balance update committed successfully for user ${adminSelectedUser.username}`);
        setShowAdjustBalanceModal(false);
        setAdjustAmountInput('');
        loadCoreData();
      } else {
        const d = await response.json();
        triggerNotification('error', d.error || 'Could not alter values');
      }
    } catch (err: any) {
      triggerNotification('error', err.message);
    }
  };

  // Filter processes for service categories lists
  const uniqueCategories = Array.from(new Set(services.map(s => s.category)));

  const filteredServices = services.filter(s => {
    const matchCat = catalogCategory === 'all' || s.category === catalogCategory;
    const matchSearch = s.name.toLowerCase().includes(servicesSearchQuery.toLowerCase()) || 
                        s.category.toLowerCase().includes(servicesSearchQuery.toLowerCase()) ||
                        s.description.toLowerCase().includes(servicesSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const selectedServiceObj = services.find(s => s.id === orderServiceId);
  const calculatedCharge = selectedServiceObj && orderQuantity 
    ? parseFloat(((selectedServiceObj.price * orderQuantity) / 1000).toFixed(4))
    : 0.00;

  // Render Section
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* Visual background lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

        {/* Global Language selection row */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              lang === 'en' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-[10px]">🇺🇸</span> EN
          </button>
          <button 
            onClick={() => setLang('km')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              lang === 'km' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-[10px]">🇰🇭</span> ភាសាខ្មែរ
          </button>
        </div>

        {/* Brand Banner Header */}
        <div className="mb-8 text-center max-w-md z-10">
          <div className="inline-flex items-center gap-2.5 bg-slate-800/80 backdrop-blur border border-slate-700/60 px-4 py-2 rounded-2xl mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <span className="text-xs uppercase font-black text-slate-300 tracking-wider font-display">
              {t.brandName} Portal
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none uppercase">
            {authMode === 'login' ? t.signIn : t.register}
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            {authMode === 'login' ? t.welcomeBack : t.createAccount}
          </p>
        </div>

        {/* Portal card */}
        <div className="w-full max-w-md bg-slate-800/65 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50 z-10">
          
          {authError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex gap-2.5 items-start text-left text-red-200 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex gap-2.5 items-center text-left text-emerald-200 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-2">
                {t.username}
              </label>
              <input
                id="auth-username"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. cambo_marketer"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium placeholder-slate-500 transition-all font-mono"
                required
              />
            </div>

            <div className="text-left">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-2">
                {t.password}
              </label>
              <input
                id="auth-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 font-medium placeholder-slate-500 transition-all font-mono"
                required
              />
              <span className="text-[10px] text-slate-500 block text-right mt-1.5 font-mono">
                Min. 5 characters
              </span>
            </div>

            <button
              id="submit-auth-btn"
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all mt-3 cursor-pointer shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{authMode === 'login' ? t.signInButton : t.registerButton}</span>
              )}
            </button>
          </form>

          {/* Prompt Toggle */}
          <div className="border-t border-slate-700/50 mt-6 pt-5 text-center">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-400 font-medium">
                {t.noAccount}{' '}
                <button 
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className="text-red-400 font-black hover:underline cursor-pointer ml-1"
                >
                  {t.register}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-medium">
                {t.haveAccount}{' '}
                <button 
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className="text-red-400 font-black hover:underline cursor-pointer ml-1"
                >
                  {t.signIn}
                </button>
              </p>
            )}
          </div>

          {/* Quick Logon Hints */}
          <div className="mt-6 bg-slate-900/60 rounded-xl p-3 border border-slate-700/30 text-left">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block mb-1">
              Test accounts preloaded (No register required):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
              <div>
                <span className="text-indigo-400 font-bold">Admin Store:</span><br/>
                Username: <code className="text-white">admin</code><br/>
                Password: <code className="text-white">admin123</code>
              </div>
              <div>
                <span className="text-red-400 font-bold">Standard Store:</span><br/>
                Username: <code className="text-white">user</code><br/>
                Password: <code className="text-white">user123</code> <span className="text-[10px] text-slate-500">($50 free)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Dashboard Layout with Dynamic Sorting
  const filteredOrders = orders
    .filter((ord) => orderFilter === 'all' || ord.status === orderFilter)
    .filter((ord) => {
      if (!orderSearchQuery) return true;
      const query = orderSearchQuery.toLowerCase();
      const serviceName = (ord.serviceName || '').toLowerCase();
      const orderId = (ord.id || '').toLowerCase();
      return serviceName.includes(query) || orderId.includes(query);
    })
    .sort((a, b) => {
      let valA: any = a[orderSortField as keyof Order];
      let valB: any = b[orderSortField as keyof Order];

      if (orderSortField === 'id') {
        valA = a.id || '';
        valB = b.id || '';
      } else if (orderSortField === 'serviceName') {
        valA = a.serviceName || '';
        valB = b.serviceName || '';
      } else if (orderSortField === 'link') {
        valA = a.link || '';
        valB = b.link || '';
      } else if (orderSortField === 'quantity') {
        valA = Number(a.quantity) || 0;
        valB = Number(b.quantity) || 0;
      } else if (orderSortField === 'charge') {
        valA = Number(a.charge) || 0;
        valB = Number(b.charge) || 0;
      } else if (orderSortField === 'createdAt') {
        valA = new Date(a.createdAt).getTime() || 0;
        valB = new Date(b.createdAt).getTime() || 0;
      } else if (orderSortField === 'status') {
        valA = a.status || '';
        valB = b.status || '';
      }

      if (valA < valB) return orderSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return orderSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const SortableHeader = ({ field, label, alignRight = false, isLeftPadding = false }: { field: string; label: string; alignRight?: boolean; isLeftPadding?: boolean }) => {
    const isActive = orderSortField === field;
    return (
      <th 
        onClick={() => handleSort(field)}
        className={`pb-3 ${alignRight ? 'text-right pr-2' : ''} ${isLeftPadding ? 'pl-2' : ''} cursor-pointer group hover:text-slate-700 select-none transition-colors font-bold uppercase tracking-wider text-[10px] text-slate-400`}
      >
        <div className={`inline-flex items-center gap-1 ${alignRight ? 'justify-end w-full' : 'justify-start'}`}>
          <span>{label}</span>
          <span className={`inline-flex items-center transition-all duration-200 ${isActive ? 'text-blue-500 font-extrabold opacity-100 scale-105' : 'text-slate-300 opacity-40 group-hover:opacity-85'}`}>
            {isActive ? (
              orderSortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-500 font-bold" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-500 font-bold" />
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-[#1e293b] text-slate-300 flex-col border-r border-slate-800 shrink-0 h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">S</div>
            <span className="text-xl font-bold text-white tracking-tight font-display">SMM PRO<span className="text-blue-400">.IO</span></span>
          </div>
          <nav className="space-y-1 flex-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-xs font-bold font-sans cursor-pointer text-left ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.dashboard}</span>
            </button>
            <button
              onClick={() => setActiveTab('new-order')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-xs font-bold font-sans cursor-pointer text-left ${
                activeTab === 'new-order' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.newOrder}</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-xs font-bold font-sans cursor-pointer text-left ${
                activeTab === 'services' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.services}</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-xs font-bold font-sans cursor-pointer text-left ${
                activeTab === 'history' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t.orderHistory}</span>
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-xs font-bold font-sans cursor-pointer text-left ${
                activeTab === 'wallet' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>{t.walletDeposit}</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-xs font-bold font-sans cursor-pointer text-left ${
                  activeTab === 'admin' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t.adminPanel}</span>
              </button>
            )}
          </nav>
          
          <div className="mt-auto border-t border-slate-800 pt-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-705 border-slate-750 border-slate-700">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">{t.currentBalance}</p>
              <p className="text-xl font-bold text-white font-mono">${user?.balance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Mobile Header Navigation strip */}
        <header className="lg:hidden h-16 bg-[#1e293b] text-slate-300 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-md font-bold text-white tracking-tight">SMM PRO</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                  showNotificationsDropdown ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/55'
                }`}
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#1e293b]" />
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-3 w-72 bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 divide-y divide-slate-100 flex flex-col">
                  <div className="p-3 bg-slate-50 flex items-center justify-between">
                    <span className="font-extrabold text-slate-905 text-slate-900 text-[10px] uppercase tracking-wide">Mobile Alerts</span>
                    <div className="flex gap-1.5">
                      {notifications.length > 0 && (
                        <>
                          <button
                            onClick={handleMarkAllNotificationsRead}
                            className="text-[9px] text-blue-650 hover:text-blue-800 font-extrabold uppercase cursor-pointer"
                          >
                            Read All
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            onClick={handleClearAllNotifications}
                            className="text-[9px] text-slate-400 hover:text-slate-600 font-extrabold uppercase cursor-pointer"
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 flex flex-col">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-[10px] text-slate-400 font-medium">No alerts registered yet.</div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={(e) => handleToggleNotificationRead(notif.id, e)}
                          className={`p-3 text-left transition-colors cursor-pointer flex gap-2 ${
                            notif.read ? 'bg-white hover:bg-slate-50/50' : 'bg-blue-50/20 hover:bg-blue-50/40 border-l-2 border-blue-500'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-850 line-clamp-1">{notif.serviceName}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">
                              Order <strong className="font-mono">#{notif.orderId}</strong> transitioned to <span className="font-bold text-slate-705 uppercase">{notif.newStatus}</span>
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <select 
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-sans font-semibold cursor-pointer outline-none"
            >
              <option value="dashboard">{t.dashboard}</option>
              <option value="new-order">{t.newOrder}</option>
              <option value="services">{t.services}</option>
              <option value="history">{t.orderHistory}</option>
              <option value="wallet">{t.walletDeposit}</option>
              {user?.role === 'admin' && <option value="admin">{t.adminPanel}</option>}
            </select>
            <button
              onClick={handleLogout}
              className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Regular Header Bar (High Density Theme) */}
        <header className="h-16 bg-white border-b border-slate-200 hidden lg:flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              {activeTab === 'dashboard' ? t.dashboard :
               activeTab === 'new-order' ? t.newOrder :
               activeTab === 'services' ? t.services :
               activeTab === 'history' ? t.orderHistory :
               activeTab === 'wallet' ? t.walletDeposit : t.adminPanel}
            </h2>
            <span className="px-2 py-0.5 bg-green-100/80 border border-green-200 text-green-700 text-[10px] font-black tracking-widest uppercase rounded">API STATUS: ONLINE</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">LANGUAGE</span>
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-all ${
                    lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('km')} 
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-all ${
                    lang === 'km' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  KH
                </button>
              </div>
            </div>

            {/* In-app Notification System Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer relative hover:scale-[1.05] active:scale-[0.95] ${
                  showNotificationsDropdown 
                    ? 'bg-blue-55 bg-blue-50 text-blue-650 border border-blue-200' 
                    : 'bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-800'
                }`}
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fade-in divide-y divide-slate-100 flex flex-col">
                  {/* Dropdown Header */}
                  <div className="p-4 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider block">Store Alerts</h3>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        {notifications.filter(n => !n.read).length} unread updates
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {notifications.length > 0 && (
                        <>
                          <button
                            onClick={handleMarkAllNotificationsRead}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-extrabold uppercase tracking-wide cursor-pointer"
                          >
                            Read All
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={handleClearAllNotifications}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-extrabold uppercase tracking-wide cursor-pointer"
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Scrollable Notifications List */}
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 flex flex-col">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Bell className="w-5 h-5 opacity-60" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">No alerts registered yet</p>
                        <p className="text-[9px] text-slate-400 italic">We'll alert you here when your order status progresses!</p>
                      </div>
                    ) : (
                      notifications.slice(0, 15).map((notif) => {
                        const isCompleted = notif.newStatus === 'completed';
                        const isCancelled = notif.newStatus === 'cancelled';
                        const isProcessing = notif.newStatus === 'processing';
                        return (
                          <div 
                            key={notif.id} 
                            onClick={(e) => handleToggleNotificationRead(notif.id, e)}
                            className={`p-3.5 transition-colors cursor-pointer text-left flex gap-3 ${
                              notif.read ? 'bg-white hover:bg-slate-50/40' : 'bg-blue-50/20 hover:bg-blue-50/40 border-l-2 border-blue-500'
                            }`}
                          >
                            <div className="mt-0.5">
                              {isCompleted ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </div>
                              ) : isCancelled ? (
                                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                              ) : isProcessing ? (
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                  <Bell className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-slate-800 line-clamp-1">
                                {notif.serviceName}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                                Order <strong className="font-mono text-slate-700">#{notif.orderId}</strong> transitioned to{' '}
                                <span className={`font-semibold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                                  isCompleted ? 'bg-emerald-100 text-emerald-700' :
                                  isCancelled ? 'bg-red-100 text-red-700' :
                                  isProcessing ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {notif.newStatus}
                                </span>
                              </p>
                              <span className="text-[8px] text-slate-400 block mt-1">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">@{user?.username}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user?.role} Store Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-150 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-black text-sm uppercase">
                {user?.username ? user.username.slice(0, 2) : 'SK'}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors cursor-pointer ml-1"
                title={t.logout}
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Global Toast Notification block */}
        {notification && (
          <div className={`fixed bottom-6 left-6 z-50 rounded-2xl p-4 shadow-2xl flex items-start gap-3 max-w-sm transition-all duration-300 transform translate-y-0 ${
            notification.type === 'success' 
              ? 'bg-emerald-900/95 text-emerald-100 border border-emerald-500/40' 
              : 'bg-red-900/95 text-red-100 border border-red-500/40'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-300" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-300" />
            )}
            <div className="text-left text-xs font-medium">
              <span className="font-bold block uppercase mb-0.5">
                {notification.type === 'success' ? 'Task Completed' : 'Operation Alert'}
              </span>
              <p>{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-white/60 hover:text-white shrink-0 ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable Workspace Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc] flex flex-col justify-between">
          <div>
            {/* Loading Spinner */}
            {isLoading && (
              <div className="mb-6 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2 shadow-sm text-xs font-bold text-slate-600 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Synchronizing store tables...</span>
              </div>
            )}

        {/* Dynamic Navigation Tabs Content renders here */}

        {/* 1. Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in text-left">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                {t.dashboard}
              </h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                Overview of SMM metrics & wallet summary
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Wallet Card */}
              <div 
                onClick={() => setActiveTab('wallet')}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md shadow-slate-100/30 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full translate-x-6 -translate-y-6 shrink-0 group-hover:scale-105 transition-transform"></div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.currentBalance}</span>
                <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-1">${user?.balance.toFixed(2)}</p>
              </div>

              {/* Total Orders Card */}
              <div 
                onClick={() => setActiveTab('history')}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md shadow-slate-100/30 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full translate-x-6 -translate-y-6 shrink-0 group-hover:scale-105 transition-transform"></div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <History className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.totalOrders}</span>
                <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-1">{stats?.totalOrders || 0}</p>
              </div>

              {/* Total Spent Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md shadow-slate-100/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/5 rounded-full translate-x-6 -translate-y-6 shrink-0"></div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Coins className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.totalSpent}</span>
                <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-1">${stats?.totalSpent.toFixed(2) || '0.00'}</p>
              </div>

              {/* Available Services Count */}
              <div 
                onClick={() => setActiveTab('services')}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md shadow-slate-100/30 relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full translate-x-6 -translate-y-6 shrink-0 group-hover:scale-105 transition-transform"></div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.servicesCount}</span>
                <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-1">{stats?.servicesCount || 0}</p>
              </div>

            </div>

            {/* Quick Create Order Promo and Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              
              {/* Promo Banner Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-3xl p-6 text-white border border-slate-800 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-44 h-44 bg-red-600/10 rounded-full translate-x-8 translate-y-8 pointer-events-none"></div>
                <div>
                  <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-display font-medium text-[11px] uppercase tracking-wider rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Angkor VIP Client Deal
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase font-display">
                    Instantly grow your social coordinates!
                  </h3>
                  <p className="text-slate-400 text-xs mt-2.5 leading-relaxed font-medium">
                    Our servers provide lightning-fast, drop-resistant follower profiles, post-likes, viral viewer loops, and YouTube metric batches starting at only $0.15 per 1,000 deliveries.
                  </p>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => setActiveTab('new-order')}
                    className="bg-red-650 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 w-full sm:w-auto rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer transition-all bg-red-600"
                  >
                    <span>{t.newOrder}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Guide/Support Panel */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md shadow-slate-100/30 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase font-display">How To Use Angkor Page Panel</h3>
                  <div className="mt-4 space-y-4 text-xs font-medium text-slate-600">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600 shrink-0">1</div>
                      <p className="text-left mt-0.5">Top up your balance on the **Wallet Deposit** tab using the provided EMVCo KHQR code.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">2</div>
                      <p className="text-left mt-0.5">Place a new order on the **New Order** page by selecting your platform, category, URL target, and desired quantity metric.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 shrink-0">3</div>
                      <p className="text-left mt-0.5">Track the automation status in real time on the **Order History** dashboard.</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-5 pt-4">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block text-left mb-2">Need strategic growth tips?</span>
                  <button 
                    onClick={() => {
                      // Trigger AI Copilot visually
                      const aiBtn = document.getElementById('trigger-ai-copilot');
                      if (aiBtn) aiBtn.click();
                    }}
                    className="text-xs text-indigo-600 font-extrabold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Bot className="w-4 h-4 text-indigo-505" /> Chat with AI Campaign Copilot &rarr;
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Orders List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md shadow-slate-100/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-extrabold text-slate-900 uppercase font-display">Recent Activity Logs</h3>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-6 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                  <TrendingUp className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium font-sans">No order logs yet. Launch your first SMM campaign above!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-medium text-slate-600 text-left">
                    <thead>
                      <tr className="border-b border-slate-100 pb-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">{t.orderId}</th>
                        <th className="pb-3">{t.serviceName}</th>
                        <th className="pb-3">{t.quantity}</th>
                        <th className="pb-3">{t.charge}</th>
                        <th className="pb-3 text-right">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 3).map((ord) => {
                        const isExpanded = !!expandedOrders[ord.id];
                        return (
                          <React.Fragment key={ord.id}>
                            <tr 
                              onClick={(e) => {
                                if (
                                  (e.target as HTMLElement).closest('button') || 
                                  (e.target as HTMLElement).closest('a')
                                ) {
                                  return;
                                }
                                setExpandedOrders(prev => ({ ...prev, [ord.id]: !prev[ord.id] }));
                              }}
                              className={`order-history-table-row border-b border-slate-50 last:border-0 hover:bg-white hover:scale-[1.01] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative z-0 hover:z-10 ${
                                isExpanded ? 'bg-slate-50/80 font-bold' : ''
                              }`}
                            >
                              <td className="py-3.5 font-mono text-slate-900 font-bold">
                                <div className="flex items-center gap-1">
                                  <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-blue-500 font-bold' : ''}`} />
                                  <span>{ord.id}</span>
                                </div>
                              </td>
                              <td className="py-3.5 max-w-xs truncate">{ord.serviceName}</td>
                              <td className="py-3.5 font-mono">{ord.quantity.toLocaleString()}</td>
                              <td className="py-3.5 font-bold font-mono text-slate-900">${ord.charge.toFixed(3)}</td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase ${
                                    ord.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                    ord.status === 'processing' ? 'bg-sky-50 text-sky-700 border border-sky-100 animate-pulse' :
                                    ord.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                    'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}>
                                    {ord.status}
                                  </span>
                                  {ord.status === 'pending' && (
                                    <button
                                      onClick={() => handleCancelOrder(ord.id)}
                                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold border border-red-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-1"
                                      title="Cancel and Refund"
                                    >
                                      {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-slate-50/55 border-b border-slate-150">
                                <td colSpan={5} className="px-3 py-3 text-left">
                                  <div className="flex flex-col gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                                            {ord.deliveredItems ? (lang === 'km' ? 'ប្រភេទការលក់' : 'Sale Type') : (lang === 'km' ? 'ចំនួនចាប់ផ្តើម' : 'Start Count')}
                                          </span>
                                          <span className="font-sans font-bold text-slate-700 text-[11px]">
                                            {ord.deliveredItems ? (lang === 'km' ? 'ទំនិញលក់ឌីជីថល' : 'Digital Product') : (ord.startCount !== undefined ? ord.startCount.toLocaleString() : '1,280')}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                                            {lang === 'km' ? 'ពេលវេលាបញ្ចប់' : 'Completion Time'}
                                          </span>
                                          <span className="font-sans font-bold text-slate-600 text-[11px]">
                                            {ord.status === 'completed' 
                                              ? (ord.completedAt ? new Date(ord.completedAt).toLocaleString() : new Date(new Date(ord.createdAt).getTime() + 45 * 60000).toLocaleString())
                                              : ord.status === 'cancelled'
                                              ? (lang === 'km' ? 'បានបោះបង់' : 'Cancelled')
                                              : (lang === 'km' ? 'កំពុងដំណើរការ...' : 'In progress')}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <button
                                          onClick={() => handleReorder(ord)}
                                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-1 text-[11px]"
                                        >
                                          <RefreshCw className="w-3 h-3" />
                                          <span>{lang === 'km' ? 'ទិញម្តងទៀត' : 'Reorder'}</span>
                                        </button>
                                      </div>
                                    </div>

                                    {ord.deliveredItems && ord.deliveredItems.length > 0 && (
                                      <div className="mt-1 p-3 bg-indigo-50/75 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-left">
                                        <div className="font-sans">
                                          <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wide block">Digital Delivery Output File</span>
                                          <strong className="text-slate-800 font-mono block mt-0.5">
                                            smm_delivery_{ord.id}.txt ({ord.deliveredItems.length} Accounts Included)
                                          </strong>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <button
                                            onClick={() => {
                                              const textToCopy = ord.deliveredItems ? ord.deliveredItems.join('\n') : '';
                                              navigator.clipboard.writeText(textToCopy);
                                              triggerNotification('success', lang === 'km' ? 'បានចម្លងព័ត៌មានលម្អិតគណនី!' : 'Credentials copied to clipboard!');
                                            }}
                                            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-[10px] hover:scale-[1.02] transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                          >
                                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                                            <span>{lang === 'km' ? 'ចម្លងព័ត៌មានលម្អិត' : 'Copy Credentials'}</span>
                                          </button>
                                          <button
                                            onClick={() => handleDownloadDeliveryTxt(ord.id, ord.serviceName || 'Product')}
                                            className="px-3.5 py-1.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] hover:scale-[1.02] transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-slate-900/10"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                                            <span>{lang === 'km' ? 'ទាញយកឯកសារលម្អិត (.txt)' : 'Download credentials (.txt)'}</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {ord.status === 'completed' && (
                                      <OrderFeedbackPanel 
                                        order={ord}
                                        orders={orders}
                                        token={token || ''}
                                        lang={lang}
                                        onFeedbackSaved={handleFeedbackSaved}
                                        triggerNotification={triggerNotification}
                                      />
                                    )}

                                    <OrderNotesPanel
                                      order={ord}
                                      token={token || ''}
                                      lang={lang}
                                      onNotesSaved={handleNotesSaved}
                                      triggerNotification={triggerNotification}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. New Order Tab */}
        {activeTab === 'new-order' && (
          <div className="space-y-8 animate-fade-in text-left max-w-3xl mx-auto">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                {t.newOrder}
              </h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                Configure your social platform boost metrics
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-100/40">
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                
                {/* Category selectors */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    {t.chooseCategory}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uniqueCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setOrderCategory(cat)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-extrabold text-center cursor-pointer border transition-all truncate ${
                          orderCategory === cat 
                            ? 'bg-red-50 text-red-600 border-red-500 shadow-sm shadow-red-500/10' 
                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service selector */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    {t.selectService}
                  </label>
                  <select
                    id="order-service-select"
                    value={orderServiceId}
                    onChange={(e) => {
                      setOrderServiceId(e.target.value);
                      const svc = services.find(s => s.id === e.target.value);
                      if (svc) setOrderQuantity(svc.min);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
                    required
                  >
                    {services
                      .filter(s => s.category === orderCategory)
                      .map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} - ${s.price.toFixed(2)} USD {s.isProduct ? 'each (Instant Delivery)' : 'per 1,000'}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Service guidelines visualizer card */}
                {selectedServiceObj && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150/50 text-left">
                    <span className="text-[10px] text-indigo-600 uppercase tracking-widest font-black block mb-1.5">SERVICE GUIDELINES:</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{selectedServiceObj.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-3 border-t border-slate-200/50 pt-2.5 text-[11px] font-mono text-slate-500">
                      <div>Minimum: <span className="text-slate-800 font-bold">{selectedServiceObj.min.toLocaleString()} qty</span></div>
                      <div>Maximum: <span className="text-slate-800 font-bold">{selectedServiceObj.max.toLocaleString()} qty</span></div>
                    </div>
                  </div>
                )}

                {/* Target Link input */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    {selectedServiceObj?.isProduct 
                      ? (lang === 'km' ? 'អាសយដ្ឋានអ៊ីមែលទទួល ឬទទេ' : 'Your Email / Notes (Optional)') 
                      : t.targetLink}
                  </label>
                  <input
                    id="order-link-input"
                    type={selectedServiceObj?.isProduct ? "text" : "url"}
                    value={orderLink}
                    onChange={(e) => setOrderLink(e.target.value)}
                    placeholder={selectedServiceObj?.isProduct 
                      ? (lang === 'km' ? 'ទុកទេរក្សាលំនាំដើមសម្រាប់ការទាញយក TXT ផ្ទាល់' : 'Leave blank for direct TXT download link, or enter email') 
                      : t.linkPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-sans"
                    required={!selectedServiceObj?.isProduct}
                  />
                </div>

                {/* Quantity Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      {t.orderQuantity}
                    </label>
                    <input
                      id="order-quantity-input"
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 0)}
                      step="50"
                      min={selectedServiceObj?.min || 1}
                      max={selectedServiceObj?.max || 1000000}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
                      required
                    />
                  </div>

                  {/* Calculated charge breakdown */}
                  <div className="bg-red-50/40 rounded-2xl p-4 border border-red-100 flex flex-col justify-center">
                    <span className="text-[10px] text-red-600 uppercase tracking-widest font-black block leading-none">{t.estimatedCost}</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-black text-slate-900 font-mono">${calculatedCharge.toFixed(3)}</span>
                      <span className="text-xs font-bold text-slate-400">USD</span>
                    </div>
                    {user && user.balance < calculatedCharge && (
                      <span className="text-[10px] text-red-600 font-bold mt-1 block">
                        ⚠️ Not enough balance. Top up ${ (calculatedCharge - user.balance).toFixed(2) } USD.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  id="submit-order-button"
                  type="submit"
                  disabled={!selectedServiceObj || !orderLink.trim() || orderQuantity <= 0 || (user ? user.balance < calculatedCharge : true)}
                  className="w-full bg-gradient-to-r from-red-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg hover:scale-102 transition-all cursor-pointer disabled:opacity-40 disabled:hover:scale-100"
                >
                  {t.placeOrderButton}
                </button>

              </form>
            </div>
          </div>
        )}

        {/* 3. Services Directory Tab */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-display">
                  {t.services}
                </h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  Active server catalogs & prices per 1,000 items
                </p>
              </div>

              {/* Filters Panel Row */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                
                {/* Search field */}
                <div className="relative">
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute top-3.5 left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={servicesSearchQuery}
                    onChange={(e) => setServicesSearchQuery(e.target.value)}
                    placeholder="Search follower, views..."
                    className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 font-medium w-full sm:w-56"
                  />
                </div>

                {/* Category Select Filters */}
                <select
                  value={catalogCategory}
                  onChange={(e) => setCatalogCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold cursor-pointer"
                >
                  <option value="all">{t.allCategories}</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(svc => (
                <div key={svc.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md shadow-slate-100/30 flex flex-col justify-between hover:shadow-lg transition-transform hover:-translate-y-1">
                  <div>
                    {/* Badge Category */}
                    <span className="text-[9px] bg-red-50 text-red-600 font-black tracking-wider uppercase border border-red-100 rounded px-2 py-0.5">
                      {svc.category}
                    </span>
                    <h3 className="text-[14px] font-extrabold text-slate-900 mt-3 font-display leading-tight">{svc.name}</h3>
                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-sans">{svc.description}</p>
                  </div>

                  <div className="border-t border-slate-50 mt-5 pt-4">
                    <div className="flex justify-between items-baseline mb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">{t.pricePer1000}</span>
                        <div className="flex items-baseline gap-0.5 mt-0.5">
                          <span className="text-xl font-black text-slate-905 text-slate-900 font-mono">${svc.price.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">USD</span>
                        </div>
                      </div>

                      <div className="text-right text-[10px] text-slate-400 font-mono space-y-0.5">
                        <div>Min: <span className="font-bold text-slate-700">{svc.min.toLocaleString()}</span></div>
                        <div>Max: <span className="font-bold text-slate-700">{svc.max.toLocaleString()}</span></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setOrderCategory(svc.category);
                        setTimeout(() => {
                          setOrderServiceId(svc.id);
                          setOrderQuantity(svc.min);
                          setActiveTab('new-order');
                        }, 50);
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Create Campaign</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="py-12 bg-white rounded-3xl border border-slate-100 text-center text-slate-400 font-medium">
                <Layers className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-xs">No services matched your query.</p>
              </div>
            )}

          </div>
        )}

        {/* 4. Order History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-fade-in text-left">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                {t.orderHistory}
              </h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                Monitor status of your social media order transactions
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
              {orders.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-xs font-semibold">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Status Filter & Search Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {lang === 'km' ? 'តម្រងស្ថានភាពកម្ម៉ង់' : 'Filter Order Status'}
                      </span>
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {filteredOrders.length} {lang === 'km' ? 'កម្ម៉ង់ត្រូវបានរកឃើញ' : 'orders match'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                      {/* Real-time Search Input */}
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          placeholder={lang === 'km' ? 'ស្វែងរកលេខកូដ ឬឈ្មោះសេវាកម្ម...' : 'Search Order ID or Service...'}
                          className="w-full bg-white text-slate-800 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200 font-sans outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all h-[36px]"
                        />
                        {orderSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setOrderSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] uppercase font-black tracking-wider transition-colors cursor-pointer select-none"
                          >
                            {lang === 'km' ? 'សម្អាត' : 'Clear'}
                          </button>
                        )}
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center">
                        <select
                          id="order-status-filter-select"
                          value={orderFilter}
                          onChange={(e) => setOrderFilter(e.target.value)}
                          className="w-full sm:w-auto bg-white text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 font-sans font-bold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all h-[36px]"
                        >
                          <option value="all">{lang === 'km' ? 'គ្រប់ស្ថានភាពទាំងអស់ (All)' : 'All Orders'}</option>
                          <option value="pending">{lang === 'km' ? 'កំពុងរង់ចាំ (Pending)' : 'Pending'}</option>
                          <option value="processing">{lang === 'km' ? 'កំពុងដំណើរការ (Processing)' : 'Processing'}</option>
                          <option value="completed">{lang === 'km' ? 'បានជោគជ័យ (Completed)' : 'Completed'}</option>
                          <option value="cancelled">{lang === 'km' ? 'បានបោះបង់ (Cancelled)' : 'Cancelled'}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-xs font-semibold">
                        {lang === 'km' 
                          ? `មិនមានការកម្ម៉ង់ដែលមានស្ថានភាព '${orderFilter}' ឡើយ។` 
                          : `No orders found with status '${orderFilter}'.`}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 p-2">
                      <table className="w-full text-xs font-medium text-slate-600 text-left min-w-[650px]">
                        <thead>
                          <tr className="border-b border-slate-100 pb-3 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <SortableHeader field="id" label={t.orderId} isLeftPadding={true} />
                            <SortableHeader field="serviceName" label={t.serviceName} />
                            <SortableHeader field="link" label={t.targetLink} />
                            <SortableHeader field="quantity" label={t.quantity} />
                            <SortableHeader field="charge" label={t.charge} />
                            <SortableHeader field="createdAt" label={t.date} />
                            <SortableHeader field="status" label={t.status} alignRight={true} />
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((ord) => {
                            const isExpanded = !!expandedOrders[ord.id];
                            return (
                              <React.Fragment key={ord.id}>
                                <tr 
                                  onClick={(e) => {
                                    if (
                                      (e.target as HTMLElement).closest('button') || 
                                      (e.target as HTMLElement).closest('a')
                                    ) {
                                      return;
                                    }
                                    setExpandedOrders(prev => ({ ...prev, [ord.id]: !prev[ord.id] }));
                                  }}
                                  className={`order-history-table-row border-b border-slate-50 hover:bg-white hover:scale-[1.01] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 last:border-0 cursor-pointer relative z-0 hover:z-10 ${
                                    isExpanded ? 'bg-slate-50/80 font-bold' : ''
                                  }`}
                                >
                                  <td className="py-4 pl-2 font-mono font-bold text-slate-900">
                                    <div className="flex items-center gap-1.5">
                                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-blue-500 font-bold' : ''}`} />
                                      <span>{ord.id}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 max-w-xs truncate font-medium text-slate-850 text-slate-700">{ord.serviceName}</td>
                                  <td className="py-4 font-mono max-w-44 truncate">
                                    <a href={ord.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                                      {ord.link}
                                    </a>
                                  </td>
                                  <td className="py-4 font-mono">{ord.quantity.toLocaleString()}</td>
                                  <td className="py-4 font-black font-mono text-slate-900 shadow-3xs">${ord.charge.toFixed(3)}</td>
                                  <td className="py-4 text-slate-400 font-mono text-[11px]">{new Date(ord.createdAt).toLocaleDateString()}</td>
                                  <td className="py-4 text-right pr-2">
                                    <div className="flex items-center justify-end gap-2">
                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase ${
                                        ord.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                        ord.status === 'processing' ? 'bg-sky-50 text-sky-700 border border-sky-100 animate-pulse' :
                                        ord.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-100' :
                                        'bg-amber-50 text-amber-700 border border-amber-100'
                                      }`}>
                                        {ord.status}
                                      </span>
                                      {ord.status === 'pending' && (
                                        <button
                                          onClick={() => handleCancelOrder(ord.id)}
                                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold border border-red-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-1"
                                          title="Cancel and Refund"
                                        >
                                          {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className="bg-slate-50/55 border-b border-slate-100">
                                    <td colSpan={7} className="px-4 py-4 text-left">
                                      <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 col-span-2">
                                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                                {ord.deliveredItems ? (lang === 'km' ? 'ប្រភេទនៃសេវាកម្ម' : 'Sale Type') : (lang === 'km' ? 'ចំនួនចាប់ផ្តើម' : 'Start Count')}
                                              </span>
                                              <span className="font-sans font-bold text-sm text-slate-800">
                                                {ord.deliveredItems ? (lang === 'km' ? 'សេវាកម្មទំនិញឌីជីថល' : 'Digital Product (Instant Delivery)') : (ord.startCount !== undefined ? ord.startCount.toLocaleString() : '1,280')}
                                              </span>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                                {lang === 'km' ? 'ពេលវេលាបញ្ចប់' : 'Completion Time'}
                                              </span>
                                              <span className="font-sans font-bold text-xs text-slate-700">
                                                {ord.status === 'completed' 
                                                  ? (ord.completedAt ? new Date(ord.completedAt).toLocaleString() : new Date(new Date(ord.createdAt).getTime() + 45 * 60000).toLocaleString())
                                                  : ord.status === 'cancelled'
                                                  ? (lang === 'km' ? 'បានបោះបង់' : 'Order Cancelled')
                                                  : (lang === 'km' ? 'កំពុងដំណើរការ...' : 'In progress (Est. ~15-60 min)')}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex justify-end pr-2">
                                            <button
                                              onClick={() => handleReorder(ord)}
                                              className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs"
                                            >
                                              <RefreshCw className="w-3.5 h-3.5" />
                                              <span>{lang === 'km' ? 'ទិញម្តងទៀត' : 'Reorder Service'}</span>
                                            </button>
                                          </div>
                                        </div>

                                        {ord.deliveredItems && ord.deliveredItems.length > 0 && (
                                          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="space-y-1 flex-1 min-w-0">
                                              <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-wider block text-left">Credential Access Panel</span>
                                              <strong className="text-slate-800 font-mono text-xs block text-left">
                                                🔑 File: smm_delivery_{ord.id}.txt ({ord.deliveredItems.length} accounts / lines)
                                              </strong>
                                              <div className="bg-slate-900 rounded-xl p-3 border border-slate-850 max-h-24 overflow-y-auto font-mono text-[10px] text-slate-300 mt-2 space-y-1 select-all text-left">
                                                {ord.deliveredItems.map((line, idx) => (
                                                  <div key={idx} className="border-b border-slate-800/50 pb-1 last:border-0 last:pb-0 font-bold">{line}</div>
                                                ))}
                                              </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2 self-stretch md:self-end w-full md:w-auto shrink-0">
                                              <button
                                                onClick={() => {
                                                  const textToCopy = ord.deliveredItems ? ord.deliveredItems.join('\n') : '';
                                                  navigator.clipboard.writeText(textToCopy);
                                                  triggerNotification('success', lang === 'km' ? 'បានចម្លងព័ត៌មានលម្អិតគណនី!' : 'Credentials copied to clipboard!');
                                                }}
                                                className="w-full md:w-auto px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm"
                                              >
                                                <Copy className="w-4 h-4 text-slate-500" />
                                                <span>{lang === 'km' ? 'ចម្លងព័ត៌មានលម្អិត' : 'Copy Credentials'}</span>
                                              </button>
                                              <button
                                                onClick={() => handleDownloadDeliveryTxt(ord.id, ord.serviceName || 'Product')}
                                                className="w-full md:w-auto px-5 py-3 bg-slate-950 hover:bg-slate-850 text-white font-extrabold rounded-xl text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/40 shrink-0"
                                              >
                                                <FileText className="w-4 h-4 text-emerald-400" />
                                                <span>{lang === 'km' ? 'ទាញយកឯកសារលម្អិត (.txt)' : 'Download Credentials (.txt)'}</span>
                                              </button>
                                            </div>
                                          </div>
                                        )}

                                        {ord.status === 'completed' && (
                                          <OrderFeedbackPanel 
                                            order={ord}
                                            orders={orders}
                                            token={token || ''}
                                            lang={lang}
                                            onFeedbackSaved={handleFeedbackSaved}
                                            triggerNotification={triggerNotification}
                                          />
                                        )}

                                        <OrderNotesPanel
                                          order={ord}
                                          token={token || ''}
                                          lang={lang}
                                          onNotesSaved={handleNotesSaved}
                                          triggerNotification={triggerNotification}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Wallet & Deposit Tab (KHQR payment) */}
        {activeTab === 'wallet' && (
          <div className="space-y-8 animate-fade-in text-left max-w-4xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-display">
                  {t.walletDeposit}
                </h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                  Recharge SMM budget using Bakong KHQR
                </p>
              </div>

              {/* Instant balance widget */}
              <div className="bg-slate-950 rounded-2xl p-4 text-white border border-slate-800 flex justify-between items-center sm:max-w-xs sm:ml-auto w-full shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white">
                    <Wallet className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none block">Wallet Status</span>
                    <span className="text-xs font-semibold text-slate-200 mt-1 block">@{user?.username}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black font-mono text-amber-400">${user?.balance.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">USD</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
              
              {/* Payment Input Column */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-xl flex flex-col justify-between space-y-6">
                
                <form onSubmit={handleGenerateKHQR} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      {t.enterAmount}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 font-bold text-slate-400 text-sm">$</span>
                      <input
                        id="deposit-amount-input"
                        type="number"
                        step="0.10"
                        min="1.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="10.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 font-mono font-bold text-slate-900"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1.5 leading-normal">
                      Minimum deposit is **$1.00 USD**. No fee is charged for deposits.
                    </span>
                  </div>

                  <button
                    id="generate-khqr-btn"
                    type="submit"
                    className="w-full bg-red-650 hover:bg-slate-900 hover:text-white bg-red-600 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4 text-red-105" />
                    <span>Generate SMM KHQR Code</span>
                  </button>
                </form>

                {/* Simulated Notification Box or Webhook Simulation Controls */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 text-left">
                    <span className="text-[10px] text-indigo-700 uppercase font-black tracking-wider block mb-1">
                      💡 {t.simulateWebhookBtn}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1.5">
                      {t.simulateWebhookDesc} Click below to instantly top up your wallet simulating real Cambodia payment gateways!
                    </p>
                    <button
                      id="trigger-webhook-btn"
                      onClick={triggerAutomatedWebhookSimulation}
                      disabled={isSimulatingWebhook}
                      className="mt-3.5 bg-indigo-650 hover:bg-slate-900 hover:text-white bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isSimulatingWebhook ? (
                        <Loader2 className="w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      <span>Simulate KHQR Webhook</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Dynamic QR generation Preview Column */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-xl flex flex-col justify-center items-center text-center">
                {showKHQRFrame ? (
                  <div className="space-y-5 w-full">
                    
                    <KHQRGenerator 
                      amount={parseFloat(depositAmount) || 10} 
                      referenceCode={curKHQRRef}
                    />

                    {/* Claim submission widget */}
                    <div className="space-y-2.5 max-w-[280px] mx-auto">
                      <p className="text-[11px] text-slate-500 font-sans leading-normal">
                        Scan & pay above, then click submit to register your pending verification code with our systems manually.
                      </p>
                      <button
                        id="submit-deposit-claim-btn"
                        onClick={handleSubmitDepositClaim}
                        className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-xl cursor-pointer transition-colors"
                      >
                        {t.submitDepositBtn}
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-slate-400 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-350">
                      <CreditCard className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">{t.scanToPayTitle}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                        {t.paymentMethodSub}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Deposit histories logs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl text-left">
              <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-wide font-display mb-4">Deposit History Claims</h3>
              
              {transactions.filter(t => t.type === 'deposit').length === 0 ? (
                <div className="py-8 border-2 border-dashed border-slate-100 rounded-2xl text-center text-slate-400 text-xs">
                  <CreditCard className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  No deposit claims submitted yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-medium text-slate-600 text-left">
                    <thead>
                      <tr className="border-b border-slate-100 pb-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Invoice Txn ID</th>
                        <th className="pb-3">Deposit Value</th>
                        <th className="pb-3">Ref Code ID</th>
                        <th className="pb-3">Registered Date</th>
                        <th className="pb-3 text-right">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.filter(t => t.type === 'deposit').map(txn => (
                        <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50 last:border-0">
                          <td className="py-3.5 font-mono font-bold text-slate-800">{txn.id}</td>
                          <td className="py-3.5 font-black font-mono text-emerald-600">+${txn.amount.toFixed(2)}</td>
                          <td className="py-3.5 font-mono text-slate-500">{txn.referenceCode}</td>
                          <td className="py-3.5 font-mono text-slate-400 text-[11px]">{new Date(txn.createdAt).toLocaleString()}</td>
                          <td className="py-3.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              txn.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              txn.status === 'failed' ? 'bg-red-50 text-red-700 border border-red-100' :
                              'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 6. Admin Panel Content */}
        {activeTab === 'admin' && user?.role === 'admin' && (
          <div className="space-y-8 animate-fade-in text-left">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">
                🛡️ Internal Administrative Portal
              </h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                SMM Panel system variables, financial registers & profiles overriding
              </p>
            </div>

            {/* Admin Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Global SMM Capital</span>
                <p className="text-xl font-mono font-black text-amber-400 mt-2">${stats?.totalDeposited?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Registered Storefronts</span>
                <p className="text-xl font-mono font-black mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Total Executed SMM Orders</span>
                <p className="text-xl font-mono font-black mt-2">{stats?.allOrdersCount || 0}</p>
              </div>
              <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">Pending Verification claims</span>
                <p className="text-xl font-mono font-black text-amber-500 mt-2">{stats?.pendingDepositsCount || 0}</p>
              </div>
            </div>

            {/* Admin Modules Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (User management & Deposit audit claim tickets) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Pending claims ticket container */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl">
                  <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-wider font-display mb-4">Pending Depositor Ticket Overrides</h3>
                  
                  {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length === 0 ? (
                    <div className="py-8 bg-slate-50 rounded-2xl text-center text-slate-400 text-xs font-semibold">
                      ☀️ High-five! Active queue claims is fully empty.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').map(claim => (
                        <div key={claim.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded mr-2 uppercase">Pending #{claim.id}</span>
                            <span className="text-xs font-black">@{claim.username}</span>
                            <div className="text-[11px] font-mono text-slate-500 mt-1 space-y-0.5">
                              <div>Claim Amount: <span className="text-emerald-600 font-bold">${claim.amount.toFixed(2)} USD</span></div>
                              <div>Bank Receipt Reference Code: <code className="text-slate-800 font-bold">[{claim.referenceCode}]</code></div>
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0 w-full sm:w-auto">
                            <button
                              id={`approve-${claim.id}`}
                              onClick={() => handleApproveDeposit(claim.id)}
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                              Approve Code & Credit
                            </button>
                            <button
                              id={`reject-${claim.id}`}
                              onClick={() => handleRejectDeposit(claim.id)}
                              className="bg-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SMM Platform Services controller and editor */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl text-left">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-wider font-display">Manage Active SMM Catalog</h3>
                    <button
                      id="create-service-btn"
                      onClick={() => setShowAddServiceModal(!showAddServiceModal)}
                      className="bg-red-650 hover:bg-slate-900 hover:text-white bg-red-600 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{t.addService}</span>
                    </button>
                  </div>

                  {/* Add Service Collapsible Form Modal Drawer */}
                  {showAddServiceModal && (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 mb-6 font-sans">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Catalog Properties Creator</h4>
                      <form onSubmit={handleAddServiceSubmit} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Service Title Description</label>
                            <input
                              type="text"
                              required
                              value={newServiceName}
                              onChange={(e) => setNewServiceName(e.target.value)}
                              placeholder="e.g. YouTube Real Active Audiences [Non Drop]"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Vessel Platform Classification</label>
                            <select
                              value={newServiceCategory}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewServiceCategory(val);
                                if (val === 'Seller Products') {
                                  setNewServiceIsProduct(true);
                                } else {
                                  setNewServiceIsProduct(false);
                                }
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5"
                            >
                              <option value="Facebook Services">Facebook Services</option>
                              <option value="Instagram Services">Instagram Services</option>
                              <option value="TikTok Services">TikTok Services</option>
                              <option value="YouTube Services">YouTube Services</option>
                              <option value="Seller Products">Seller Products (FB, Gmail, etc.)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Price per 1k ($)</label>
                            <input
                              type="number"
                              step="0.05"
                              required
                              value={newServicePrice}
                              onChange={(e) => setNewServicePrice(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Min Delivery Range</label>
                            <input
                              type="number"
                              required
                              value={newServiceMin}
                              onChange={(e) => setNewServiceMin(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-bold mb-1">Max Delivery Limit</label>
                            <input
                              type="number"
                              required
                              value={newServiceMax}
                              onChange={(e) => setNewServiceMax(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-500 font-bold mb-1">Operation Description</label>
                          <textarea
                            value={newServiceDesc}
                            onChange={(e) => setNewServiceDesc(e.target.value)}
                            placeholder="Detail parameters, delivery speeds, safety ratios, or guarantee warranty specs..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 h-16 resize-none"
                          />
                        </div>

                        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3 text-left">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="is-product-checkbox"
                              checked={newServiceIsProduct}
                              onChange={(e) => setNewServiceIsProduct(e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="is-product-checkbox" className="text-slate-700 font-extrabold cursor-pointer select-none text-[11px] uppercase tracking-wide">
                              Is Digital Product / Seller Product (Instant Account TXT Handout)
                            </label>
                          </div>
                          
                          {newServiceIsProduct && (
                            <div className="space-y-1.5 pt-1">
                              <label className="block text-slate-600 font-bold text-[10px] uppercase">
                                Initial Account Stock (one credential set per line)
                              </label>
                              <textarea
                                value={newServiceStock}
                                onChange={(e) => setNewServiceStock(e.target.value)}
                                placeholder={"fb_user_1:pass123:recovery@gmail.com:2FAKEY\nfb_user_2:pass456:rec2@gmail.com:2FAKEY"}
                                className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 h-20 font-mono text-[11px] focus:ring-2 focus:ring-blue-500/20"
                              />
                              <p className="text-[10px] text-slate-400 italic">
                                SMM panel will automatically slice items from this stock based on quantity purchased and package them as downloadable TXT files for user access.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowAddServiceModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 cursor-pointer hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
                          >
                            Add Service Catalog
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SMM services items list with deletion trigger */}
                  <div className="space-y-3 font-sans">
                    {services.map(svc => (
                      <div key={svc.id} className="border border-slate-100 hover:border-slate-200 p-3.5 rounded-2xl flex justify-between items-center gap-4">
                        <div className="text-left flex-1 min-w-0">
                          <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{svc.category}</span>
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">{svc.name}</h4>
                          <p className="text-[11px] font-mono text-slate-600 mt-1">Price per 1K: <strong className="text-slate-905 text-slate-900">${svc.price.toFixed(2)}</strong> | Range: {svc.min.toLocaleString()} - {svc.max.toLocaleString()} qty</p>
                        </div>
                        <button
                          id={`delete-${svc.id}`}
                          onClick={() => handleDeleteService(svc.id)}
                          className="p-2 border border-slate-100 hover:border-red-105 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors shrink-0 cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (Manage system user accounts & pending orders statuses controller) */}
              <div className="lg:col-span-1 space-y-8">
                
                {/* Users List Box */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl">
                  <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-wider font-display mb-4">{t.usersList}</h3>
                  <div className="space-y-3">
                    {adminUsers.map(usr => (
                      <div key={usr.id} className="bg-slate-50 hover:bg-slate-100/50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between text-left transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black truncate">@{usr.username}</h4>
                            <span className="text-[9px] bg-slate-200 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 font-bold uppercase mt-1 inline-block">
                              ROLE: {usr.role}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 font-mono block">${usr.balance.toFixed(2)}</span>
                            <span className="text-[9px] font-bold text-slate-400 block text-right">USD</span>
                          </div>
                        </div>

                        {/* Adjust user tools buttons */}
                        <div className="flex gap-1.5 mt-3 border-t border-slate-200/50 pt-2 bg-transparent">
                          <button
                            id={`adjust-bal-${usr.id}`}
                            onClick={() => {
                              setAdminSelectedUser(usr);
                              setShowAdjustBalanceModal(true);
                            }}
                            className="flex-1 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-900 text-[10px] font-bold py-1.5 rounded-lg transition-all cursor-pointer text-center"
                          >
                            Alter Balance
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders Audit Status Switch Board */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl text-left">
                  <h3 className="text-md font-extrabold text-slate-900 uppercase tracking-wider font-display mb-4">SMM Delivery dispatcher</h3>
                  <div className="space-y-4">
                    {orders.slice(0, 10).map(ord => (
                      <div key={ord.id} className="border-b border-slate-50 pb-3 last:border-0 hover:bg-slate-50 p-1 rounded transition-colors text-xs font-medium">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono font-bold text-slate-900">ID: #{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            ord.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                            ord.status === 'processing' ? 'bg-sky-50 text-sky-700 animate-pulse' :
                            ord.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-amber-100 text-amber-850'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-550 text-slate-600 font-black">User: @{ord.username}</p>
                        <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">Link: {ord.link}</p>
                        
                        {/* Selector dispatcher action row */}
                        {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                          <div className="flex gap-1.5 mt-2.5">
                            <button
                              id={`dispatch-comp-${ord.id}`}
                              onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                              className="flex-1 bg-slate-905 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[9px] uppercase tracking-wider py-1.5 rounded-md cursor-pointer text-center transition-colors"
                            >
                              Dispatch Complete
                            </button>
                            <button
                              id={`dispatch-canc-${ord.id}`}
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                              className="px-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-[9px] uppercase py-1.5 rounded-md cursor-pointer border border-red-100/50"
                              title="Cancel & Refund automatically"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Admin Balance Override Modal Drawer */}
            {showAdjustBalanceModal && adminSelectedUser && (
              <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-100 shadow-2xl text-left scale-100 animate-fade-in relative">
                  <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-display mb-4">Overwrite Balance Coordinates</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Adjust wallet credentials associated with client user <code className="text-red-650 text-red-600 font-bold">@{adminSelectedUser.username}</code> directly.
                  </p>

                  <form onSubmit={handleAdjustBalanceSubmit} className="space-y-4 mt-4 font-sans text-xs">
                    <div>
                      <label className="block text-slate-400 font-bold mb-1.5">Modification Action</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAdjustAction('add')}
                          className={`py-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                            adjustAction === 'add' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          Credit / Add Funds
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdjustAction('subtract')}
                          className={`py-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                            adjustAction === 'subtract' ? 'bg-red-50 text-red-600 border-red-500' : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          Debit / Subtract Funds
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1.5">Adjustment Amount Value (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={adjustAmountInput}
                        onChange={(e) => setAdjustAmountInput(e.target.value)}
                        placeholder="e.g. 50.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono font-black"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowAdjustBalanceModal(false)}
                        className="px-4 py-2.5 border border-slate-250 border-slate-300 rounded-xl text-slate-650 font-bold cursor-pointer"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-slate-900 rounded-xl font-bold text-white cursor-pointer hover:bg-slate-800"
                      >
                        Adjust Balance
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

          {/* Footer Copyright strip */}
          <footer className="border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400 font-sans shrink-0">
            <p>Copyright &copy; 2026 {t.brandName} Co. All rights reserved Cambodia Unified SMM System.</p>
          </footer>

        </div>

      </div>

      </div>

      {/* Floating Sparkles Campaign Copilot component */}
      <AICopilot 
        services={services} 
        authToken={token || ''} 
        lang={lang}
      />

      {/* Dynamic SMM Drawer for Quick Reorder */}
      <ReorderDrawer 
        isOpen={isReorderOpen}
        onClose={() => setIsReorderOpen(false)}
        order={reorderOrder}
        services={services}
        user={user}
        token={token || ''}
        lang={lang}
        triggerNotification={triggerNotification}
        onOrderPlaced={loadCoreData}
      />

    </div>
  );
}
