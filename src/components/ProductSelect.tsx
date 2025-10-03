import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/hooks/useStore";
import {
  Package,
  Search,
  X,
  Filter,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

export const ProductSelect = () => {
  const {
    products,
    addSalesItem,
    selectedCustomer,
    productSidebarOpen,
    setProductSidebarOpen,
  } = useStore();

  const [quickSearch, setQuickSearch] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 獲取所有唯一選項
  const uniqueVendors = useMemo(
    () => Array.from(new Set(products.map((p) => p.vendor))),
    [products]
  );
  const uniqueNames = useMemo(
    () => Array.from(new Set(products.map((p) => p.name))),
    [products]
  );
  const uniqueSeries = useMemo(
    () => Array.from(new Set(products.map((p) => p.series))),
    [products]
  );
  const uniqueRemarks = useMemo(
    () => Array.from(new Set(products.map((p) => p.remark))),
    [products]
  );

  // 篩選產品
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 快速搜尋
      if (quickSearch) {
        const search = quickSearch.toLowerCase();
        const matchesQuick =
          product.name.toLowerCase().includes(search) ||
          product.vendor.toLowerCase().includes(search) ||
          product.series.toLowerCase().includes(search) ||
          product.remark.toLowerCase().includes(search) ||
          product.code.toLowerCase().includes(search);
        if (!matchesQuick) return false;
      }

      // 進階篩選
      if (selectedVendors.length > 0 && !selectedVendors.includes(product.vendor))
        return false;
      if (selectedNames.length > 0 && !selectedNames.includes(product.name))
        return false;
      if (selectedSeries.length > 0 && !selectedSeries.includes(product.series))
        return false;
      if (selectedRemarks.length > 0 && !selectedRemarks.includes(product.remark))
        return false;

      return true;
    });
  }, [
    products,
    quickSearch,
    selectedVendors,
    selectedNames,
    selectedSeries,
    selectedRemarks,
  ]);

  // 處理選擇產品
  const handleSelectProduct = (product: any) => {
    if (!selectedCustomer) {
      toast.error("請先在「客戶資訊」區域選擇客戶");
      return;
    }
    addSalesItem(product);
    toast.success(`已添加 ${product.name}`);
  };

  // 清除所有篩選
  const clearAllFilters = () => {
    setQuickSearch("");
    setSelectedVendors([]);
    setSelectedNames([]);
    setSelectedSeries([]);
    setSelectedRemarks([]);
  };

  // 切換選項
  const toggleSelection = (
    value: string,
    selected: string[],
    setter: (v: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  return (
    <>
      {/* Sidebar 切換按鈕 */}
      <Button
        onClick={() => setProductSidebarOpen(!productSidebarOpen)}
        className="fixed top-20 right-4 z-40 shadow-lg"
        size="lg"
      >
        <Package className="w-5 h-5 mr-2" />
        產品選擇
        <ChevronRight
          className={`w-4 h-4 ml-2 transition-transform ${
            productSidebarOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Sidebar Overlay */}
      {productSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setProductSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[90vw] lg:w-[85vw] xl:w-[80vw] bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ${
          productSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Card className="h-full rounded-none border-0 flex flex-col">
          <CardHeader className="pb-4 border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Package className="w-5 h-5" />
                產品選擇
                <Badge variant="secondary" className="ml-2">
                  {filteredProducts.length} 項產品
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProductSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden flex flex-col p-6">
            {/* 搜尋與篩選 */}
            <div className="space-y-4 mb-4 flex-shrink-0">
              {/* 快速搜尋 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="快速搜尋產品..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 進階篩選按鈕 */}
              <div className="flex gap-2">
                <Button
                  variant={showAdvancedFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex-1"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  進階篩選
                </Button>
                {(selectedVendors.length > 0 ||
                  selectedNames.length > 0 ||
                  selectedSeries.length > 0 ||
                  selectedRemarks.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    清除篩選
                  </Button>
                )}
              </div>

              {/* 進階篩選選項 */}
              {showAdvancedFilters && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30 animate-fade-in max-h-[40vh] overflow-y-auto">
                  {/* 廠商 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      廠商 ({selectedVendors.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueVendors.map((vendor) => (
                        <label
                          key={vendor}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedVendors.includes(vendor)}
                            onCheckedChange={() =>
                              toggleSelection(
                                vendor,
                                selectedVendors,
                                setSelectedVendors
                              )
                            }
                          />
                          <span className="text-sm">{vendor}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 產品名稱 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      產品名稱 ({selectedNames.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueNames.map((name) => (
                        <label
                          key={name}
                          className="flex items-center gap-2 cursor-pointer w-full"
                        >
                          <Checkbox
                            checked={selectedNames.includes(name)}
                            onCheckedChange={() =>
                              toggleSelection(name, selectedNames, setSelectedNames)
                            }
                          />
                          <span className="text-sm">{name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 系列 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      系列 ({selectedSeries.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSeries.map((series) => (
                        <label
                          key={series}
                          className="flex items-center gap-2 cursor-pointer w-full"
                        >
                          <Checkbox
                            checked={selectedSeries.includes(series)}
                            onCheckedChange={() =>
                              toggleSelection(
                                series,
                                selectedSeries,
                                setSelectedSeries
                              )
                            }
                          />
                          <span className="text-sm">{series}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 備註 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      備註 ({selectedRemarks.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueRemarks.map((remark) => (
                        <label
                          key={remark}
                          className="flex items-center gap-2 cursor-pointer w-full"
                        >
                          <Checkbox
                            checked={selectedRemarks.includes(remark)}
                            onCheckedChange={() =>
                              toggleSelection(
                                remark,
                                selectedRemarks,
                                setSelectedRemarks
                              )
                            }
                          />
                          <span className="text-sm">{remark}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 產品列表 */}
            <div className="flex-1 overflow-auto">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">沒有符合的產品</p>
                  <p className="text-sm">請調整搜尋或篩選條件</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {product.vendor} • {product.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {product.series}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.remark}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {product.code}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-lg font-bold text-primary">
                              ${product.price}
                            </span>
                            <Button size="sm" variant="secondary">
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              加入
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
