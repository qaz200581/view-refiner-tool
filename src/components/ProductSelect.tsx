import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useStore, Product } from "@/hooks/useStore";
import { Search, Package, Grid, List, Plus } from "lucide-react";
import { toast } from "sonner";

// 模擬產品資料
const mockProducts: Product[] = [
  {
    id: "p1", code: "A001", name: "可口可樂", series: "碳酸飲料", vendor: "可口可樂公司",
    remark: "經典口味", price: 25, originalPrice: 25, state: "啟用中"
  },
  {
    id: "p2", code: "A002", name: "百事可樂", series: "碳酸飲料", vendor: "百事公司", 
    remark: "清爽口味", price: 23, originalPrice: 25, state: "啟用中"
  },
  {
    id: "p3", code: "B001", name: "舒跑", series: "運動飲料", vendor: "維他露食品",
    remark: "電解質補充", price: 20, originalPrice: 20, state: "啟用中"
  },
  {
    id: "p4", code: "B002", name: "寶礦力水得", series: "運動飲料", vendor: "大塚製藥",
    remark: "快速補水", price: 22, originalPrice: 22, state: "預購中"
  },
  {
    id: "p5", code: "C001", name: "茶裡王", series: "茶類飲品", vendor: "統一企業",
    remark: "無糖綠茶", price: 18, originalPrice: 20, state: "啟用中"
  },
  {
    id: "p6", code: "C002", name: "午後の紅茶", series: "茶類飲品", vendor: "麒麟",
    remark: "奶茶口味", price: 28, originalPrice: 30, state: "停用"
  },
];

