import { useForm } from "react-hook-form";
import { FormHeading } from "../../../components/ui/FormHeading";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { toast } from "../../../components/ui/use-toast";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import AddPenalty from "../../../components/addPenalty";
import PenaltyItem from "../../../components/editPenalty";
import { useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { useSelector } from "react-redux";
import { selectCurrentToken, setCredentials } from "@/features/auth/authSlice";
import useAuth from "@/hooks/useAuth";
import { Cross2Icon, ReloadIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";

export type FormValues = {
  [key: string]: string;
};

export type ParsedInputs = {
  [key: string]: number | string;
};

const PenaltySchema = z.object({
  id: z.string(),
  penaltyTitle: z.string(),
  penaltySection: z.string(),
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
  nin: z.string().optional(),
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
  attachments: z.array(z.string()).optional(),
});
interface PenaltyFormProps {
  data: PenaltyConfig[];
}
export const PenaltyForm: React.FC<PenaltyFormProps> = ({ data }) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";
  const token = useSelector(selectCurrentToken);
  const { userId } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tin: "",
      nin: "",
      name: "",
    },
  });

  // Update dynamic form values
  const handleCustomInputChange = (variable: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [variable]: value,
    }));
  };

  const handleAddPenalty = (
    penalty: PenaltyConfig & { finalAmount: number }
  ) => {
    console.log("Penalty Receieved", penalty);
    const currentPenalties = form.getValues("penalties") || [];
    form.setValue("penalties", [...currentPenalties, penalty]);
  };

  const handleEditPenalty = (
    index: number,
    updatedPenalty: Omit<PenaltyConfig, "_id"> & { finalAmount: number }
  ) => {
    const newPenalties = [...penalties];
    newPenalties[index] = updatedPenalty;
    form.setValue("penalties", newPenalties);
  };

  const handleDeletePenalty = (index: number) => {
    const newPenalties = penalties.filter((_, i) => i !== index);
    form.setValue("penalties", newPenalties);
  };

  const handleUploadClick = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      // console.log("selectedFiles", selectedFiles);
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Uploaded Files", data);
      const newFileInfos = data.results.map(
        (result: { url: string; originalName: string }) => result.url
      );
      form.setValue("attachments", [
        ...(form.getValues("attachments") || []),
        ...newFileInfos,
      ]);
      setSelectedFiles([]);
    } catch (error) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorResponse = error as ErrorResponse;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error: ${errorResponse.data.message}`,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify({ ...data, userId }));
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">
    //         {JSON.stringify({ ...data, userId }, null, 2)}
    //       </code>
    //     </pre>
    //   ),
    // });

    setLoading(true);
    sendPaymentRequest(data)
      .then((blob) => {
        console.log("Received blob size:", blob.size);

        const pdfUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "payment-record.pdf");
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(pdfUrl);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error generating report", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error: ${error.message}`,
        });
        // alert("Could not generate report");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function sendPaymentRequest(data: z.infer<typeof FormSchema>) {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const requestConfig: RequestInit = {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ ...data, userId }),
      credentials: "include",
    };

    let response = await fetch(`${apiUrl}/payments`, requestConfig);

    if (response.status === 403) {
      console.log("Token expired, refreshing...");
      const refreshResponse = await fetch(`${apiUrl}/auth/refresh`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();

        dispatch(setCredentials({ accessToken: refreshData.accessToken }));

        headers.set("Authorization", `Bearer ${refreshData.accessToken}`);
        // Retry the request with new token
        response = await fetch(`${apiUrl}/payments`, requestConfig);
      } else {
        throw new Error("Session expired. Please login again.");
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to process payment.");
    }

    return response.blob();
  }

  const fetchTaxpayerDetails = async (tin: string) => {
    console.log("Fetching Tax Payer Details");
    if (!tin) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid TIN.",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/payments/getTinDetails/${tin}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch taxpayer details");
      }
      const result = await response.json();
      if (result.statusCode === 200) {
        const details = result.data;
        // Check if the data has an error code or empty values that suggest invalid TIN
        if (details.ErrorCode === "E004" || details.TaxPayerId === "") {
          toast({
            variant: "destructive",
            title: "Invalid TIN",
            description: details.ErrorDesc || "The provided TIN is invalid.",
          });
          form.reset({ nin: "", name: "" });
        } else {
          form.setValue("nin", details.Nin || details.Brn || "");
          form.setValue("name", details.TaxPayerName || "");
        }
      } else {
        throw new Error(result.responseMessage || "An unknown error occurred");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching taxpayer details:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch taxpayer details",
        description: error.message || "Network error",
      });
    }
  };

  const penalties = form.watch("penalties");
  const images = form.watch("attachments");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-2 md:p-5 lg:px-25 bg-background rounded-md"
      >
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
                        onBlur={() =>
                          fetchTaxpayerDetails(form.getValues("tin"))
                        }
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
              penalties={data}
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
          penalties={data}
          onAdd={handleAddPenalty}
          formValues={formValues}
          handleCustomInputChange={handleCustomInputChange}
        />
        <FormHeading title="Attachments (Optional)" />
        {images && images.length > 0 && (
          <div>
            <div className="flex flex-wrap mt-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="w-32 h-32 relative group">
                  <img
                    src={image}
                    alt={`Uploaded #${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg transition-all duration-200 ease-in-out transform group-hover:opacity-50"
                  />

                  <button
                    type="button"
                    className="absolute inset-0 m-auto w-10 h-10 bg-red-300 rounded-full text-white opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transition-opacity duration-150 ease-in-out"
                    onClick={() => {
                      const newImages = images.filter((_, i) => i !== index);
                      form.setValue("attachments", newImages);
                    }}
                  >
                    <Cross2Icon />
                  </button>

                  <button
                    type="button"
                    className="absolute right-2 top-2 w-6 h-6 bg-red-300 rounded-full text-white flex items-center justify-center md:hidden"
                    onClick={() => {
                      const newImages = images.filter((_, i) => i !== index);
                      form.setValue("attachments", newImages);
                    }}
                  >
                    <Cross2Icon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-row justify-between items-end gap-2">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="attachments"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Photo Evidence</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedFiles(Array.from(e.target.files));
                        }
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              disabled={!selectedFiles.length || uploading}
              onClick={handleUploadClick}
            >
              {uploading ? (
                <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
              ) : null}
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>

        <FormHeading title="Officer's Remarks" />
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

        <Button disabled={uploading || loading} className="mt-2" type="submit">
          {loading ? (
            <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
          ) : null}
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
