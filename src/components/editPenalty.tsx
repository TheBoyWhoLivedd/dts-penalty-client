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
import {
  FormValues,
  ParsedInputs,
} from "../features/payments/components/penaltyForm";

interface PenaltyItemProps {
  penalty: Omit<PenaltyConfig, "_id"> & { finalAmount: number };
  onEdit: (
    index: number,
    penalty: Omit<PenaltyConfig, "_id"> & { finalAmount: number }
  ) => void;
  index: number;
  onDelete: (index: number) => void;
  formValues: FormValues;
  handleCustomInputChange: (variable: string, value: string) => void;
  penalties: PenaltyConfig[];
  selectedCategory: string;
  // setSelectedCategory: (category: string) => void;
}

const PenaltyItem: React.FC<PenaltyItemProps> = ({
  penalty,
  onEdit,
  index,
  onDelete,
  formValues,
  handleCustomInputChange,
  penalties,
  selectedCategory,
 
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [selectedPenalty, setSelectedPenalty] = useState<Omit<
    PenaltyConfig,
    "_id"
  > | null>(penalty);

  // const [selectedCategory, setSelectedCategory] = useState<string>(
  //   penalty.category
  // );

  const [amountInput, setAmountInput] = useState(
    penalty.finalAmount.toString()
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  // Extract unique categories
  // const categories = useMemo(() => {
  //   const uniqueCategories = Array.from(
  //     new Set(penalties.map((p) => p.category))
  //   );
  //   return uniqueCategories.sort();
  // }, [penalties]);

  // Filter penalties based on the selected category
  const filteredPenalties = useMemo(() => {
    return penalties.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, penalties]);

  const handleSelectPenalty = (value: string) => {
    const newPenalty = penalties.find((penalty) => penalty.id === value);
    setSelectedPenalty(newPenalty || null);
    setAmountInput((newPenalty?.currencyPointsValue ?? 0).toString());
    setOpen(false);
  };

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

  const executeCalculationMethod = (
    methodString: string,
    inputs: FormValues
  ) => {
    try {
      const allowedOps = {
        MAX: Math.max,
        MIN: Math.min,
      };

      // Convert inputs to the correct types and only include allowed variables
      const parsedInputs = Object.keys(inputs).reduce<ParsedInputs>(
        (acc, key) => {
          acc[key] = isNaN(Number(inputs[key]))
            ? inputs[key]
            : parseFloat(inputs[key]);
          return acc;
        },
        {}
      );

      const preparedExpression = Object.keys(allowedOps).reduce((expr, op) => {
        // const safeOp = allowedOps[op].toString();
        return expr.replace(new RegExp(op, "g"), `allowedOps.${op}`);
      }, methodString);

      console.log("Prepared Exrpression", preparedExpression);

      const executeExpression = new Function(
        "inputs",
        "allowedOps",
        `with(inputs) { return ${preparedExpression}; }`
      );

      console.log("built function", executeExpression);

      const result = executeExpression(parsedInputs, allowedOps);

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

  const handleEdit = () => {
    const finalAmount = calculateFinalAmount();

    if (!isNaN(finalAmount) && finalAmount > 0 && selectedPenalty) {
      onEdit(index, { ...selectedPenalty, finalAmount });
      setIsEditing(false);
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
              key={penalty._id}
              value={penalty.penaltyTitle}
              onSelect={() => handleSelectPenalty(penalty.id)}
            >
              {penalty.penaltyTitle}
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
          <div className="md:col-span-4">{penalty.penaltyTitle}</div>
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
          {/* <div className="md:col-span-2">
            <div className="flex items-center w-full">
              <Label className="md:w-full">Choose Category</Label>

              <Select
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedPenalty(null);
                  setAmountInput("");
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
          </div> */}
          <div className="md:col-span-3 pt-2 md:pt-0">
            {isDesktop ? (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedPenalty
                      ? selectedPenalty.penaltyTitle
                      : "Select Penalty"}
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
                    {selectedPenalty
                      ? selectedPenalty.penaltyTitle
                      : "Select Penalty"}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <PenaltyList />
                </DrawerContent>
              </Drawer>
            )}
          </div>
          {selectedPenalty?.requiresCustomInputs && renderCustomInputs()}
          {selectedPenalty && !selectedPenalty.requiresCustomInputs && (
            <>
              <div className="md:col-span-2">
                <div className="flex items-center w-full">
                  <Label className="md:w-full">
                    {selectedPenalty.doubleTax
                      ? `Enter Amount (will be doubled)`
                      : selectedPenalty.comparative
                      ? "Enter comparative amount"
                      : "Enter Amount"}
                  </Label>
                  <Input
                    type="number"
                    value={
                      selectedPenalty.fixedAmount
                        ? selectedPenalty.fixedAmount.toString()
                        : amountInput
                    }
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder={
                      selectedPenalty.comparative
                        ? "Enter comparative amount"
                        : "Max Amount"
                    }
                    min={0}
                    disabled={!!selectedPenalty.fixedAmount}
                    max={
                      selectedPenalty.comparative
                        ? undefined
                        : selectedPenalty.currencyPointsValue
                    }
                  />
                </div>
              </div>
            </>
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
};
export default PenaltyItem;
