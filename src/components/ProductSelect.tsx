import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import {
  Package,
  X,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { ProductSearchFilters } from "./ProductSearchFilters";
import { ProductGridView } from "./ProductGridView";
import { ProductTableView } from "./ProductTableView";

export const ProductSelect = () => {
  const {
    products,
    addSalesItem,
    selectedCustomer,
    productSidebarOpen,
    setProductSidebarOpen,
    loadProductsFromApi,
    isLoadingProducts,
  } = useStore();
  
  // 初次載入時從 API 獲取產品（如果產品列表為空）
  useEffect(() => {
    if (products.length === 0) {
      loadProductsFromApi();
    }
  }, []);

  const [quickSearch, setQuickSearch] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // 獲取所有唯一選項（根據已選篩選條件進行關聯過濾）
  const uniqueVendors = useMemo(
    () => Array.from(new Set(products.map((p) => p.vendor))),
    [products]
  );
  
  const uniqueNames = useMemo(() => {
    let filtered = products;
    if (selectedVendors.length > 0) {
      filtered = filtered.filter(p => selectedVendors.includes(p.vendor));
    }
    return Array.from(new Set(filtered.map((p) => p.name)));
  }, [products, selectedVendors]);
  
  const uniqueSeries = useMemo(() => {
    let filtered = products;
    if (selectedVendors.length > 0) {
      filtered = filtered.filter(p => selectedVendors.includes(p.vendor));
    }
    if (selectedNames.length > 0) {
      filtered = filtered.filter(p => selectedNames.includes(p.name));
    }
    return Array.from(new Set(filtered.map((p) => p.series)));
  }, [products, selectedVendors, selectedNames]);
  
  const uniqueRemarks = useMemo(() => {
    let filtered = products;
    if (selectedVendors.length > 0) {
      filtered = filtered.filter(p => selectedVendors.includes(p.vendor));
    }
    if (selectedNames.length > 0) {
      filtered = filtered.filter(p => selectedNames.includes(p.name));
    }
    if (selectedSeries.length > 0) {
      filtered = filtered.filter(p => selectedSeries.includes(p.series));
    }
    return Array.from(new Set(filtered.map((p) => p.remark)));
  }, [products, selectedVendors, selectedNames, selectedSeries]);

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
  const handleSelectProduct = (product: any, quantity: number = 1) => {
    if (!selectedCustomer) {
      toast.error("請先在「客戶資訊」區域選擇客戶");
      return;
    }
    addSalesItem(product, quantity);
    toast.success(`已添加 ${quantity} x ${product.name}`);
  };

  // 清除所有篩選
  const clearAllFilters = () => {
    setQuickSearch("");
    setSelectedVendors([]);
    setSelectedNames([]);
    setSelectedSeries([]);
    setSelectedRemarks([]);
  };

  return (
    <>
      {/* Sidebar 切換按鈕 */}
      <Button
        onClick={() => setProductSidebarOpen(!productSidebarOpen)}
        className="fixed top-20 right-2 md:right-4 z-40 shadow-lg flex flex-col items-center justify-center py-3 px-2 md:px-4 h-auto"
        size="lg"
      >
        <Package className="w-5 h-5 mb-1" />
        <span className="hidden md:inline [writing-mode:vertical-rl] rotate-360 leading-none tracking-tight text-x">
          產品選擇
        </span>
        <ChevronRight
          className={`w-4 h-4 mt-1 transition-transform ${
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
        className={`fixed top-0 right-0 h-full w-[85vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ${
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
              <ProductSearchFilters
                quickSearch={quickSearch}
                setQuickSearch={setQuickSearch}
                showAdvancedFilters={showAdvancedFilters}
                setShowAdvancedFilters={setShowAdvancedFilters}
                selectedVendors={selectedVendors}
                setSelectedVendors={setSelectedVendors}
                selectedNames={selectedNames}
                setSelectedNames={setSelectedNames}
                selectedSeries={selectedSeries}
                setSelectedSeries={setSelectedSeries}
                selectedRemarks={selectedRemarks}
                setSelectedRemarks={setSelectedRemarks}
                uniqueVendors={uniqueVendors}
                uniqueNames={uniqueNames}
                uniqueSeries={uniqueSeries}
                uniqueRemarks={uniqueRemarks}
                clearAllFilters={clearAllFilters}
              />

              {/* 視圖切換 */}
              <div className="flex gap-1 border rounded-md w-fit">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 產品列表 */}
            <div className="flex-1 overflow-auto">
              {isLoadingProducts ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50 animate-pulse" />
                  <p className="text-lg">載入中...</p>
                  <p className="text-sm">正在從資料庫獲取產品資訊</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">沒有符合的產品</p>
                  <p className="text-sm">請調整搜尋或篩選條件</p>
                </div>
              ) : viewMode === "grid" ? (
                <ProductGridView
                  products={filteredProducts}
                  onSelectProduct={handleSelectProduct}
                />
              ) : (
                <ProductTableView
                  products={filteredProducts}
                  onSelectProduct={handleSelectProduct}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};