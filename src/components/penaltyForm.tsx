import { useForm } from "react-hook-form";
import { FormHeading } from "./ui/FormHeading";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import AddPenalty from "./addPenalty";
import PenaltyItem from "./editPenalty";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

export type FormValues = {
  [key: string]: string;
};

export type ParsedInputs = {
  [key: string]: number | string;
};

const PenaltySchema = z.object({
  label: z.string(),
  value: z.string(),
  category: z.string(),
  comparative: z.boolean(),
  fixed: z.boolean(),
  doubleTax: z.boolean(),
  currencyPoints: z.number().optional(),
  currencyPointsValue: z.number().optional(),
  finalAmount: z.number(),
});

const FormSchema = z.object({
  tin: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: "TIN must be a 10-digit number without special characters.",
  }),
  nin: z
    .string()
    .min(8)
    .regex(/^[a-zA-Z0-9]+$/, {
      message:
        "NIN/BRN must be an alphanumeric value and at least 8 characters long.",
    }),
  name: z.string().min(1, "Taxpayer name is required."),
  penalties: z.array(PenaltySchema),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .refine((value) => (value.match(/\S+/g) || []).length >= 8, {
      message: "Description must contain at least 8 words.",
    }),
});

export const PenaltyForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleAddPenalty = (penalty: Penalty & { finalAmount: number }) => {
    console.log("Penalty Receieved", penalty);
    const currentPenalties = form.getValues("penalties") || [];
    form.setValue("penalties", [...currentPenalties, penalty]);
  };

  const handleEditPenalty = (
    index: number,
    updatedPenalty: Penalty & { finalAmount: number }
  ) => {
    const newPenalties = [...penalties];
    newPenalties[index] = updatedPenalty;
    form.setValue("penalties", newPenalties);
  };

  const handleDeletePenalty = (index: number) => {
    const newPenalties = penalties.filter((_, i) => i !== index);
    form.setValue("penalties", newPenalties);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data));
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  //dynamic form handlers  and logic

  // State for dynamic form values
  const [formValues, setFormValues] = useState<FormValues>({});

  // Update dynamic form values
  const handleCustomInputChange = (variable: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [variable]: value,
    }));
  };

  const penalties = form.watch("penalties");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormHeading title="Tax-Payer Details" />
        <div className="md:grid md:grid-cols-2 gap-6 pt-2">
          <FormField
            control={form.control}
            name="tin"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                  <div className="flex items-center w-full">
                    <FormLabel className="w-1/2">TIN *</FormLabel>
                    <FormControl>
                      <Input
                        // disabled={loading}
                        placeholder="Enter TIN"
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
            name="nin"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                  <div className="flex items-center w-full">
                    <FormLabel className="w-1/2">NIN/BRN *</FormLabel>
                    <FormControl>
                      <Input
                        // disabled={loading}
                        placeholder="Enter NIN/BRN"
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
            name="name"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col md:flex-row w-full items-center mb-2">
                  <div className="flex items-center w-full">
                    <FormLabel className="w-1/2">Taxpayer Name</FormLabel>
                    <FormControl>
                      <Input
                        // disabled={loading}
                        placeholder="Enter Name"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="md:self-center" />
                </FormItem>
              </>
            )}
          />
        </div>
        <FormHeading title="Penalty Details" />
        {penalties &&
          penalties.map((penalty, index) => (
            <PenaltyItem
              key={index}
              penalty={penalty}
              index={index}
              onEdit={handleEditPenalty}
              onDelete={handleDeletePenalty}
              formValues={formValues}
              handleCustomInputChange={handleCustomInputChange}
            />
          ))}
        <AddPenalty
          onAdd={handleAddPenalty}
          formValues={formValues}
          handleCustomInputChange={handleCustomInputChange}
        />
        <FormHeading title="Penalty Description" />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Penalty Description</FormLabel> */}
              <FormControl>
                <Textarea
                  placeholder="Describe Penalties Imposed"
                  className=" mt-2"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
                You can <span>@mention</span> other users and organizations.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-2" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
