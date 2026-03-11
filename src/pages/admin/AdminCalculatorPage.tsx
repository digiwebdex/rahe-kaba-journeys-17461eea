import { useState, useMemo } from "react";
import { Calculator, Plus, Trash2, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CostItem {
  id: string;
  description: string;
  unitPrice: number;
}

const DEFAULT_ITEMS: CostItem[] = [
  { id: "1", description: "Ticket", unitPrice: 0 },
  { id: "2", description: "Visa", unitPrice: 0 },
  { id: "3", description: "Makkah Hotel", unitPrice: 0 },
  { id: "4", description: "Madina Hotel", unitPrice: 0 },
  { id: "5", description: "Food", unitPrice: 0 },
  { id: "6", description: "Water", unitPrice: 0 },
  { id: "7", description: "Breakfast", unitPrice: 0 },
  { id: "8", description: "Fruits", unitPrice: 0 },
  { id: "9", description: "Miscellaneous", unitPrice: 0 },
];

const fmt = (n: number) => `BDT ${n.toLocaleString("en-IN")}`;

export default function AdminCalculatorPage() {
  const [groupName, setGroupName] = useState("March Umrah Group");
  const [groupDate, setGroupDate] = useState("");
  const [totalHajji, setTotalHajji] = useState(68);
  const [sellingPricePerPerson, setSellingPricePerPerson] = useState(0);
  const [items, setItems] = useState<CostItem[]>(DEFAULT_ITEMS);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof CostItem, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const costPerPerson = useMemo(() => items.reduce((s, i) => s + Number(i.unitPrice || 0), 0), [items]);
  const totalCost = costPerPerson * totalHajji;
  const profitPerPerson = sellingPricePerPerson - costPerPerson;
  const totalProfit = profitPerPerson * totalHajji;
  const totalRevenue = sellingPricePerPerson * totalHajji;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Group Cost Calculator
        </h1>
      </div>

      {/* Group Info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-3">Group Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs">Group Name</Label>
            <Input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Group name" />
          </div>
          <div>
            <Label className="text-xs">Date</Label>
            <Input type="date" value={groupDate} onChange={e => setGroupDate(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Total Pilgrims</Label>
            <Input type="number" value={totalHajji || ""} onChange={e => setTotalHajji(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Cost Items */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Per Person Cost</h2>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-[10px] uppercase text-muted-foreground tracking-wider px-1">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Description</div>
            <div className="col-span-3">Unit Price (BDT)</div>
            <div className="col-span-2 text-right">Total (BDT)</div>
          </div>

          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-secondary/20 rounded-lg p-2">
              <div className="col-span-1 text-xs text-muted-foreground">{idx + 1}</div>
              <div className="col-span-6">
                <Input
                  value={item.description}
                  onChange={e => updateItem(item.id, "description", e.target.value)}
                  placeholder="Cost description"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  value={item.unitPrice || ""}
                  onChange={e => updateItem(item.id, "unitPrice", Number(e.target.value))}
                  placeholder="0"
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <span className="text-sm font-medium">{fmt(Number(item.unitPrice || 0) * totalHajji)}</span>
                <button onClick={() => removeItem(item.id)} className="text-destructive/50 hover:text-destructive ml-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Per person total */}
          <div className="border-t border-border pt-3 mt-2 grid grid-cols-12 gap-2 px-1">
            <div className="col-span-7 text-sm font-bold">Total Cost Per Person</div>
            <div className="col-span-3 text-sm font-bold text-destructive">{fmt(costPerPerson)}</div>
            <div className="col-span-2 text-sm font-bold text-destructive text-right">{fmt(totalCost)}</div>
          </div>
        </div>
      </div>

      {/* Selling Price & Profit */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-3">Package Price & Profit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs">Selling Price Per Person (BDT)</Label>
            <Input
              type="number"
              value={sellingPricePerPerson || ""}
              onChange={e => setSellingPricePerPerson(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card border border-primary/30 rounded-xl p-5">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          📊 Final Summary ({groupName})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-secondary/30 rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase text-muted-foreground mb-1">Total Pilgrims</p>
            <p className="text-lg font-bold text-foreground">{totalHajji}</p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase text-muted-foreground mb-1">Cost Per Person</p>
            <p className="text-lg font-bold text-destructive">{fmt(costPerPerson)}</p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase text-muted-foreground mb-1">Selling Per Person</p>
            <p className="text-lg font-bold text-primary">{fmt(sellingPricePerPerson)}</p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase text-muted-foreground mb-1">Profit Per Person</p>
            <p className={`text-lg font-bold ${profitPerPerson >= 0 ? "text-green-500" : "text-destructive"}`}>{fmt(profitPerPerson)}</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cost ({totalHajji} × {fmt(costPerPerson)})</span>
            <span className="font-bold text-destructive">{fmt(totalCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Revenue ({totalHajji} × {fmt(sellingPricePerPerson)})</span>
            <span className="font-bold text-primary">{fmt(totalRevenue)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-2">
            <span className="font-bold">Total Profit ({totalHajji} × {fmt(profitPerPerson)})</span>
            <span className={`text-lg font-bold ${totalProfit >= 0 ? "text-green-500" : "text-destructive"}`}>{fmt(totalProfit)}</span>
          </div>
        </div>

        {totalProfit > 0 && (
          <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600">Alhamdulillah — Total Profit</p>
            <p className="text-2xl font-bold text-green-500">{fmt(totalProfit)}</p>
          </div>
        )}

        {sellingPricePerPerson > 0 && (
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            Note: This is an estimate only. Actual costs may vary.
          </p>
        )}
      </div>
    </div>
  );
}