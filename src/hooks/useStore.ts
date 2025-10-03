import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 類型定義
export interface Customer {
  id?: string;
  name: string;
  code: string;
  storeName?: string;
  chainStoreName?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  series: string;
  vendor: string;
  remark?: string;
  price: number;
  originalPrice: number;
  state: '啟用中' | '停用' | '預購中' | '售完停產';
  barcode?: string;
  systemCode?: string;
  isPriceModified?: boolean;
}

export interface SalesItem extends Product {
  quantity: number;
  totalPrice: number;
  time: number;
}

export interface OrderInfo {
  date: string;
  serialNumber: string;
  paperSerialNumber?: string;
  customer?: Customer;
}

interface StoreState {
  // 客戶相關
  customers: Customer[];
  selectedCustomer: Customer | null;
  
  // 產品相關
  products: Product[];
  selectedProducts: Product[];
  
  // 銷售清單
  salesItems: SalesItem[];
  
  // 訂單資訊
  orderInfo: OrderInfo;
  
  // UI 狀態
  expandedComponent: string | null;
  showSuccessModal: boolean;
  
  // Actions
  setCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setProducts: (products: Product[]) => void;
  addSelectedProduct: (product: Product) => void;
  removeSelectedProduct: (productId: string) => void;
  
  // 銷售清單操作
  addSalesItem: (product: Product, quantity?: number) => void;
  updateSalesItem: (index: number, updates: Partial<SalesItem>) => void;
  removeSalesItem: (index: number) => void;
  clearSalesItems: () => void;
  
  // 訂單資訊
  updateOrderInfo: (info: Partial<OrderInfo>) => void;
  
  // UI 控制
  setExpandedComponent: (component: string | null) => void;
  setShowSuccessModal: (show: boolean) => void;
  
  // 清除功能
  clearCustomer: () => void;
  clearProducts: () => void;
  clearAll: () => void;
  
  // 計算函數
  getTotalQuantity: () => number;
  getTotalAmount: () => number;
  getProductPrice: (productCode: string) => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // 初始狀態
      customers: [],
      selectedCustomer: null,
      products: [],
      selectedProducts: [],
      salesItems: [],
      orderInfo: {
        date: new Date().toISOString().split('T')[0],
        serialNumber: '',
        paperSerialNumber: '',
      },
      expandedComponent: null,
      showSuccessModal: false,

      // Actions
      setCustomers: (customers) => set({ customers }),
      
      setSelectedCustomer: (customer) => {
        set({ selectedCustomer: customer });
        // 當選擇客戶時，清空價格緩存並重新計算
        if (customer) {
          const { salesItems } = get();
          const updatedItems = salesItems.map(item => ({
            ...item,
            price: get().getProductPrice(item.code),
            totalPrice: item.quantity * get().getProductPrice(item.code),
          }));
          set({ salesItems: updatedItems });
        }
      },
      
      setProducts: (products) => set({ products }),
      
      addSelectedProduct: (product) => {
        const { selectedProducts } = get();
        const exists = selectedProducts.find(p => p.id === product.id);
        if (!exists) {
          set({ selectedProducts: [...selectedProducts, product] });
        }
      },
      
      removeSelectedProduct: (productId) => {
        const { selectedProducts } = get();
        set({ selectedProducts: selectedProducts.filter(p => p.id !== productId) });
      },

      // 銷售清單操作
      addSalesItem: (product, quantity = 1) => {
        const { salesItems } = get();
        const price = get().getProductPrice(product.code);
        const newItem: SalesItem = {
          ...product,
          quantity,
          totalPrice: quantity * price,
          time: Date.now(),
        };
        set({ salesItems: [...salesItems, newItem] });
      },
      
      updateSalesItem: (index, updates) => {
        const { salesItems } = get();
        const updatedItems = [...salesItems];
        const item = { ...updatedItems[index], ...updates };
        
        // 如果更新了數量或價格，重新計算總價
        if ('quantity' in updates || 'price' in updates) {
          item.totalPrice = item.quantity * item.price;
        }
        
        updatedItems[index] = item;
        set({ salesItems: updatedItems });
      },
      
      removeSalesItem: (index) => {
        const { salesItems } = get();
        const updatedItems = salesItems.filter((_, i) => i !== index);
        set({ salesItems: updatedItems });
      },
      
      clearSalesItems: () => set({ salesItems: [] }),

      // 訂單資訊
      updateOrderInfo: (info) => {
        const { orderInfo } = get();
        set({ orderInfo: { ...orderInfo, ...info } });
      },

      // UI 控制
      setExpandedComponent: (component) => set({ expandedComponent: component }),
      setShowSuccessModal: (show) => set({ showSuccessModal: show }),

      // 清除功能
      clearCustomer: () => set({ 
        selectedCustomer: null,
        orderInfo: {
          date: new Date().toISOString().split('T')[0],
          serialNumber: '',
          paperSerialNumber: '',
        }
      }),
      
      clearProducts: () => set({ selectedProducts: [], salesItems: [] }),
      
      clearAll: () => set({
        selectedCustomer: null,
        selectedProducts: [],
        salesItems: [],
        orderInfo: {
          date: new Date().toISOString().split('T')[0],
          serialNumber: '',
          paperSerialNumber: '',
        }
      }),

      // 計算函數
      getTotalQuantity: () => {
        const { salesItems } = get();
        return salesItems.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      getTotalAmount: () => {
        const { salesItems } = get();
        return salesItems.reduce((sum, item) => sum + item.totalPrice, 0);
      },
      
      getProductPrice: (productCode) => {
        const { products, selectedCustomer } = get();
        const product = products.find(p => p.code === productCode);
        if (!product) return 0;
        
        // 這裡可以實現客戶專屬價格邏輯
        // 目前先返回原價
        return product.originalPrice || product.price;
      },
    }),
    {
      name: 'store-management',
      partialize: (state) => ({
        customers: state.customers,
        products: state.products,
        selectedCustomer: state.selectedCustomer,
        salesItems: state.salesItems,
        orderInfo: state.orderInfo,
      }),
    }
  )
);