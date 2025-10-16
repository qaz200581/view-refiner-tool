import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreHeader } from "@/components/StoreHeader";
import { CustomerSelect } from "@/components/CustomerSelect";
import { ProductSelect } from "@/components/ProductSelect";
import { SalesProductList } from "@/components/SalesProductList";
import { ProductList } from "./products/ProductList";
import { ProductForm } from "./products/ProductForm";
import { OrderList } from "./orders/OrderList";
import { SalesList } from "./sales/SalesList";
import { PurchaseConversion } from "./purchase/PurchaseConversion";
import { PaymentStatus } from "./payments/PaymentStatus";
import { useStore } from "@/hooks/useStore";
import { 
  ShoppingCart, 
  Package, 
  FileText, 
  DollarSign, 
  ClipboardList,
  TrendingUp,
  X,
  Save,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [openTabs, setOpenTabs] = useState<string[]>(["sales"]);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const { 
    salesItems, 
    selectedCustomer, 
    orderInfo,
    clearAll,
  } = useStore();

  const tabConfig = [
    { value: "sales", label: "新增訂單", icon: ShoppingCart, component: null },
    { value: "products", label: "產品管理", icon: Package, component: ProductList },
    { value: "orders", label: "訂單紀錄", icon: FileText, component: OrderList },
    { value: "sales-records", label: "銷售紀錄", icon: TrendingUp, component: SalesList },
    { value: "purchase", label: "訂單轉採購", icon: ClipboardList, component: PurchaseConversion },
    { value: "payments", label: "貨款查詢", icon: DollarSign, component: PaymentStatus },
  ];

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    if (!openTabs.includes(value)) {
      setOpenTabs([...openTabs, value]);
    }
  };

  const handleCloseTab = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenTabs = openTabs.filter(tab => tab !== value);
    setOpenTabs(newOpenTabs);
    if (activeTab === value && newOpenTabs.length > 0) {
      setActiveTab(newOpenTabs[newOpenTabs.length - 1]);
    }
  };

  // 手機版滑動處理
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const diff = dragCurrentX - dragStartX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      const currentIndex = tabConfig.findIndex(t => t.value === activeTab);
      if (diff > 0 && currentIndex > 0) {
        // 向右滑動，切換到上一個
        setActiveTab(tabConfig[currentIndex - 1].value);
      } else if (diff < 0 && currentIndex < tabConfig.length - 1) {
        // 向左滑動，切換到下一個
        setActiveTab(tabConfig[currentIndex + 1].value);
      }
    }
    
    setIsDragging(false);
    setDragStartX(0);
    setDragCurrentX(0);
  };

  // 提交訂單
  const handleSubmitOrder = () => {
    if (!selectedCustomer) {
      toast.error("請先選擇客戶");
      return;
    }
    if (salesItems.length === 0) {
      toast.error("請至少添加一個產品");
      return;
    }
    if (!orderInfo.serialNumber) {
      toast.error("請填寫流水號");
      return;
    }

    // 暫存到 localStorage
    const orderData = {
      customer: selectedCustomer,
      items: salesItems,
      orderInfo,
      timestamp: new Date().toISOString(),
    };
    
    const savedOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    savedOrders.push(orderData);
    localStorage.setItem('pendingOrders', JSON.stringify(savedOrders));
    
    toast.success("訂單已暫存至本地");
    clearAll();
  };

  // 清除所有資料
  const handleClearAll = () => {
    if (confirm("確定要清除所有資料嗎？")) {
      clearAll();
      toast.success("已清除所有資料");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <div className="container mx-auto px-4 py-6 max-w-[1920px]">
        <StoreHeader />

        {/* 桌面版 - Tab 導航 */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab 列表 */}
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-2 sticky top-4 z-30 shadow-sm">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabConfig.map((tab) => (
                  <div
                    key={tab.value}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-all whitespace-nowrap",
                      activeTab === tab.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted",
                      openTabs.includes(tab.value) ? "opacity-100" : "opacity-60"
                    )}
                    onClick={() => handleTabClick(tab.value)}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                    {openTabs.includes(tab.value) && tab.value !== "sales" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-2 hover:bg-background/20"
                        onClick={(e) => handleCloseTab(tab.value, e)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tab 內容 */}
            <TabsContent value="sales" className="mt-6 space-y-6">
              <div className="grid grid-rows-[auto_auto] gap-6">
                <CustomerSelect />
                <SalesProductList />
              </div>
              <ProductSelect />
              
              {/* 桌面版提交和清除按鈕 */}
              <div className="flex gap-3 justify-end sticky bottom-4 z-30">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClearAll}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  清除全部
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmitOrder}
                >
                  <Save className="w-4 h-4 mr-2" />
                  提交訂單
                </Button>
              </div>
            </TabsContent>

            {tabConfig.slice(1).map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                {tab.component && <tab.component />}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* 手機版 - 半圓卡片滑動選擇 */}
        <div className="md:hidden">
          {/* 半圓指示器 */}
          <div className="relative h-32 mb-6 overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/10 to-transparent rounded-t-full" />
            
            {/* 卡片輪播 */}
            <div 
              ref={carouselRef}
              className="flex items-end justify-center gap-4 px-4 pb-4 relative z-10"
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              {tabConfig.map((tab, index) => {
                const currentIndex = tabConfig.findIndex(t => t.value === activeTab);
                const distance = Math.abs(index - currentIndex);
                const isActive = tab.value === activeTab;
                
                return (
                  <div
                    key={tab.value}
                    className={cn(
                      "flex-shrink-0 transition-all duration-300 cursor-pointer",
                      isActive 
                        ? "w-20 h-20 -translate-y-2" 
                        : distance === 1 
                          ? "w-16 h-16 opacity-70" 
                          : "w-12 h-12 opacity-40"
                    )}
                    onClick={() => handleTabClick(tab.value)}
                    style={{
                      transform: isDragging 
                        ? `translateX(${(dragCurrentX - dragStartX) * 0.5}px)` 
                        : undefined
                    }}
                  >
                    <div className={cn(
                      "w-full h-full rounded-full flex flex-col items-center justify-center gap-1 shadow-lg transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground scale-110" 
                        : "bg-card hover:bg-accent"
                    )}>
                      <tab.icon className={cn(
                        isActive ? "w-8 h-8" : "w-6 h-6"
                      )} />
                      {isActive && (
                        <span className="text-[10px] font-medium">{tab.label}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 當前標籤名稱 */}
            <div className="text-center mt-2">
              <p className="text-sm font-medium text-primary">
                {tabConfig.find(t => t.value === activeTab)?.label}
              </p>
            </div>
          </div>

          {/* 內容區域 */}
          <div className="mt-6">
            {activeTab === "sales" ? (
              <div className="space-y-6">
                <CustomerSelect />
                <SalesProductList />
                <ProductSelect />
                
                {/* 提交和清除按鈕 */}
                <div className="flex gap-3 sticky bottom-4 z-30">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleClearAll}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    清除
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmitOrder}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    提交訂單
                  </Button>
                </div>
              </div>
            ) : (
              tabConfig.find(t => t.value === activeTab)?.component && (
                <div>
                  {tabConfig.find(t => t.value === activeTab)?.component && 
                    (() => {
                      const Component = tabConfig.find(t => t.value === activeTab)?.component;
                      return Component ? <Component /> : null;
                    })()
                  }
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
