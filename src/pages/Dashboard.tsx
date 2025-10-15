import { useState } from "react";
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
import { 
  ShoppingCart, 
  Package, 
  FileText, 
  DollarSign, 
  ClipboardList,
  TrendingUp,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [openTabs, setOpenTabs] = useState<string[]>(["sales"]);

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
            </TabsContent>

            {tabConfig.slice(1).map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                {tab.component && <tab.component />}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* 手機版 - 選單導航 */}
        <div className="md:hidden space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {tabConfig.map((tab) => (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => handleTabClick(tab.value)}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "sales" ? (
              <div className="space-y-6">
                <CustomerSelect />
                <SalesProductList />
                <ProductSelect />
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
