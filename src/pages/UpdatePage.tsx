import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAgencyById, updateAgency } from "@/http/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface Agency {
  person: string;
  routeNo: string;
  agencyNo: string;
  description: string;
  createdAt: string;
  lastCalibrationDates: Date[];
  serviceReportNo: string[];
}

const UpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch agency data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Agency", id],
    queryFn: () => getAgencyById(id || ""),
  });

  // Mutation for updating agency data
  const mutation = useMutation({
    mutationFn: (data: Partial<Agency> & { id: string }) =>
      updateAgency(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Agency"] });
      navigate("/dashboard/agencies");
    },
    onError: (error) => {
      console.error("Error updating agency:", (error as Error).message);
    },
  });

  // State to manage form data
  const [formData, setFormData] = useState<Agency>({
    person: "",
    routeNo: "",
    agencyNo: "",
    description: "",
    createdAt: "",
    lastCalibrationDates: [],
    serviceReportNo: [],
  });

  useEffect(() => {
    if (data) {
      // Correctly initialize formData with fetched data
      setFormData({
        ...data,
        lastCalibrationDates: data.lastCalibrationDates.map(
          (date) => new Date(date)
        ),
      });
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date: Date | null, index: number) => {
    if (date) {
      const updatedDates = [...formData.lastCalibrationDates];
      updatedDates[index] = date;
      setFormData((prevData) => ({
        ...prevData,
        lastCalibrationDates: updatedDates,
      }));
    }
  };

  const handleAddDate = () => {
    setFormData((prevData) => ({
      ...prevData,
      lastCalibrationDates: [...prevData.lastCalibrationDates, new Date()],
    }));
  };

  const handleRemoveDate = (index: number) => {
    const updatedDates = formData.lastCalibrationDates.filter(
      (_, i) => i !== index
    );
    setFormData((prevData) => ({
      ...prevData,
      lastCalibrationDates: updatedDates,
    }));
  };

  const handleServiceReportNoChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const updatedReports = [...formData.serviceReportNo];
    updatedReports[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      serviceReportNo: updatedReports,
    }));
  };

  const handleRemoveServiceReportNo = (index: number) => {
    const updatedReports = formData.serviceReportNo.filter(
      (_, i) => i !== index
    );
    setFormData((prevData) => ({
      ...prevData,
      serviceReportNo: updatedReports,
    }));
  };

  const handleAddServiceReportNo = () => {
    setFormData((prevData) => ({
      ...prevData,
      serviceReportNo: [...prevData.serviceReportNo, ""], // Add a new empty report number
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Find the latest date in lastCalibrationDates
    const latestDate = formData.lastCalibrationDates.reduce(
      (latest, current) => (current > latest ? current : latest),
      new Date(0) // Initialize with the earliest possible date
    );

    const updatedData = {
      person: formData.person,
      routeNo: formData.routeNo,
      agencyNo: formData.agencyNo,
      description: formData.description,
      lastCalibrationDates: [latestDate], // Only include the latest date
      serviceReportNo: formData.serviceReportNo, // Include all service report numbers
    };

    mutation.mutate({ id: id || "", ...updatedData });
  };

  const shouldShowAddButton = formData.serviceReportNo.every(
    (reportNo) => reportNo.trim() === ""
  );

  return (
    <Card className="p-4 shadow-lg rounded-lg border border-gray-200">
      <CardHeader>
        <CardTitle>Edit Agency</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Person Name
            </label>
            <Input
              name="person"
              value={formData.person}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Route No.
            </label>
            <Input
              name="routeNo"
              value={formData.routeNo}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agency No.
            </label>
            <Input
              name="agencyNo"
              value={formData.agencyNo}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Calibration Dates
            </label>
            <div className="space-y-2">
              {formData.lastCalibrationDates.map((date, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <DatePicker
                    selected={date}
                    onChange={(date) => handleDateChange(date as Date, index)}
                    className="border border-gray-300 rounded-md shadow-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveDate(index)}
                    variant="outline"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {formData.lastCalibrationDates.length === 0 && (
                <Button type="button" onClick={handleAddDate} variant="outline">
                  Add Date
                </Button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Report Numbers
            </label>
            <div className="space-y-2">
              {formData.serviceReportNo.map((reportNo, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={reportNo}
                    onChange={(e) => handleServiceReportNoChange(e, index)}
                    className="border border-gray-300 rounded-md shadow-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveServiceReportNo(index)}
                    variant="outline"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {shouldShowAddButton && (
                <Button
                  type="button"
                  onClick={handleAddServiceReportNo}
                  variant="outline"
                >
                  Add Report Number
                </Button>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Update Agency
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/agencies")}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpdatePage;
