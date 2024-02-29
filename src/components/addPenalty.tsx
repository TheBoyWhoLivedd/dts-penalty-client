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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddPenalty({
  onAdd,
}: {
  onAdd: (penalty: Penalty & { finalAmount: number }) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);
  const [amountInput, setAmountInput] = useState<string>("");
  const [daysInput, setDaysInput] = useState("");
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
    const penalty = penalties.find(
      (penalty) => penalty.value.toLowerCase() === value
    );
    setSelectedPenalty(penalty || null);
    // Reset amount input based on penalty's conditions
    if (penalty) {
      if (penalty.dailyFine) {
        setAmountInput(""); // Reset as we will calculate based on daysInput
        setDaysInput(""); // Prepare to input the number of default days
      } else {
        setAmountInput((penalty.maxAmount ?? 0).toString());
      }
    }
    setOpen(false);
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

  const handleSubmit = () => {
    const finalAmount = calculateFinalAmount();
    if (!isNaN(finalAmount) && finalAmount > 0 && selectedPenalty) {
      onAdd({ ...selectedPenalty, finalAmount });
      // Reset states after adding
      setSelectedPenalty(null);
      setSelectedCategory("");
      setAmountInput("");
      setDaysInput(""); // Reset days input for daily fine penalties
    }
  };

  const PenaltyList = () => (
    <Command>
      <CommandInput placeholder="Filter penalties..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {filteredPenalties.map((penalty) => (
            <CommandItem
              key={penalty.value}
              value={penalty.value}
              onSelect={handleSelectPenalty}
            >
              {penalty.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-6 pt-2">
      <div className="md:col-span-2">
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
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
      {selectedCategory && (
        <div className="md:col-span-3">
          {isDesktop ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedPenalty ? selectedPenalty.label : "+ Add Penalty"}
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
                  {selectedPenalty ? selectedPenalty.label : "+ Add Penalty"}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <PenaltyList />
              </DrawerContent>
            </Drawer>
          )}
        </div>
      )}
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
        <>
          <div className="md:col-span-2">
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
        </>
      )}
      {selectedPenalty && (
        <div className="md:col-span-1 flex items-center justify-center">
          <Button onClick={handleSubmit} type="button">
            Add Penalty
          </Button>
        </div>
      )}
    </div>
  );
}
