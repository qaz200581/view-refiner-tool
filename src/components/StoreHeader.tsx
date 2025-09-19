import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send, Trash2, ChevronDown } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

export const StoreHeader = () => {
  const {
    clearCustomer,
    clearProducts,
    clearAll,
    salesItems,
    selectedCustomer,
    orderInfo,
    getTotalAmount,
    getTotalQuantity,
    setShowSuccessModal,
  } = useStore();

  const handleSubmit = async () => {
    if (!selectedCustomer || salesItems.length === 0) {
      toast.error("請確認已選擇客戶並添加產品");
      return;
    }

    try {
      // 模擬 API 提交
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`訂單提交成功！總金額: $${getTotalAmount().toLocaleString()}`);
      setShowSuccessModal(true);
      
      // 可以在這裡實現實際的 API 提交邏輯
      console.log("提交訂單資料:", {
        orderInfo,
        customer: selectedCustomer,
        items: salesItems,
        totalAmount: getTotalAmount(),
        totalQuantity: getTotalQuantity(),
      });
      
    } catch (error) {
      toast.error("提交失敗，請重試");
    }
  };

  const handleClear = (type: 'customer' | 'products' | 'all') => {
    switch (type) {
      case 'customer':
        clearCustomer();
        toast.success("已清除客戶資料");
        break;
      case 'products':
        clearProducts();
        toast.success("已清除產品清單");
        break;
      case 'all':
        clearAll();
        toast.success("已清除全部資料");
        break;
    }
  };

  return (
    <Card className="card-elegant p-4 mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 店家資訊 */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            店家管理系統
          </h1>
          {selectedCustomer && (
            <div className="text-sm text-muted-foreground">
              當前客戶: <span className="font-medium text-foreground">{selectedCustomer.name}</span>
            </div>
          )}
        </div>

        {/* 統計資訊 */}
        {salesItems.length > 0 && (
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">商品數量</div>
              <div className="font-semibold text-primary">{getTotalQuantity()}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">總金額</div>
              <div className="font-semibold text-secondary">
                ${getTotalAmount().toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={!selectedCustomer || salesItems.length === 0}
            className="btn-primary gap-2"
          >
            <Send className="w-4 h-4" />
            提交訂單
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Trash2 className="w-4 h-4" />
                清除
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-slide-up">
              <DropdownMenuItem 
                onClick={() => handleClear('customer')}
                className="text-warning cursor-pointer"
              >
                清除客戶資料
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleClear('products')}
                className="text-warning cursor-pointer"
              >
                清除產品清單
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleClear('all')}
                className="text-error cursor-pointer"
              >
                清除全部資料
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};