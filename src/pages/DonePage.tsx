import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAgencyById, doneeAgency } from "@/http/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Agency {
  serviceReports: string[];
  calibrationDates: string[];
  description?: string;
}

const DonePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serviceReportNo, setServiceReportNo] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  // Fetch existing agency details
  const { isLoading, isError, error } = useQuery<Agency>({
    queryKey: ["agency", id],
    queryFn: () => getAgencyById(id!),
    onError: (error) => {
      console.error("Error fetching agency:", error);
    },
  });

  const mutation = useMutation({
    mutationFn: doneeAgency,
    onSuccess: () => {
      navigate("/dashboard/agency");
    },
    onError: (error: any) => {
      console.error("Error updating service report:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requestPayload = {
      id,
      serviceReports: [serviceReportNo], // Overwrite with new report number
      calibrationDates: [date], // Overwrite with new calibration date
      description, // Update description
    };

    console.log("Request payload:", requestPayload);

    mutation.mutate(requestPayload);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data: {error?.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Complete Service Report</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label
            htmlFor="serviceReportNo"
            className="block text-sm font-medium"
          >
            Service Report No.
          </label>
          <Input
            id="serviceReportNo"
            type="text"
            value={serviceReportNo}
            onChange={(e) => setServiceReportNo(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium">
            Date
          </label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default DonePage;
