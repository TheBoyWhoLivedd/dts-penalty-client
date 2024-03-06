import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";

interface CustomInputField {
  id: string;
  label: string;
  type: string;
  variable: string;
}

interface CustomInputsConfigProps {
  fields: CustomInputField[];
  append: (input: Omit<CustomInputField, "id">) => void;
  remove: (index: number) => void;
  update: (index: number, input: Omit<CustomInputField, "id">) => void;
}

export const CustomInputsConfig: React.FC<CustomInputsConfigProps> = ({
  fields,
  append,
  remove,
  update,
}) => {
  console.log("fields", fields);
  const [newInput, setNewInput] = useState({
    label: "",
    type: "",
    variable: "",
  });

  const handleAddInput = () => {
    append(newInput);
    setNewInput({ label: "", type: "", variable: "" });
  };

  const handleSelectChange = (value: string) => {
    setNewInput((prevState) => ({ ...prevState, type: value }));
  };

  const handleInputChange = (
    index: number,
    key: keyof Omit<CustomInputField, "id">,
    value: string
  ) => {
    const updatedField = { ...fields[index], [key]: value };
    update(index, updatedField);
  };

  return (
    <>
      {fields &&
        fields.map((field, index) => (
          <div key={index} className="md:grid md:grid-cols-7 gap-8">
            <div className="col-span-2">
              <Label>Input Type</Label>
              <Select
                value={field.type}
                onValueChange={(value) =>
                  handleInputChange(index, "type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an Input Type" />
                </SelectTrigger>
                <SelectContent>
                  {["Number", "Text"].map((type, i) => (
                    <SelectItem key={i} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
            <Label>Input Name</Label>
              <Input
                value={field.label}
                onChange={(e) =>
                  handleInputChange(index, "label", e.target.value)
                }
                placeholder="Input Name"
              />
            </div>
            <div className="col-span-2">
              <Label>Variable Name</Label>
              <Input
                value={field.variable}
                onChange={(e) =>
                  handleInputChange(index, "variable", e.target.value)
                }
                placeholder="Variable Name"
              />
            </div>
            <div className="col-span-1 flex items-end mt-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <span className="hidden sm:inline">Delete</span>
                <TrashIcon className="ml-0 h-5 w-5 sm:ml-2" />
              </Button>
            </div>
          </div>
        ))}

      <div className="md:grid md:grid-cols-7 gap-8">
        <div className="col-span-2">
          <Label>Input Type</Label>
          <Select
            value={newInput.type}
            onValueChange={(value) => handleSelectChange(value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select an Input Type" />
            </SelectTrigger>
            <SelectContent>
              {["Number", "Text"].map((category, i) => (
                <SelectItem key={i} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Input Name</Label>
          <Input
            value={newInput.label}
            onChange={(e) =>
              setNewInput({ ...newInput, label: e.target.value })
            }
            placeholder="Name of Custom Input"
          />
        </div>
        <div className="col-span-2">
          <Label>Input Variable</Label>

          <Input
            value={newInput.variable}
            onChange={(e) =>
              setNewInput({ ...newInput, variable: e.target.value })
            }
            placeholder="Variable Name"
          />
        </div>
        <div className="col-span-1 flex items-end mt-2">
          <Button type="button" onClick={handleAddInput}>
            <span className="hidden sm:inline">Add</span>
            <PlusIcon className="ml-0 h-5 w-5 sm:ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
};