export const ProductSelect = () => {
  const {
    products,
    setProducts,
    addSalesItem,
    selectedCustomer,
    getProductPrice,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchVendor, setSearchVendor] = useState("");
  const [searchSeries, setSearchSeries] = useState("");
  const [searchRemark, setSearchRemark] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [showAsButton, setShowAsButton] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 初始化產品資料
  useMemo(() => {
    if (products.length === 0) {
      setProducts(mockProducts);
    }
  }, [products.length, setProducts]);

  // 篩選產品
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (product.state === "停用") return false;
      
      // 一般搜尋
      if (searchQuery) {
        const keywords = searchQuery.toLowerCase().split(" ").filter(k => k.trim());
        const matchesGeneral = keywords.every(keyword =>
          product.name.toLowerCase().includes(keyword) ||
          product.vendor.toLowerCase().includes(keyword) ||
          product.series.toLowerCase().includes(keyword) ||
          (product.remark && product.remark.toLowerCase().includes(keyword)) ||
          product.code.toLowerCase().includes(keyword)
        );
        if (!matchesGeneral) return false;
      }
      
      // 進階搜尋
      if (searchName && !product.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      if (searchVendor && !product.vendor.toLowerCase().includes(searchVendor.toLowerCase())) {
        return false;
      }
      if (searchSeries && !product.series.toLowerCase().includes(searchSeries.toLowerCase())) {
        return false;
      }
      if (searchRemark && !(product.remark || "").toLowerCase().includes(searchRemark.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [products, searchQuery, searchName, searchVendor, searchSeries, searchRemark]);

  // 按廠商分組產品
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach(product => {
      if (!groups[product.vendor]) {
        groups[product.vendor] = [];
      }
      groups[product.vendor].push(product);
    });
    return groups;
  }, [filteredProducts]);

  // 獲取獨特的系列
  const getUniqueSeries = (products: Product[]) => {
    return [...new Set(products.map(p => p.series))];
  };

  // 獲取獨特的備註
  const getUniqueRemarks = (products: Product[]) => {
    return [...new Set(products.map(p => p.remark || ""))].filter(Boolean);
  };

  // 根據廠商、系列、備註找到產品
  const getCellProduct = (vendor: string, series: string, remark: string) => {
    return products.find(p => 
      p.vendor === vendor && 
      p.series === series && 
      (p.remark || "") === remark &&
      p.state !== "停用"
    );
  };

  // 選擇產品
  const handleSelectProduct = (product: Product) => {
    if (!selectedCustomer) {
      toast.error("請先選擇客戶", {
        description: "請先至客戶資訊選擇客戶",
        duration: 3000
      });
      return;
    }

    const quantity = 1;
    addSalesItem(product, quantity);
    toast.success(`已添加 ${product.name} x${quantity}`);
  };

  // 批量添加產品（表格模式）
  const handleBatchAdd = () => {
    if (!selectedCustomer) {
      toast.error("請先選擇客戶", {
        description: "請先至客戶資訊選擇客戶",
        duration: 3000
      });
      return;
    }

    let addedCount = 0;
    Object.entries(quantities).forEach(([productCode, quantity]) => {
      if (quantity > 0) {
        const product = products.find(p => p.code === productCode);
        if (product) {
          addSalesItem(product, quantity);
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      toast.success(`已批量添加 ${addedCount} 項產品`);
      setQuantities({});
    } else {
      toast.warning("請先輸入商品數量");
    }
  };

  // 更新數量
  const updateQuantity = (productCode: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({ ...prev, [productCode]: numValue }));
  };

  // 獲取狀態顏色
  const getStateColor = (state: Product['state']) => {
    switch (state) {
      case '啟用中': return 'status-active';
      case '停用': return 'status-inactive';
      case '預購中': return 'bg-primary text-primary-foreground';
      case '售完停產': return 'status-pending';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="card-elegant animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Package className="w-5 h-5" />
          產品選擇
        </CardTitle>
        
        {/* 搜尋框 */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="快速搜尋：產品名稱、廠商、系列..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-elegant pl-10"
            />
          </div>
          
          {/* 進階篩選切換 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full"
          >
            {showAdvancedFilters ? "隱藏進階篩選" : "顯示進階篩選"}
          </Button>

          {/* 進階篩選 */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-accent/20 rounded-lg animate-slide-up">
              <div className="space-y-2">
                <Label htmlFor="search-name" className="text-xs font-medium">產品名稱</Label>
                <Input
                  id="search-name"
                  placeholder="搜尋產品名稱..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="input-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search-vendor" className="text-xs font-medium">廠商</Label>
                <Input
                  id="search-vendor"
                  placeholder="搜尋廠商..."
                  value={searchVendor}
                  onChange={(e) => setSearchVendor(e.target.value)}
                  className="input-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search-series" className="text-xs font-medium">系列</Label>
                <Input
                  id="search-series"
                  placeholder="搜尋系列..."
                  value={searchSeries}
                  onChange={(e) => setSearchSeries(e.target.value)}
                  className="input-elegant"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search-remark" className="text-xs font-medium">備註</Label>
                <Input
                  id="search-remark"
                  placeholder="搜尋備註..."
                  value={searchRemark}
                  onChange={(e) => setSearchRemark(e.target.value)}
                  className="input-elegant"
                />
              </div>

              {/* 清除篩選按鈕 */}
              {(searchName || searchVendor || searchSeries || searchRemark) && (
                <div className="col-span-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchName("");
                      setSearchVendor("");
                      setSearchSeries("");
                      setSearchRemark("");
                    }}
                    className="w-full"
                  >
                    清除所有篩選
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              清單模式
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              表格模式
            </TabsTrigger>
          </TabsList>

          {/* 清單模式 */}
          <TabsContent value="list" className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {product.code}
                        </Badge>
                        <Badge className={`text-xs ${getStateColor(product.state)}`}>
                          {product.state}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.vendor} • {product.series}
                      </p>
                      {product.remark && (
                        <p className="text-xs text-muted-foreground">{product.remark}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          ${getProductPrice(product.code)}
                        </div>
                        {product.price !== product.originalPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            ${product.originalPrice}
                          </div>
                        )}
                      </div>
                      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 表格模式 */}
          <TabsContent value="table" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="input-mode"
                  checked={!showAsButton}
                  onCheckedChange={(checked) => setShowAsButton(!checked)}
                />
                <Label htmlFor="input-mode" className="text-sm">
                  {showAsButton ? '切換為輸入模式' : '切換為按鈕模式'}
                </Label>
              </div>
              
              {!showAsButton && (
                <Button onClick={handleBatchAdd} className="btn-secondary">
                  批量確認
                </Button>
              )}
            </div>

            <div className="space-y-6 max-h-96 overflow-auto">
              {Object.entries(groupedProducts).map(([vendor, vendorProducts]) => (
                <div key={vendor} className="space-y-2">
                  <h4 className="font-medium text-primary border-b pb-2">{vendor}</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-2 font-medium">系列</th>
                          {getUniqueRemarks(vendorProducts).map(remark => (
                            <th key={remark} className="text-center p-2 font-medium min-w-20">
                              {remark}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getUniqueSeries(vendorProducts).map(series => (
                          <tr key={series} className="border-t">
                            <td className="p-2 font-medium text-muted-foreground">{series}</td>
                            {getUniqueRemarks(vendorProducts).map(remark => {
                              const product = getCellProduct(vendor, series, remark);
                              return (
                                <td key={remark} className="text-center p-2">
                                  {product ? (
                                    showAsButton ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleSelectProduct(product)}
                                        className="min-w-16"
                                      >
                                        ${getProductPrice(product.code)}
                                      </Button>
                                    ) : (
                                      <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={quantities[product.code] || ""}
                                        onChange={(e) => updateQuantity(product.code, e.target.value)}
                                        className="w-16 text-center"
                                      />
                                    )
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};