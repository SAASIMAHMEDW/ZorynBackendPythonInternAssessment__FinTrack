export const CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Investment',
    'Rental Income',
    'Bonus',
    'Dividends',
    'Side Business',
    'Gift',
    'Refund',
    'Other Income',
  ],
  EXPENSE: [
    'Rent',
    'Groceries',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Insurance',
    'Education',
    'Dining Out',
    'Shopping',
    'Subscriptions',
    'Travel',
    'Personal Care',
    'Household',
    'Gifts',
    'Other Expense',
  ],
  ALL: [
    'Salary', 'Freelance', 'Investment', 'Rental Income', 'Bonus', 'Dividends',
    'Rent', 'Groceries', 'Utilities', 'Transportation', 'Entertainment',
    'Healthcare', 'Insurance', 'Education', 'Dining Out', 'Shopping',
    'Subscriptions', 'Travel', 'Other',
  ],
} as const;

export const TIME_RANGES = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'ytd', label: 'Year to Date' },
] as const;

export const ROLES = {
  ADMIN: { label: 'Admin', variant: 'violet' as const },
  ANALYST: { label: 'Analyst', variant: 'indigo' as const },
  VIEWER: { label: 'Viewer', variant: 'default' as const },
} as const;

export const STATUS = {
  ACTIVE: { label: 'Active', variant: 'success' as const },
  INACTIVE: { label: 'Inactive', variant: 'danger' as const },
} as const;

export const TRANSACTION_TYPES = {
  INCOME: { label: 'Income', variant: 'success' as const },
  EXPENSE: { label: 'Expense', variant: 'danger' as const },
} as const;

export const CHART_COLORS = [
  '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', 
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#a855f7',
];

export const CHART_TYPE_OPTIONS = [
  { value: 'LINE', label: 'Line Chart' },
  { value: 'AREA', label: 'Area Chart' },
  { value: 'BAR', label: 'Bar Chart' },
  { value: 'PIE', label: 'Pie Chart' },
] as const;

export const FORMULA_OPTIONS = [
  { value: 'sum', label: 'Sum of Amounts' },
  { value: 'count', label: 'Count of Records' },
  { value: 'avg', label: 'Average Amount' },
  { value: 'max', label: 'Maximum Amount' },
  { value: 'min', label: 'Minimum Amount' },
] as const;
