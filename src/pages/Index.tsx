import { useState, useEffect } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { CustomerSelect } from "@/components/CustomerSelect";
import { ProductSelect } from "@/components/ProductSelect";
import { SalesProductList } from "@/components/SalesProductList";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CheckCircle, Users, ShoppingCart, Package, X } from "lucide-react";

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
  
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

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

  // 關閉成功模態框並清空資料
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    clearAll();
  };

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <div className="container mx-auto px-4 py-6 max-w-[1920px]">
        {/* 頂部標題列 */}
        <StoreHeader />

        {/* 主要內容區域 */}
        <div className="space-y-6">
          {/* 桌面版：顯示所有組件 */}
          <div className="hidden md:grid md:grid-rows-2 gap-6 max-w-screen-2xl mx-auto">
            <CustomerSelect />
            <SalesProductList />
          </div>

          {/* 手機版：根據選擇顯示組件 */}
          <div className="md:hidden space-y-4">
            {activeComponent === null && (
              <div className="grid grid-rows-3 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader 
                    className="pb-4 cursor-pointer"
                    onClick={() => setActiveComponent("customer")}
                  >
                    <CardTitle className="flex flex-col items-center gap-2 text-center">
                      <Users className="w-8 h-8" />
                      <span className="text-sm whitespace-pre-line leading-tight">
                        {"客\n戶\n資\n訊"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader 
                    className="pb-4 cursor-pointer"
                    onClick={() => setActiveComponent("sales")}
                  >
                    <CardTitle className="flex flex-col items-center gap-2 text-center">
                      <ShoppingCart className="w-8 h-8" />
                      <span className="text-sm whitespace-pre-line leading-tight">
                        {"銷\n售\n清\n單"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader 
                    className="pb-4 cursor-pointer"
                    onClick={() => setProductSidebarOpen(true)}
                  >
                    <CardTitle className="flex flex-col items-center gap-2 text-center">
                      <Package className="w-8 h-8" />
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            )}

            {activeComponent === "customer" && (
              <div className="animate-fade-in">
                <Button
                  variant="outline"
                  onClick={() => setActiveComponent(null)}
                  className="mb-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  返回
                </Button>
                <CustomerSelect />
              </div>
            )}

            {activeComponent === "sales" && (
              <div className="animate-fade-in">
                <Button
                  variant="outline"
                  onClick={() => setActiveComponent(null)}
                  className="mb-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  返回
                </Button>
                <SalesProductList />
              </div>
            )}
          </div>
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
