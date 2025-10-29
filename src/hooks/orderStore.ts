// @/hooks/orderStore.ts
import { StateCreator } from 'zustand';
import { Customer } from './customerStore';

export interface OrderInfo {
  date: string;
  serialNumber: string;
  paperSerialNumber?: string;
  customer?: Customer;
  status?: string;
}

export interface OrderSlice {
  // State
  orderInfo: OrderInfo;

  // Actions
  setOrderInfo: (info: OrderInfo) => void;
  updateOrderInfo: (info: Partial<OrderInfo>) => void;
  resetOrderInfo: () => void;
}

const getInitialOrderInfo = (): OrderInfo => ({
  date: new Date().toISOString().split('T')[0],
  serialNumber: '',
  paperSerialNumber: '',
});

export const createOrderSlice: StateCreator<OrderSlice> = (set, get) => ({
  // Initial state
  orderInfo: getInitialOrderInfo(),

  // Actions
  setOrderInfo: (info) => set({ orderInfo: info }),

  updateOrderInfo: (info) => {
    const { orderInfo } = get();
    set({ orderInfo: { ...orderInfo, ...info } });
  },

  resetOrderInfo: () => set({ orderInfo: getInitialOrderInfo() }),
});