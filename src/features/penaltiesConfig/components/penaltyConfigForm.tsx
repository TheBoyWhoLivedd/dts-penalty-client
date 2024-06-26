import { FormHeading } from "@/components/ui/FormHeading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { CustomInputsConfig } from "./customInputsConfig";
import {
  useAddNewPenaltyConfigMutation,
  useUpdatePenaltyConfigMutation,
} from "../penaltyConfigApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { ReloadIcon } from "@radix-ui/react-icons";

const OptionConfigSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const InputConfigSchema = z.object({
  label: z.string(),
  type: z.string(),
  variable: z.string(),
  options: z.array(OptionConfigSchema).optional(),
});

export const PenaltyConfigSchema = z.object({
  category: z.string(),
  taxType: z.string(),
  penaltyTitle: z.string().min(1, {
    message: "Penalty Title must be atleast 1 character",
  }),
  penaltySection: z.string().min(1, {
    message: "Penalty Section must be atleast 1 character",
  }),
  fixed: z.boolean(),
  comparative: z.boolean(),
  doubleTax: z.boolean(),
  penaltyDescription: z.string(),
  requiresCustomInputs: z.boolean(),
  currencyPoints: z.coerce.number().min(1).optional(),
  currencyPointsValue: z.number().optional(),
  inputs: z.array(InputConfigSchema).optional(),
  calculationMethod: z.string().optional(),
  fixedAmount: z.number().optional(),
});

export type FormValues = z.infer<typeof PenaltyConfigSchema>;

