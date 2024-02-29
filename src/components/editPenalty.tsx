import { penalties } from "@/lib/data";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function PenaltyItem({
  penalty,
  onEdit,
  index,
  onDelete,
}: {
  penalty: Penalty & { finalAmount: number };
  onEdit: (index: number, penalty: Penalty & { finalAmount: number }) => void;
  index: number;
  onDelete: (index: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(
    penalty
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    penalty.category
  );
  const [amountInput, setAmountInput] = useState(
    penalty.finalAmount.toString()
  );
  const [daysInput, setDaysInput] = useState(
    penalty.finalAmount / penalty.dailyMaxAmount
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(penalties.map((p) => p.category))
    );
    return uniqueCategories.sort();
  }, []);

  // Filter penalties based on the selected category
  const filteredPenalties = useMemo(() => {
    return penalties.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelectPenalty = (value: string) => {
    const newPenalty = penalties.find((p) => p.value.toLowerCase() === value);
    setSelectedPenalty(newPenalty || null);

    if (newPenalty?.dailyFine) {
      setAmountInput(""); // Clear amount input for daily fine calculation
      setDaysInput(""); // Reset days input
    } else {
      // Use nullish coalescing to handle potentially undefined maxAmount
      setAmountInput((newPenalty?.maxAmount ?? 0).toString());
    }
  };

  const calculateFinalAmount = () => {
    if (!selectedPenalty) return 0;

    let finalAmount = parseFloat(amountInput) || 0;

    // Handle daily fine separately
    if (selectedPenalty.dailyFine) {
      const days = parseFloat(daysInput) || 0;
      finalAmount = days * (selectedPenalty.dailyMaxAmount ?? 0);
    }

    // For penalties where doubleTax is true
    if (selectedPenalty.doubleTax) {
      finalAmount *= 2; // Double the input amount
    }

    // For comparative penalties, choose the higher value
    if (selectedPenalty.comparative) {
      finalAmount = Math.max(finalAmount, selectedPenalty.maxAmount ?? 0);
    }

    return finalAmount;
  };

  const handleEdit = () => {
    const finalAmount = calculateFinalAmount();

    if (!isNaN(finalAmount) && finalAmount > 0 && selectedPenalty) {
      onEdit(index, { ...selectedPenalty, finalAmount });
      setIsEditing(false);
      // Optionally reset form/input states here if needed
    }
  };

  const PenaltyList = () => (
    <Command>
      <CommandInput placeholder="Filter penalties..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {filteredPenalties.map((p) => (
            <CommandItem
              key={p.value}
              value={p.value}
              onSelect={handleSelectPenalty}
            >
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-y-0 md:gap-x-6 pt-2">
      {!isEditing ? (
        <>
          <div className="md:col-span-4">{penalty.label}</div>
          <div className="md:col-span-2 flex justify-between items-end md:items-center ">
            <div>
              UGX{" "}
              {new Intl.NumberFormat("en-UG", {
                style: "decimal",
                maximumFractionDigits: 0,
              }).format(penalty.finalAmount)}
            </div>
            <div>
              <Button
                variant="outline"
                type="button"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="mr-2"
              >
                <Pencil2Icon />
              </Button>
              <Button
                variant="destructive"
                type="button"
                size="icon"
                onClick={() => onDelete(index)}
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="md:col-span-2">
            <div className="flex items-center w-full">
              <Label className="md:w-full">Choose Category</Label>

              <Select
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedPenalty(null);
                  setAmountInput("");
                  setDaysInput("");
                }}
                value={selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category to add Penalty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="md:col-span-3 pt-2 md:pt-0">
            {isDesktop ? (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedPenalty ? selectedPenalty.label : "Select Penalty"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PenaltyList />
                </PopoverContent>
              </Popover>
            ) : (
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedPenalty ? selectedPenalty.label : "Select Penalty"}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <PenaltyList />
                </DrawerContent>
              </Drawer>
            )}
          </div>
          {selectedPenalty && selectedPenalty.dailyFine && (
            <div className="md:col-span-2">
              <div className="flex items-center w-full">
                <Label className="md:w-full">Days of Default </Label>
                <Input
                  type="number"
                  value={daysInput}
                  onChange={(e) => setDaysInput(e.target.value)}
                  placeholder="Enter days of default"
                />
              </div>
            </div>
          )}
          {selectedPenalty && !selectedPenalty?.dailyFine && (
            <div className="md:col-span-3 flex items-center justify-between pt-2">
              <div className="flex items-center w-full">
                <Label className="md:w-full">
                  {selectedPenalty && selectedPenalty?.comparative
                    ? "Enter comparative amount"
                    : "Enter Amount"}
                </Label>
                <Input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder={
                    selectedPenalty && selectedPenalty?.comparative
                      ? "Enter comparative amount"
                      : "Max Amount"
                  }
                  min={0}
                  max={
                    selectedPenalty && selectedPenalty.comparative
                      ? undefined
                      : selectedPenalty?.maxAmount
                  }
                />
              </div>
            </div>
          )}
          {selectedPenalty && (
            <div className="md:col-span-1 flex items-center justify-center">
              <Button type="button" onClick={handleEdit}>
                Save
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
