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
import { createAgency } from "@/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const formSchema = z.object({
  routeNo: z
    .string()
    .startsWith("R")
    .min(4, {
      message: "Route No must be at least 4 characters.",
    })
    .max(4, {
      message: "Route No must be at max 4 characters.",
    }),
  agencyNo: z
    .string()
    .min(4, {
      message: "Agency No must be at least 4 characters.",
    })
    .max(4, {
      message: "Agency No must be at max 4 characters.",
    }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  serviceReportNo: z.array(
    z.string().min(1, { message: "Service Report No is required" })
  ),
  lastCalibrationDates: z.array(
    z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format")
  ),
  person: z.string().min(2, {
    message: "Person must be at least 2 characters.",
  }),
});

const CreateAgency = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      routeNo: "",
      person: "",
      agencyNo: "",
      serviceReportNo: [""],
      description: "",
      lastCalibrationDates: [""],
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

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAgency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency"] });
      toast.success("Agency created successfully");
      navigate("/dashboard/agencies");
    },
    onError: (error) => {
      console.error("Error creating agency:", error);
      toast.error(`Failed to create agency: ${error.message || error}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formdata = new FormData();
    formdata.append("routeNo", values.routeNo);
    formdata.append("agencyNo", values.agencyNo);
    formdata.append("description", values.description);
    formdata.append("person", values.person);
    formdata.append(
      "lastCalibrationDates",
      JSON.stringify(values.lastCalibrationDates)
    );
    formdata.append("serviceReportNo", JSON.stringify(values.serviceReportNo));

    console.log([...formdata]); // Log FormData entries for debugging
    mutation.mutate(formdata);
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
                  <BreadcrumbPage>Create</BreadcrumbPage>
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
              <CardTitle>Create a new agency</CardTitle>
              <CardDescription>
                Fill out the form below to create a new agency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Person Name</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="routeNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route No</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agencyNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency No</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* <FormField
                  control={form.control}
                  name="coverImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="w-full"
                          {...coverImageRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Book File</FormLabel>
                      <FormControl>
                        <Input type="file" className="w-full" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

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

                {dateFields.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendDate("")}
                  >
                    Add Date
                  </Button>
                )}

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

                {reportFields.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendReport("")}
                  >
                    Add Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default CreateAgency;
