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
  id: number;
  code: string;
  name: string;
  series: string;
  vendor: string;
  remark: string;
  price: number;
  originalPrice?: number;
  state?: '啟用中' | '停用' | '預購中' | '售完停產';
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
  productSidebarOpen: boolean;
  
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
  reorderSalesItems: (items: SalesItem[]) => void;
  
  // 訂單資訊
  updateOrderInfo: (info: Partial<OrderInfo>) => void;
  
  // UI 控制
  setExpandedComponent: (component: string | null) => void;
  setShowSuccessModal: (show: boolean) => void;
  setProductSidebarOpen: (open: boolean) => void;
  
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
      products: [
        { id: 1, code: "IMOS-TB-001", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO MAX (6.9吋)", remark: "相機按鍵版-磁吸(MAG)款-丁香紫", price: 1290 },
        { id: 2, code: "IMOS-TB-002", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-亞麻綠", price: 1290 },
        { id: 3, code: "IMOS-TB-003", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 AIR (6.6吋)", remark: "相機按鍵版-磁吸(MAG)款-亞麻綠", price: 1290 },
        { id: 4, code: "IMOS-TB-004", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-亞麻綠", price: 1290 },
        { id: 5, code: "IMOS-TB-005", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO MAX (6.9吋)", remark: "相機按鍵版-磁吸(MAG)款-亞麻綠", price: 1290 },
        { id: 6, code: "IMOS-TB-006", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-透明", price: 1290 },
        { id: 7, code: "IMOS-TB-007", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 AIR (6.6吋)", remark: "相機按鍵版-磁吸(MAG)款-透明", price: 1290 },
        { id: 8, code: "IMOS-TB-008", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-透明", price: 1290 },
        { id: 9, code: "IMOS-TB-009", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO MAX (6.9吋)", remark: "相機按鍵版-磁吸(MAG)款-透明", price: 1290 },
        { id: 10, code: "IMOS-TB-010", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-黑色", price: 1290 },
        { id: 11, code: "IMOS-TB-011", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 AIR (6.6吋)", remark: "相機按鍵版-磁吸(MAG)款-黑色", price: 1290 },
        { id: 12, code: "IMOS-TB-012", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-黑色", price: 1290 },
        { id: 13, code: "IMOS-TB-013", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO MAX (6.9吋)", remark: "相機按鍵版-磁吸(MAG)款-黑色", price: 1290 },
        { id: 14, code: "IMOS-TB-014", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-藍莓色", price: 1290 },
        { id: 15, code: "IMOS-TB-015", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 AIR (6.6吋)", remark: "相機按鍵版-磁吸(MAG)款-藍莓色", price: 1290 },
        { id: 16, code: "IMOS-TB-016", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO (6.3吋)", remark: "相機按鍵版-磁吸(MAG)款-藍莓色", price: 1290 },
        { id: 17, code: "IMOS-TB-017", name: "TREND BOOST 二代(金屬LOGO) 軍規防摔殼", vendor: "IMOS", series: "IPhone 17 PRO MAX (6.9吋)", remark: "相機按鍵版-磁吸(MAG)款-藍莓色", price: 1290 },
        { id: 18, code: "IMOS-LF-001", name: "藍寶石玻璃金屬鏡頭框-鋁合金", vendor: "IMOS", series: "IPhone 17", remark: "綠色 (鋁合金)", price: 890 },
        { id: 19, code: "IMOS-LF-002", name: "藍寶石玻璃金屬鏡頭框-不鏽鋼", vendor: "IMOS", series: "IPhone 17 PRO/17 PRO MAX", remark: "銀色 (不鏽鋼)", price: 990 },
        { id: 20, code: "IMOS-LF-003", name: "藍寶石玻璃金屬鏡頭框-鈦合金", vendor: "IMOS", series: "IPhone 17 Air", remark: "銀色 (鈦合金)", price: 1190 },
        { id: 21, code: "IMOS-LF-004", name: "藍寶石玻璃金屬鏡頭框-鋁合金", vendor: "IMOS", series: "IPhone 17", remark: "銀色 (鋁合金)", price: 890 },
        { id: 22, code: "IMOS-LF-005", name: "藍寶石玻璃金屬鏡頭框-鋁合金", vendor: "IMOS", series: "IPhone 17 PRO/17 PRO MAX", remark: "橘色 (鋁合金)", price: 890 },
        { id: 23, code: "IMOS-LF-006", name: "藍寶石玻璃金屬鏡頭框-不鏽鋼", vendor: "IMOS", series: "IPhone 17", remark: "燒鈦色 (不鏽鋼)", price: 990 },
        { id: 24, code: "IMOS-LF-007", name: "藍寶石玻璃金屬鏡頭框-不鏽鋼", vendor: "IMOS", series: "IPhone 17 Air", remark: "燒鈦色 (不鏽鋼)", price: 990 },
        { id: 25, code: "IMOS-LF-008", name: "藍寶石玻璃金屬鏡頭框-不鏽鋼", vendor: "IMOS", series: "IPhone 17 PRO/17 PRO MAX", remark: "燒鈦色 (不鏽鋼)", price: 990 },
        { id: 26, code: "IMOS-LF-009", name: "藍寶石玻璃金屬鏡頭框-不鏽鋼", vendor: "IMOS", series: "IPhone 17 PRO/17 PRO MAX", remark: "藍色 (不鏽鋼)", price: 990 },
        { id: 27, code: "IMOS-LF-010", name: "藍寶石玻璃金屬鏡頭框-鈦合金", vendor: "IMOS", series: "IPhone 17 Air", remark: "藍色 (鈦合金)", price: 1190 },
        { id: 28, code: "IMOS-LF-011", name: "藍寶石玻璃金屬鏡頭框-鋁合金", vendor: "IMOS", series: "IPhone 17", remark: "藍色 (鋁合金)", price: 890 },
        { id: 29, code: "IMOS-AR-001", name: "AR低反射", vendor: "IMOS", series: "IPhone 17 AIR (6.6吋)", remark: "AR-亮面", price: 790 },
        { id: 30, code: "IMOS-AR-002", name: "AR低反射", vendor: "IMOS", series: "IPhone 17 PRO MAX (6.9吋)", remark: "AR-亮面", price: 790 },
      ],
      selectedProducts: [],
      salesItems: [],
      orderInfo: {
        date: new Date().toISOString().split('T')[0],
        serialNumber: '',
        paperSerialNumber: '',
      },
      expandedComponent: null,
      showSuccessModal: false,
      productSidebarOpen: false,

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
      
      reorderSalesItems: (items) => set({ salesItems: items }),

      // 訂單資訊
      updateOrderInfo: (info) => {
        const { orderInfo } = get();
        set({ orderInfo: { ...orderInfo, ...info } });
      },

      // UI 控制
      setExpandedComponent: (component) => set({ expandedComponent: component }),
      setShowSuccessModal: (show) => set({ showSuccessModal: show }),
      setProductSidebarOpen: (open) => set({ productSidebarOpen: open }),

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