import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { updateAgency, getAgencyById, saveAgency } from "@/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
  serviceReportNo: z.array(
    z.string().min(1, { message: "Service Report No is required" })
  ),
  lastCalibrationDates: z.array(
    z.string().min(1, { message: "Last Calibration Date is required" })
  ),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
});

const DonePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceReportNo: [""],
      lastCalibrationDates: [""],
      description: "",
    },
  });

  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control: form.control,
    name: "lastCalibrationDates",
  });

  const {
    fields: reportFields,
    append: appendReport,
    remove: removeReport,
  } = useFieldArray({
    control: form.control,
    name: "serviceReportNo",
  });

  const {
    data: agencyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agency", id],
    queryFn: () => getAgencyById(id),
    staleTime: 10000, // in milliseconds
  });

  useEffect(() => {
    if (agencyData) {
      form.reset({
        serviceReportNo: [""], // Initialize with an empty field
        lastCalibrationDates: [""], // Initialize with an empty field
        description: "",
      });
    }
  }, [agencyData, form]);

  const mutation = useMutation({
    mutationFn: (data) => saveAgency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", id] });
      toast.success("Agency updated successfully");
      navigate("/dashboard/agencies");
    },
    onError: (error) => {
      console.error("Error saving agency:", error);
      toast.error(`Failed to save agency: ${error.message || error}`);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedData = {
      ...agencyData,
      description: values.description,
      lastCalibrationDates: [
        ...agencyData.lastCalibrationDates,
        ...values.lastCalibrationDates,
      ],
      serviceReportNo: [
        ...agencyData.serviceReportNo,
        ...values.serviceReportNo,
      ],
    };
    console.log(updatedData);
    mutation.mutate(updatedData);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching agency data</div>;
  }

  return (
    <section>
      <ToastContainer />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/agencies">
                    Agency
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Done</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/agencies">
                <Button
                  variant={"outline"}
                  onClick={() => toast.info("Cancelled")}
                >
                  <span className="ml-2">Cancel</span>
                </Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}
                <span className="ml-2">Submit</span>
              </Button>
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Update Agency Information</CardTitle>
              <CardDescription>
                Fill out the form below to update the agency information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {dateFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`lastCalibrationDates.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Calibration Date</FormLabel>
                        <FormControl>
                          <Input type="date" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeDate(index)}
                        >
                          Remove Date
                        </Button>
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendDate("")}
                >
                  Add Date
                </Button>

                {reportFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`serviceReportNo.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Report No</FormLabel>
                        <FormControl>
                          <Input type="text" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeReport(index)}
                        >
                          Remove Report
                        </Button>
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendReport("")}
                >
                  Add Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default DonePage;
