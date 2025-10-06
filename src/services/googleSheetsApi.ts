const API_URL = "https://script.google.com/macros/s/AKfycbw35vDuBQego2Prp9RlX_rFDVvI1GkSWCawO3ueDt5W8IY1aesGnWHQUFnEdJSn8Ynt/exec";

export interface GoogleSheetsProduct {
  productId: string;
  status: string;
  code: string;
  name: string;
  brand: string;
  seriesList: string;
  modelList: string;
  colors: string;
  rowNumber: number;
}

export interface GoogleSheetsSale {
  salesId: string;
  salesDate: string;
  customer: string;
  customerOrderNo: string;
  itemNo: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  orderRef: string;
  year: number;
  month: number;
  cost: number;
  profit: number;
  rowNumber: number;
}

export interface GoogleSheetsOrder {
  orderId: string;
  orderDate: string;
  customer: string;
  brand: string;
  productId: string;
  productName: string;
  productModel: string;
  productOption: string;
  unshippedQty: number;
  rowNumber: number;
}

interface ApiResponse {
  ok: boolean;
  data?: {
    products?: GoogleSheetsProduct[];
    sales?: GoogleSheetsSale[];
    orders?: GoogleSheetsOrder[];
  };
  error?: string;
}

export const fetchGoogleSheetsData = async (type: 'products' | 'sales' | 'orders' | 'all' = 'all'): Promise<ApiResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const fetchProducts = async (): Promise<GoogleSheetsProduct[]> => {
  const response = await fetchGoogleSheetsData('products');
  return response.data?.products || [];
};

export const fetchSales = async (): Promise<GoogleSheetsSale[]> => {
  const response = await fetchGoogleSheetsData('sales');
  return response.data?.sales || [];
};

export const fetchOrders = async (): Promise<GoogleSheetsOrder[]> => {
  const response = await fetchGoogleSheetsData('orders');
  return response.data?.orders || [];
};
