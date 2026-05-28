export type Language = 'en' | 'km';

export interface TranslationSchema {
  // Navigation & General
  brandName: string;
  dashboard: string;
  newOrder: string;
  services: string;
  orderHistory: string;
  walletDeposit: string;
  adminPanel: string;
  logout: string;
  language: string;

  // Sign In / Register
  signIn: string;
  register: string;
  username: string;
  password: string;
  noAccount: string;
  haveAccount: string;
  signInButton: string;
  registerButton: string;
  welcomeBack: string;
  createAccount: string;

  // Stats & Panels
  currentBalance: string;
  totalOrders: string;
  totalSpent: string;
  activeOrders: string;
  servicesCount: string;
  totalDeposited: string;
  totalUsers: string;
  pendingTransactions: string;

  // New Order Form
  chooseCategory: string;
  selectService: string;
  targetLink: string;
  orderQuantity: string;
  minLabel: string;
  maxLabel: string;
  estimatedCost: string;
  placeOrderButton: string;
  linkPlaceholder: string;
  insufficientFunds: string;

  // Services Page
  categoryFilter: string;
  allCategories: string;
  pricePer1000: string;
  serviceDescription: string;

  // Orders Table
  orderId: string;
  serviceName: string;
  quantity: string;
  charge: string;
  status: string;
  date: string;
  actions: string;

  // Wallet and KHQR
  depositFunds: string;
  enterAmount: string;
  minDepositWarning: string;
  scanToPayTitle: string;
  paymentMethodSub: string;
  refCodeLabel: string;
  refCodeHint: string;
  submitDepositBtn: string;
  simulateWebhookBtn: string;
  simulateWebhookDesc: string;
  manualAdminOption: string;

  // Admin Portal
  usersList: string;
  addService: string;
  editService: string;
  deleteService: string;
  approve: string;
  reject: string;
  role: string;
  setBalance: string;
  modifyFunds: string;
  saveChanges: string;
  cancel: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    brandName: 'Angkor SMM Panel',
    dashboard: 'Dashboard',
    newOrder: 'New Order',
    services: 'SMM Services',
    orderHistory: 'Order History',
    walletDeposit: 'Wallet Deposit',
    adminPanel: 'Admin Panel',
    logout: 'Log Out',
    language: 'Language',

    signIn: 'Sign In',
    register: 'Create Account',
    username: 'Username',
    password: 'Password',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signInButton: 'Sign In',
    registerButton: 'Register Now',
    welcomeBack: 'Welcome Back to SMM Panel',
    createAccount: 'Register SMM Membership Store',

    currentBalance: 'Current Balance',
    totalOrders: 'Total Orders Placed',
    totalSpent: 'Total Wallet Spent',
    activeOrders: 'Active Orders',
    servicesCount: 'Available Services',
    totalDeposited: 'Total Deposits (USD)',
    totalUsers: 'Total Enrolled Users',
    pendingTransactions: 'Pending KHQR Claims',

    chooseCategory: 'Target Platform Category',
    selectService: 'Choose Social Media Service',
    targetLink: 'Social Media URL / Fanpage Link',
    orderQuantity: 'Order Quantity',
    minLabel: 'Minimum Order',
    maxLabel: 'Maximum Order',
    estimatedCost: 'Estimated Charge Cost',
    placeOrderButton: 'Commit SMM Order',
    linkPlaceholder: 'https://facebook.com/username/posts/101...',
    insufficientFunds: 'Insufficient balance. Top up your wallet in the deposit tab!',

    categoryFilter: 'Sort Platform',
    allCategories: 'All Platforms',
    pricePer1000: 'Price per 1k',
    serviceDescription: 'Service Action Protocol',

    orderId: 'Order Transaction ID',
    serviceName: 'Service Description',
    quantity: 'Req. Qty',
    charge: 'Charge Cost',
    status: 'Delivery Status',
    date: 'Enrolled Date',
    actions: 'Service Actions',

    depositFunds: 'Deposit Funds via KHQR (Bakong System)',
    enterAmount: 'Deposit Amount (USD)',
    minDepositWarning: 'Minimum deposit is $1.00 USD.',
    scanToPayTitle: 'Bakong Unified KHQR Payment Gateway',
    paymentMethodSub: 'Scan using Bakong, ABA Bank, or any Cambodian Mobile Banking application.',
    refCodeLabel: 'Bank Receipt Reference Ref Code',
    refCodeHint: 'Enter the 6-digit transaction reference shown in your mobile banking app e.g., 849204',
    submitDepositBtn: 'Submit KHQR Payment Claim',
    simulateWebhookBtn: 'Simulate Automated Webhook Callback',
    simulateWebhookDesc: 'Instantly top up user balance by simulating a realtime bank webhook dispatch notification.',
    manualAdminOption: 'Submit claim above. An admin can also manually approve your transaction inside the Admin Panel.',

