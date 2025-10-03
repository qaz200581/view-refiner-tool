import { useState, useEffect } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { CustomerSelect } from "@/components/CustomerSelect";
import { ProductSelect } from "@/components/ProductSelect";
import { SalesProductList } from "@/components/SalesProductList";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";

const Index = () => {
  const {
    expandedComponent,
    setExpandedComponent,
    showSuccessModal,
    setShowSuccessModal,
    clearAll,
    salesItems,
    selectedCustomer,
    setProductSidebarOpen,
  } = useStore();
  
  const [isMobile] = useState(() => window.innerWidth < 768);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  // 檢查是否有未完成的資料
  useEffect(() => {
    const hasData = salesItems.length > 0 || selectedCustomer !== null;
    if (hasData) {
      setShowRestoreDialog(true);
    }
  }, []); // 只在初次載入時執行

  // 處理保留資料
  const handleKeepData = () => {
    setShowRestoreDialog(false);
  };

  // 處理清除資料
  const handleClearData = () => {
    clearAll();
    setShowRestoreDialog(false);
  };

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
    return "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min max-w-screen-2xl mx-auto";
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
      <div className="container mx-auto px-4 py-6 max-w-[1920px]">
        {/* 頂部標題列 */}
        <StoreHeader />

        {/* 移動端組件選擇器 */}
        {isMobile && !expandedComponent && (
          <div className="grid grid-cols-1 gap-4 mb-6">
            <Card
              onClick={() => handleExpandComponent("customer")}
              className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="font-semibold">客戶資訊</div>
              <div className="text-sm text-muted-foreground">
                選擇客戶並設定訂單資訊
              </div>
            </Card>

            <Card
              onClick={() => setProductSidebarOpen(true)}
              className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="font-semibold">產品選擇</div>
              <div className="text-sm text-muted-foreground">
                瀏覽並選擇要銷售的產品
              </div>
            </Card>

            <Card
              onClick={() => handleExpandComponent("sales")}
              className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="font-semibold">銷售清單</div>
              <div className="text-sm text-muted-foreground">
                管理選中的商品和數量
              </div>
            </Card>
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
          {shouldShowComponent("customer") && (
            <div className={`${getComponentClasses("customer")} xl:col-span-1`}>
              <Card
                onClick={() => isMobile && handleExpandComponent("customer")}
                className={isMobile && !expandedComponent ? "cursor-pointer" : ""}
              >
                <CustomerSelect />
              </Card>
            </div>
          )}

          {/* 銷售清單組件 */}
          {shouldShowComponent("sales") && (
            <div className={`${getComponentClasses("sales")} xl:col-span-1`}>
              <Card
                onClick={() => isMobile && handleExpandComponent("sales")}
                className={isMobile && !expandedComponent ? "cursor-pointer" : ""}
              >
                <SalesProductList />
              </Card>
            </div>
          )}
        </div>

        {/* 產品選擇 Sidebar */}
        <ProductSelect />

        {/* 恢復資料對話框 */}
        <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>發現未完成的資料</AlertDialogTitle>
              <AlertDialogDescription>
                系統偵測到您有未完成的訂單資料，是否要繼續編輯？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClearData}>
                清除資料
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleKeepData}>
                繼續編輯
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
