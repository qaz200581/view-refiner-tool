import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Product {
  id: number;
  code: string;
  vendor: string;
  name: string;
  series: string;
  remark: string;
  price: number;
  tableTitle?: string;      // 表格標題
  tableRowTitle?: string;   // 列 (row)
  tableColTitle?: string;   // 欄 (column)
}

interface ProductTableViewProps {
  products: Product[];
  onSelectProduct: (product: Product, quantity: number) => void;
}

interface GroupedProduct {
  code: string;
  series: string;
  vendor: string;
  remark: string;
  price: number;
  productId: number;
  tableTitle: string;
  tableRowTitle: string;
  tableColTitle: string;
}

export const ProductTableView = ({
  products,
  onSelectProduct,
}: ProductTableViewProps) => {
  const [showAsButton, setShowAsButton] = useState(true);
  const [editableData, setEditableData] = useState<Record<string, string>>({});

  // 按 tableTitle 分組產品
  const groupedProducts = useMemo(() => {
    const grouped: Record<string, GroupedProduct[]> = {};

    products.forEach((product) => {
      const key = product.tableTitle || "未分類";
      if (!grouped[key]) grouped[key] = [];
      if (!key) return;
      grouped[key].push({
        code: product.code,
        series: product.series,
        vendor: product.vendor,
        remark: product.remark,
        price: product.price,
        tableTitle: product.tableTitle || "未分類",
        tableRowTitle: product.tableRowTitle || "",
        tableColTitle: product.tableColTitle || "",
        productId: product.id,
      });
      
    });

    return grouped;
  }, [products]);

  // 橫向欄位：表格第一列
  const getUniqueCols = (products: GroupedProduct[]) =>
    [...new Set(products.map((p) => p.tableColTitle))];

  // 縱向欄位：表格第一欄
  const getUniqueRows = (products: GroupedProduct[]) =>
    [...new Set(products.map((p) => p.tableRowTitle))];

  // 取得某格對應產品
  const getCellProduct = (
    tableTitle: string,
    row: string,
    col: string
  ): GroupedProduct | null => {
    return (
      groupedProducts[tableTitle]?.find(
        (p) => p.tableRowTitle === row && p.tableColTitle === col
      ) || null
    );
  };

  // 點擊按鈕加入單項
  const handleButtonClick = (code: string) => {
    const product = products.find((item) => item.code === code);
    if (product) {
      onSelectProduct(product, 1);
    }
  };

  // 批量確認加入
  const submitToList = () => {
    let count = 0;
    Object.entries(editableData).forEach(([productCode, value]) => {
      const qty = parseInt(value);
      if (value && !isNaN(qty) && qty > 0) {
        const product = products.find((item) => item.code === productCode);
        if (product) {
          onSelectProduct(product, qty);
          count++;
        }
      }
    });

    if (count > 0) {
      toast.success(`已批量添加 ${count} 項產品`);
      setEditableData({});
    } else {
      toast.error("請先輸入產品數量");
    }
  };

  // 更新輸入數量
  const handleInputChange = (code: string, value: string) => {
    setEditableData((prev) => ({ ...prev, [code]: value }));
  };

  return (
    <div className="space-y-4">
      {/* 模式切換 */}
      <div className="flex items-center justify-between sticky top-0 bg-background z-20 py-3 px-4 border-b shadow-sm">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAsButton}
            onChange={(e) => setShowAsButton(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium">
            {showAsButton ? "切換輸入" : "切換按鈕"}
          </span>
        </label>
        {!showAsButton && (
          <Button onClick={submitToList} size="sm">
            確認
          </Button>
        )}
      </div>

      {/* 各表格區塊 */}
      {Object.entries(groupedProducts).map(([tableTitle, list]) => {
        const cols = getUniqueCols(list);
        const rows = getUniqueRows(list);

        return (
          <div key={tableTitle} className="mb-8">
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="border font-bold w-32 text-center">
                      {tableTitle}
                    </TableHead>
                    {cols.map((col) => (
                      <TableHead key={col} className="border text-center">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row}>
                      <TableCell className="border font-medium text-center">
                        {row}
                      </TableCell>
                      {cols.map((col) => {
                        const product = getCellProduct(tableTitle, row, col);
                        return (
                          <TableCell key={col} className="border text-center">
                            {product ? (
                              showAsButton ? (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleButtonClick(product.code)}
                                  className="w-full"
                                >
                                  {product.price}
                                </Button>
                              ) : (
                                <Input
                                  type="text"
                                  value={editableData[product.code] || ""}
                                  onChange={(e) =>
                                    handleInputChange(product.code, e.target.value)
                                  }
                                  placeholder="數量"
                                  className="text-center"
                                />
                              )
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
