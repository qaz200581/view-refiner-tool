import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, FileText, Trash2 } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const OrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const { setSelectedCustomer, updateOrderInfo } = useStore();

  // 從 localStorage 載入訂單
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    setOrders(savedOrders);
  }, []);

  // 編輯訂單 - 載入到銷售頁面
  const handleEditOrder = (order: any) => {
    // 設定客戶
    setSelectedCustomer(order.customer);
    
    // 設定訂單資訊
    updateOrderInfo(order.orderInfo);
    
    // 清空現有銷售項目並載入訂單項目
    const { clearSalesItems, addSalesItem } = useStore.getState();
    clearSalesItems();
    order.items.forEach((item: any) => {
      addSalesItem(item, item.quantity);
    });
    
    toast.success("訂單已載入至編輯頁面");
    navigate("/");
  };

  // 刪除訂單
  const handleDeleteOrder = (index: number) => {
    if (confirm("確定要刪除此訂單嗎？")) {
      const updatedOrders = orders.filter((_, i) => i !== index);
      localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      toast.success("訂單已刪除");
    }
  };

  // 篩選訂單
  const filteredOrders = orders.filter(order =>
    order.orderInfo?.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 概況卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">總訂單數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月訂單</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter((o: any) => {
                const orderDate = new Date(o.orderInfo?.date);
                const now = new Date();
                return orderDate.getMonth() === now.getMonth() && 
                       orderDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">總金額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${orders.reduce((sum: number, o: any) => 
                sum + (o.items?.reduce((s: number, item: any) => s + item.totalPrice, 0) || 0), 0
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">待處理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{orders.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* 訂單列表 */}
      <Card>
        <CardHeader>
          <CardTitle>訂單紀錄</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜尋訂單編號、客戶名稱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>訂單編號</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>客戶</TableHead>
                  <TableHead className="text-right">數量</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>暫無訂單資料</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order: any, index: number) => {
                    const totalQuantity = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
                    const totalAmount = order.items?.reduce((sum: number, item: any) => sum + item.totalPrice, 0) || 0;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{order.orderInfo?.serialNumber}</TableCell>
                        <TableCell>{order.orderInfo?.date}</TableCell>
                        <TableCell>{order.customer?.name}</TableCell>
                        <TableCell className="text-right">{totalQuantity}</TableCell>
                        <TableCell className="text-right">${totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">待處理</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteOrder(index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
