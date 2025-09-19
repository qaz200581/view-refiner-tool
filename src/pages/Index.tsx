import { useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { CustomerSelect } from "@/components/CustomerSelect";
import { ProductSelect } from "@/components/ProductSelect";
import { SalesProductList } from "@/components/SalesProductList";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

const Index = () => {
  const { 
    expandedComponent, 
    setExpandedComponent, 
    showSuccessModal, 
    setShowSuccessModal,
    clearAll 
  } = useStore();
  
  const [isMobile] = useState(() => window.innerWidth < 768);

  // 移動端展開組件控制
  const handleExpandComponent = (component: string) => {
    if (isMobile) {
      setExpandedComponent(expandedComponent === component ? null : component);
    }
  };

  // 關閉成功模態框並清空資料
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    clearAll();
  };

  // 響應式網格類別
  const getGridClasses = () => {
    if (isMobile && expandedComponent) {
      return "grid grid-cols-1 gap-4 min-h-screen";
    }
    return "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min";
  };

  // 組件顯示邏輯（移動端）
  const shouldShowComponent = (component: string) => {
    if (!isMobile) return true;
    if (!expandedComponent) return true;
    return expandedComponent === component;
  };

  // 組件樣式類別
  const getComponentClasses = (component: string) => {
    const baseClasses = "transition-all duration-300";
    
    if (isMobile && expandedComponent) {
      return expandedComponent === component 
        ? `${baseClasses} col-span-1`
        : "hidden";
    }
    
    return baseClasses;
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <div className="container-responsive py-6">
        {/* 頂部標題列 */}
        <StoreHeader />

        {/* 移動端組件選擇器 */}
        {isMobile && !expandedComponent && (
          <div className="grid grid-cols-1 gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => handleExpandComponent('customer')}
              className="p-6 h-auto flex-col gap-2 hover:shadow-md"
            >
              <div className="font-semibold">客戶資訊</div>
              <div className="text-sm text-muted-foreground">選擇客戶並設定訂單資訊</div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleExpandComponent('product')}
              className="p-6 h-auto flex-col gap-2 hover:shadow-md"
            >
              <div className="font-semibold">產品選擇</div>
              <div className="text-sm text-muted-foreground">瀏覽並選擇要銷售的產品</div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleExpandComponent('sales')}
              className="p-6 h-auto flex-col gap-2 hover:shadow-md"
            >
              <div className="font-semibold">銷售清單</div>
              <div className="text-sm text-muted-foreground">管理選中的商品和數量</div>
            </Button>
          </div>
        )}

        {/* 返回按鈕（移動端展開狀態） */}
        {isMobile && expandedComponent && (
          <Button
            variant="ghost"
            onClick={() => setExpandedComponent(null)}
            className="mb-4"
          >
            ← 返回主選單
          </Button>
        )}

        {/* 主要內容區域 */}
        <div className={getGridClasses()}>
          {/* 客戶選擇組件 */}
          {shouldShowComponent('customer') && (
            <div className={`${getComponentClasses('customer')} xl:col-span-1`}>
              <CustomerSelect />
            </div>
          )}

          {/* 產品選擇組件 */}
          {shouldShowComponent('product') && (
            <div className={`${getComponentClasses('product')} xl:col-span-1`}>
              <ProductSelect />
            </div>
          )}

          {/* 銷售清單組件 */}
          {shouldShowComponent('sales') && (
            <div className={`${getComponentClasses('sales')} xl:col-span-1`}>
              <SalesProductList />
            </div>
          )}
        </div>

        {/* 成功提交模態框 */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center space-y-4 py-6">
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-success mb-2">訂單提交成功！</h2>
                <p className="text-muted-foreground">
                  您的訂單已成功提交，系統正在處理中...
                </p>
              </div>
              <Button 
                onClick={handleCloseSuccessModal}
                className="btn-primary w-full"
              >
                確認並清空資料
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 頁腳資訊 */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>店家管理系統 • 現代化響應式介面</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
