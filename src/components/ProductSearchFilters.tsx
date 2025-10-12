import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

interface ProductSearchFiltersProps {
  quickSearch: string;
  setQuickSearch: (value: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  selectedVendors: string[];
  setSelectedVendors: (value: string[]) => void;
  selectedNames: string[];
  setSelectedNames: (value: string[]) => void;
  selectedSeries: string[];
  setSelectedSeries: (value: string[]) => void;
  selectedRemarks: string[];
  setSelectedRemarks: (value: string[]) => void;
  uniqueVendors: string[];
  uniqueNames: string[];
  uniqueSeries: string[];
  uniqueRemarks: string[];
  clearAllFilters: () => void;
}

export const ProductSearchFilters = ({
  quickSearch,
  setQuickSearch,
  showAdvancedFilters,
  setShowAdvancedFilters,
  selectedVendors,
  setSelectedVendors,
  selectedNames,
  setSelectedNames,
  selectedSeries,
  setSelectedSeries,
  selectedRemarks,
  setSelectedRemarks,
  uniqueVendors,
  uniqueNames,
  uniqueSeries,
  uniqueRemarks,
  clearAllFilters,
}: ProductSearchFiltersProps) => {
  return (
    <div className="space-y-4">
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
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-2" />
            清除篩選
          </Button>
        )}
      </div>

      {/* 進階篩選選項 */}
      {showAdvancedFilters && (
        <div className="space-y-3 p-4 border rounded-lg bg-muted/30 animate-fade-in">
          <MultiSelectDropdown
            options={uniqueVendors}
            selected={selectedVendors}
            onChange={setSelectedVendors}
            label="廠商"
            placeholder="搜尋廠商..."
          />
          <MultiSelectDropdown
            options={uniqueNames}
            selected={selectedNames}
            onChange={setSelectedNames}
            label="產品名稱"
            placeholder="搜尋產品名稱..."
          />
          <MultiSelectDropdown
            options={uniqueSeries}
            selected={selectedSeries}
            onChange={setSelectedSeries}
            label="系列"
            placeholder="搜尋系列..."
          />
          <MultiSelectDropdown
            options={uniqueRemarks}
            selected={selectedRemarks}
            onChange={setSelectedRemarks}
            label="備註"
            placeholder="搜尋備註..."
          />
        </div>
      )}
    </div>
  );
};