import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/hooks/useStore";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Calculator,
  Package
} from "lucide-react";
import { toast } from "sonner";

export const SalesProductList = () => {
  const {
    salesItems,
    updateSalesItem,
    removeSalesItem,
    clearSalesItems,
    getTotalQuantity,
    getTotalAmount,
    selectedCustomer,
  } = useStore();

  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<number | null>(null);

  // 更新數量
  const handleQuantityChange = (index: number, change: number) => {
    const item = salesItems[index];
    const newQuantity = Math.max(0, item.quantity + change);
    
    if (newQuantity === 0) {
      removeSalesItem(index);
      toast.success("已移除商品");
    } else {
      updateSalesItem(index, { quantity: newQuantity });
    }
  };

  // 直接設置數量
  const handleQuantityInput = (index: number, value: string) => {
    const quantity = parseInt(value) || 0;
    if (quantity <= 0) {
      removeSalesItem(index);
      toast.success("已移除商品");
    } else {
      updateSalesItem(index, { quantity });
    }
  };

  // 更新價格
  const handlePriceChange = (index: number, price: string) => {
    const newPrice = parseFloat(price) || 0;
    updateSalesItem(index, { 
      price: newPrice,
      isPriceModified: true 
    });
    setEditingPrice(null);
  };

  // 複製商品
  const handleCopyItem = (index: number) => {
    const item = salesItems[index];
    const newItem = { ...item, time: Date.now() };
    updateSalesItem(salesItems.length, newItem);
    toast.success(`已複製 ${item.name}`);
  };

  // 移除商品
  const handleRemoveItem = (index: number) => {
    const item = salesItems[index];
    removeSalesItem(index);
    toast.success(`已移除 ${item.name}`);
  };

  // 鍵盤導航（Enter 鍵跳到下一個輸入框）
  const handleKeyDown = (e: React.KeyboardEvent, index: number, type: 'quantity' | 'price') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs = document.querySelectorAll(`.${type}-input`);
      const nextInput = inputs[index + 1] as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        // 回到第一個輸入框
        const firstInput = inputs[0] as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
        }
      }
    }
  };

  if (!selectedCustomer) {
    return (
      <Card className="card-elegant animate-fade-in">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <ShoppingCart className="w-5 h-5" />
            銷售清單
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground space-y-4">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <div>
              <p className="text-lg font-medium">請先選擇客戶</p>
              <p className="text-sm mt-2">請至「客戶資訊」區域選擇或輸入客戶資料</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elegant animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <ShoppingCart className="w-5 h-5" />
            銷售清單
            {salesItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {salesItems.length} 項商品
              </Badge>
            )}
          </CardTitle>
          
          {salesItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSalesItems}
              className="text-error hover:text-error"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清空
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {salesItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">銷售清單為空</p>
            <p className="text-sm">從產品選擇區域添加商品到此清單</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 商品列表 */}
            <div className="space-y-3 max-h-80 overflow-auto">
              {salesItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.time}`}
                  className="flex items-center gap-3 p-4 border rounded-lg bg-surface hover:shadow-md transition-shadow"
                >
                  {/* 商品資訊 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.vendor} • {item.series}
                        </p>
                        {item.remark && (
                          <p className="text-xs text-muted-foreground">{item.remark}</p>
                        )}
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {item.code}
                      </Badge>
                    </div>
                  </div>

                  {/* 數量控制 */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(index, -1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityInput(index, e.target.value)}
                      onFocus={() => setEditingQuantity(index)}
                      onBlur={() => setEditingQuantity(null)}
                      onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                      className="quantity-input w-16 text-center text-sm"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(index, 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* 價格 */}
                  <div className="text-right min-w-20">
                    <div className="space-y-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        onFocus={() => setEditingPrice(index)}
                        onBlur={() => setEditingPrice(null)}
                        onKeyDown={(e) => handleKeyDown(e, index, 'price')}
                        className={`price-input w-20 text-center text-sm ${
                          item.isPriceModified ? 'text-warning' : ''
                        }`}
                      />
                      <div className="text-xs text-muted-foreground">
                        單價
                      </div>
                    </div>
                  </div>

                  {/* 小計 */}
                  <div className="text-right min-w-24">
                    <div className="font-semibold text-primary">
                      ${item.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      小計
                    </div>
                  </div>

                  {/* 操作選單 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="animate-slide-up">
                      <DropdownMenuItem
                        onClick={() => handleCopyItem(index)}
                        className="cursor-pointer"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        複製商品
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveItem(index)}
                        className="cursor-pointer text-error"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        移除商品
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            {/* 統計資訊 */}
            <div className="border-t pt-4">
              <div className="bg-gradient-surface rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calculator className="w-4 h-4" />
                    訂單統計
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {getTotalQuantity()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      商品總數
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-secondary">
                      ${getTotalAmount().toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      訂單總額
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};