    usersList: 'User Profiles',
    addService: 'Add New SMM Service',
    editService: 'Edit SMM Details',
    deleteService: 'Remove Service',
    approve: 'Approve Payment',
    reject: 'Reject & Discard',
    role: 'Privilege Role',
    setBalance: 'Adjust Balance',
    modifyFunds: 'Deduct / Credit User Funds',
    saveChanges: 'Save Changes',
    cancel: 'Cancel Operations'
  },
  km: {
    brandName: 'អង់គរ SMM លក់សេវាកម្ម',
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    newOrder: 'កម្ម៉ង់ថ្មី',
    services: 'សេវាកម្ម SMM',
    orderHistory: 'ប្រវត្តិកម្ម៉ង់',
    walletDeposit: 'ដាក់ប្រាក់ KHQR',
    adminPanel: 'ផ្ទាំងគ្រប់គ្រង Admin',
    logout: 'ចាកចេញពីគណនី',
    language: 'ភាសា',

    signIn: 'ចូលគណនី',
    register: 'ចុះឈ្មោះថ្មី',
    username: 'ឈ្មោះអ្នកប្រើប្រាស់',
    password: 'លេខសម្ងាត់',
    noAccount: 'គ្មានគណនីមែនទេ? ចុះឈ្មោះ!',
    haveAccount: 'មានគណនីហើយមែនទេ? ចូលគណនី!',
    signInButton: 'ចូលលេងឥឡូវនេះ',
    registerButton: 'ចុះឈ្មោះឥឡូវនេះ',
    welcomeBack: 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ SMM',
    createAccount: 'បង្កើតគណនី SMM កម្ពុជា',

    currentBalance: 'សមតុល្យទឹកប្រាក់',
    totalOrders: 'កម្ម៉ង់សរុប',
    totalSpent: 'ការចំណាយសរុប',
    activeOrders: 'សេវាកំពុងដំណើរការ',
    servicesCount: 'សេវាកម្មដែលមានស្រាប់',
    totalDeposited: 'ប្រាក់បញ្ញើសរុប (USD)',
    totalUsers: 'អ្នកប្រើប្រាស់សរុប',
    pendingTransactions: 'ប្រាក់កក់រង់ចាំការអនុម័ត',

    chooseCategory: 'ជ្រើសរើសប្រភេទបណ្តាញសង្គម',
    selectService: 'ជ្រើសរើសសេវាកម្ម SMM',
    targetLink: 'តំណភ្ជាប់ URL / Link ផេក',
    orderQuantity: 'ចំនួនដែលត្រូវកម្ម៉ង់',
    minLabel: 'ចំនួនកម្ម៉ង់អប្បបរមា',
    maxLabel: 'ចំនួនកម្ម៉ង់អតិបរមា',
    estimatedCost: 'តម្លៃសេវាត្រូវទូទាត់សរុប',
    placeOrderButton: 'បង្កើតកម្ម៉ង់សេវាកម្ម SMM',
    linkPlaceholder: 'https://facebook.com/username/posts/101...',
    insufficientFunds: 'សមតុល្យលុយមិនគ្រប់គ្រាន់ទេ! សូមមេត្តាដាក់លុយបន្ថែមក្នុងកាបូប!',

    categoryFilter: 'តម្រងប្រភេទបណ្តាញ',
    allCategories: 'គ្រប់ប្រភេទសេវាកម្ម',
    pricePer1000: 'តម្លៃក្នុង ១K (១ពាន់)',
    serviceDescription: 'ប្រូតូកូលលម្អិតនៃសេវាកម្ម',

    orderId: 'លេខសម្គាល់កម្ម៉ង់',
    serviceName: 'សេវាកម្មដែលកម្ម៉ង់',
    quantity: 'ចំនួនកម្ម៉ង់',
    charge: 'តម្លៃចំណាយ',
    status: 'ស្ថានភាពដំណើរការ',
    date: 'កាលបរិច្ឆេទកម្ម៉ង់',
    actions: 'សកម្មភាពសេវា',

    depositFunds: 'ការដាក់ប្រាក់រហ័សតាមរយៈ KHQR របស់ធនាគារបាគង',
    enterAmount: 'ចំនួនទឹកប្រាក់ត្រូវដាក់ (USD)',
    minDepositWarning: 'ចំនួនទឹកប្រាក់ដាក់ទាបបំផុតគឺ $1.00 USD ។',
    scanToPayTitle: 'ស្កែនទូទាត់ប្រាក់តាមប្រព័ន្ធ KHQR រួមផ្សំ',
    paymentMethodSub: 'ស្កែនទូទាត់ពីកម្មវិធីធនាគារ អេប៊ីអេ (ABA) ឬធនាគារកម្ពុជានានា។',
    refCodeLabel: 'លេខកូដយោងប្រតិបត្តិការ (Reference Code)',
    refCodeHint: 'បញ្ចូលលេខកូដយោងធនាគារ៦ខ្ទង់ ពីវិក្កយបត្រធនាគាររបស់អ្នក ឧទាហរណ៍: 849204',
    submitDepositBtn: 'ដាក់ទម្រង់ស្នើសុំដាក់លុយ',
    simulateWebhookBtn: 'សាកល្បងប្រព័ន្ធទូទាត់ស្វ័យប្រវត្តិលឿន (Webhook)',
    simulateWebhookDesc: 'បញ្ចូលលុយទៅគណនីរបស់អ្នកភ្លាមៗ ដោយសាកល្បងការជូនដំណឹងពី webhook ធនាគារពិតៗ។',
    manualAdminOption: 'ផ្ញើស្នើខាងលើ។ Admin នឹងធ្វើការធានាអនុម័ត ឬពិនិត្យដោយផ្ទាល់ក្នុងផ្ទាំងគ្រប់គ្រង។',

    usersList: 'គណនីអ្នកប្រើប្រាស់ទូទាំងប្រព័ន្ធ',
    addService: 'បង្កើតសេវាកម្ម SMM ថ្មី',
    editService: 'កែសម្រួលព័ត៌មានសេវាកម្ម',
    deleteService: 'លុបសេវាកម្មចេញ',
    approve: 'អនុម័តការដាក់លុយ',
    reject: 'ច្រានចោលសំណើ',
    role: 'សិទ្ធិដំណើរការ',
    setBalance: 'កែតម្រូវសមតុល្យ',
    modifyFunds: 'បន្ថែម / បន្ថយទឹកប្រាក់គណនី',
    saveChanges: 'រក្សាទុកការផ្លាស់ប្តូរ',
    cancel: 'បោះបង់សកម្មភាព'
  }
};
