import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft } from "lucide-react";

export const ProductForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Button>
        <h2 className="text-2xl font-bold">新增/編輯產品</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本資訊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>產品代碼</Label>
              <Input placeholder="輸入產品代碼" />
            </div>
            <div className="space-y-2">
              <Label>產品名稱</Label>
              <Input placeholder="輸入產品名稱" />
            </div>
            <div className="space-y-2">
              <Label>廠商</Label>
              <Input placeholder="輸入廠商名稱" />
            </div>
            <div className="space-y-2">
              <Label>系列</Label>
              <Input placeholder="輸入系列名稱" />
            </div>
            <div className="space-y-2">
              <Label>型號</Label>
              <Input placeholder="輸入型號" />
            </div>
            <div className="space-y-2">
              <Label>備註/顏色</Label>
              <Input placeholder="輸入備註或顏色" />
            </div>
            <div className="space-y-2">
              <Label>經銷價</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>零售價</Label>
              <Input type="number" placeholder="0" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">取消</Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              儲存
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>表格定位資訊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>表格標題</Label>
              <Input placeholder="輸入表格標題" />
            </div>
            <div className="space-y-2">
              <Label>列標題</Label>
              <Input placeholder="輸入列標題" />
            </div>
            <div className="space-y-2">
              <Label>欄標題</Label>
              <Input placeholder="輸入欄標題" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
