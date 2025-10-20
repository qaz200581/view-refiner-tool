import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type OrderListProps = {
  onLoadOrder?: (order: any) => void;
};

export const OrderList = ({ onLoadOrder }: OrderListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    setOrders(savedOrders);
  };

  const handleEdit = (order: any) => {
    if (onLoadOrder) {
      onLoadOrder(order);
      toast.success("訂單已載入至編輯頁面");
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, orderInfo: { ...order.orderInfo, status: newStatus } }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
    toast.success("訂單狀態已更新");
  };

  const handleDelete = (orderId: string) => {
    if (confirm("確定要刪除此訂單嗎？")) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      localStorage.setItem('pendingOrders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      toast.success("訂單已刪除");
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderInfo?.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
              NT$ {orders.reduce((sum: number, o: any) => 
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
            <div className="text-2xl font-bold text-orange-600">
              {orders.filter(o => o.orderInfo?.status === "待處理").length}
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <TableHead>訂單狀態</TableHead>
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
                  filteredOrders.map((order: any) => {
                    const totalQuantity = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
                    const totalAmount = order.items?.reduce((sum: number, item: any) => sum + item.totalPrice, 0) || 0;
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.orderInfo?.serialNumber}</TableCell>
                        <TableCell>{order.orderInfo?.date}</TableCell>
                        <TableCell>{order.customer?.name}</TableCell>
                        <TableCell className="text-right">{totalQuantity}</TableCell>
                        <TableCell className="text-right">NT$ {totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select
                            value={order.orderInfo?.status || "待處理"}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="待處理">待處理</SelectItem>
                              <SelectItem value="處理中">處理中</SelectItem>
                              <SelectItem value="已出貨">已出貨</SelectItem>
                              <SelectItem value="已完成">已完成</SelectItem>
                              <SelectItem value="已取消">已取消</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(order)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(order.id)}
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