interface PenaltyConfigFormProps {
  initialData: PenaltyConfig | null;
}
const PenaltyConfigForm: React.FC<PenaltyConfigFormProps> = ({
  initialData,
}) => {
  const [addNewPenaltyConfig, { isLoading }] = useAddNewPenaltyConfigMutation();

  const [updatePenaltyConfig, { isLoading: isUpdateLoading }] =
    useUpdatePenaltyConfigMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(PenaltyConfigSchema),
    defaultValues: initialData || {
      penaltyTitle: "",
      penaltySection: "",
      fixed: false,
      comparative: false,
      requiresCustomInputs: false,
      doubleTax: false,
      calculationMethod: "",
    },
  });

  const params = useParams();
  const navigate = useNavigate();

  // Watch the "fixed"/"comparative/requiresCustomInputs" checkbox states
  const isFixed = form.watch("fixed");
  const isComparative = form.watch("comparative");
  const requiresCustomInputs = form.watch("requiresCustomInputs");

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "inputs",
  });

  // Function to format numbers with commas for display
  const formatNumberWithCommas = (value: string | number): string => {
    // Ensure input is treated as a string to safely use .replace
    const number = parseInt(value.toString().replace(/,/g, ""), 10);
    if (isNaN(number)) return "";
    return number.toLocaleString();
  };

  // Function to parse string values for submission, removing any commas
  const parseValueForSubmission = (value: string): string => {
    return value.replace(/,/g, "");
  };

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    if (!initialData) {
      try {
        const response = await addNewPenaltyConfig({
          ...data,
          // If currencyPoints is provided, don't send currencyPointsValue from the form
          // It should be calculated server-side or within the mutation if needed
          ...(data.currencyPoints && {
            currencyPointsValue: data.currencyPoints * 25000,
          }),
        }).unwrap();
        toast({
          title: "Success",
          description: response.message,
        });
        navigate("/dash/penalties"); // Adjust the navigation path as needed
      } catch (error) {
        if (typeof error === "object" && error !== null && "data" in error) {
          const errorResponse = error as ErrorResponse;
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Error: ${errorResponse.data.message}`,
          });
        }
      }
    } else {
      console.log("Data for edit", data);
      try {
        const updateResponse = await updatePenaltyConfig({
          id: params.id, // Ensure `params` is available in this context or passed correctly
          ...data,
          // If currencyPoints is provided during update, calculate currencyPointsValue
          ...(data.currencyPoints && {
            currencyPointsValue: data.currencyPoints * 25000,
          }),
        }).unwrap();
        toast({
          title: "Success",
          description: updateResponse.message,
        });
        navigate("/dash/penalties"); // Adjust the navigation path as needed
      } catch (updateError) {
        if (
          typeof updateError === "object" &&
          updateError !== null &&
          "data" in updateError
        ) {
          const errorResponse = updateError as ErrorResponse;
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Error: ${errorResponse.data.message}`,
          });
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-[0.5rem] bg-background shadow-md md:shadow-l p-8">
        <FormHeading title="Category and Tax Type" />
        <div className="md:grid md:grid-cols-2 gap-6 pt-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                <div className="flex items-center w-full">
                  <FormLabel className="w-1/2">Penalty Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Penalty Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["EFRIS", "DTS", "General"].map((category, i) => (
                        <SelectItem key={i} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage className="md:self-center" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxType"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                <div className="flex items-center w-full">
                  <FormLabel className="w-1/2">Applicable Tax Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Applicable Tax Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["VAT", "Income Tax", "All", "None"].map(
                        (category, i) => (
                          <SelectItem key={i} value={category}>
                            {category}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage className="md:self-center" />
              </FormItem>
            )}
          />
        </div>

        <FormHeading title="Penalty Configuration Details" />
        <div className="md:grid md:grid-cols-2 gap-6 pt-2">
          <FormField
            control={form.control}
            name="penaltyTitle"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                  <div className="flex items-center w-full">
                    <FormLabel className="w-1/2">Penalty title</FormLabel>
                    <FormControl>
                      <Input
                        // disabled={loading}
                        placeholder="Enter Penalty Title"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="md:self-center" />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="penaltySection"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                  <div className="flex items-center w-full">
                    <FormLabel className="w-1/2">Penalty Section</FormLabel>
                    <FormControl>
                      <Input
                        // disabled={loading}
                        placeholder="Enter Section as stated in the Act"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="md:self-center" />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="fixed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(isChecked) => {
                      form.setValue("fixed", Boolean(isChecked));
                      if (isChecked) {
                        form.setValue("fixedAmount", 0);
                      } else {
                        form.unregister("fixedAmount");
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Does the Penalty have a Fixed Amount?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {isFixed && (
            <FormField
              control={form.control}
              name="fixedAmount"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                  <div className="flex items-center w-full">
                    <FormLabel className="w-1/2">Fixed Amount (UGX)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Fixed Amount in UGX"
                        type="text"
                        {...field}
                        value={formatNumberWithCommas(field.value || "")}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(parseValueForSubmission(e.target.value))
                          )
                        }
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="md:self-center" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="comparative"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(isChecked) => {
                      form.setValue("comparative", Boolean(isChecked));
                      if (isChecked) {
                        form.setValue("currencyPoints", 0);
                      } else {
                        form.unregister("currencyPoints");
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is Penalty Comparative?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {isComparative && (
            <FormField
              control={form.control}
              name="currencyPoints"
              render={({ field }) => (
                <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                  <div className="flex items-center w-full">
                    <FormLabel className="w-1/2">
                      Enter Fixed Currency Points
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Comparative Currency Points as Stated in Act"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="md:self-center" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="doubleTax"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Is the Penalty Doubled</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requiresCustomInputs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Does Penalty Require Custom Config?</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        {requiresCustomInputs && (
          <CustomInputsConfig
            control={form.control}
            setValue={form.setValue}
            fields={fields}
            append={append}
            remove={remove}
            update={update}
          />
        )}
        <div className="md:grid md:grid-cols-1 gap-6 pt-2">
          <FormField
            control={form.control}
            name="penaltyDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Penalty Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe Penalty as stated in act"
                    className=" mt-2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="mt-2"
          type="submit"
          disabled={isLoading || isUpdateLoading}
        >
          {isLoading || isUpdateLoading ? (
            <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
          ) : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PenaltyConfigForm;
