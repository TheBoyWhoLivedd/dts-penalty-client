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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues, ParsedInputs } from "./penaltyForm";

export default function AddPenalty({
  onAdd,
  formValues,
  handleCustomInputChange,
}: {
  onAdd: (penalty: Penalty & { finalAmount: number }) => void;
  formValues: FormValues;
  handleCustomInputChange: (variable: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPenalty, setSelectedPenalty] = useState<Penalty | null>(null);
  const [amountInput, setAmountInput] = useState<string>("");

  // Dynamically generate form inputs for custom penalty inputs
  const renderCustomInputs = () => {
    return selectedPenalty?.inputs?.map((input) => {
      switch (input.type) {
        case "number":
          return (
            <div className="md:col-span-3 flex items-center justify-between pt-2">
              <div className="flex items-center w-full">
                <Label className="md:w-full">{input.label}</Label>
                <Input
                  key={input.variable}
                  type="number"
                  value={formValues[input.variable] || ""}
                  onChange={(e) =>
                    handleCustomInputChange(input.variable, e.target.value)
                  }
                  placeholder={input.label}
                />
              </div>
            </div>
          );
        case "select":
          return (
            <Select
              key={input.variable}
              value={formValues[input.variable] || ""}
              onValueChange={(value) =>
                handleCustomInputChange(input.variable, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={input.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {input.options &&
                    input.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        default:
          return null;
      }
    });
  };

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
    penalty && setAmountInput((penalty.currencyPointsValue ?? 0).toString());
    setOpen(false);
  };

  const executeCalculationMethod = (
    methodString: string,
    inputs: FormValues
  ) => {
    try {
      // Convert inputs to the correct types
      const parsedInputs = Object.keys(inputs).reduce<ParsedInputs>(
        (acc, key) => {
          acc[key] = isNaN(Number(inputs[key]))
            ? inputs[key]
            : parseFloat(inputs[key]);
          return acc;
        },
        {}
      );

      // Define a function from the methodString
      // cringe, I know. (temporary solution)
      const fn = new Function("inputs", `return (${methodString});`);

      // Execute the function with parsed inputs
      const result = fn()(parsedInputs);

      return result;
    } catch (error) {
      console.error("Error executing calculation method:", error);
      return null;
    }
  };

  const calculateFinalAmount = () => {
    if (!selectedPenalty) return 0;

    let finalAmount = parseFloat(amountInput) || 0;

    if (selectedPenalty.fixedAmount) {
      return selectedPenalty.fixedAmount;
    }

    if (selectedPenalty.doubleTax) {
      finalAmount *= 2;
    }

    if (selectedPenalty.comparative) {
      finalAmount = Math.max(
        finalAmount,
        selectedPenalty.currencyPointsValue ?? 0
      );
    }

    if (
      selectedPenalty.requiresCustomInputs &&
      selectedPenalty.calculationMethod
    ) {
      // Use the secure execution method for custom calculation logic
      const calculatedValue = executeCalculationMethod(
        selectedPenalty.calculationMethod,
        formValues
      );

      console.log("Calculated Value", calculatedValue);

      if (typeof calculatedValue === "number") {
        finalAmount = calculatedValue;
      }
    }

    return finalAmount;
  };

  const handleSubmit = () => {
    const finalAmount = calculateFinalAmount();
    console.log("final Amount", finalAmount);
    if (!isNaN(finalAmount) && finalAmount > 0 && selectedPenalty) {
      onAdd({ ...selectedPenalty, finalAmount });
      // Reset states after adding
      setSelectedPenalty(null);
      setSelectedCategory("");
      setAmountInput("");
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
        <Select
          onValueChange={(value) => {
            setSelectedCategory(value);
            setSelectedPenalty(null);
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
      {selectedPenalty?.requiresCustomInputs && renderCustomInputs()}
      {selectedPenalty && !selectedPenalty.requiresCustomInputs && (
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
                    : selectedPenalty?.currencyPointsValue
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
