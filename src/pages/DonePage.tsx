// src/pages/FormPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAgencyById, updateAgencyServiceReport } from "@/http/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DonePage = () => {
  const { id } = useParams<{ id: string }>(); // Get the agency ID from the URL
  const navigate = useNavigate();
  const [serviceReportNo, setServiceReportNo] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [previousServiceReports, setPreviousServiceReports] = useState([]);
  const [previousCalibrationDates, setPreviousCalibrationDates] = useState([]);

  // Fetch existing agency details
  const {
    data: agency,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agency", id],
    queryFn: () => getAgencyById(id!),
    onSuccess: (data) => {
      if (data) {
        const { serviceReports = [], calibrationDates = [] } = data;
        setPreviousServiceReports(serviceReports);
        setPreviousCalibrationDates(calibrationDates);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: updateAgencyServiceReport,
    onSuccess: () => {
      navigate("/dashboard/agency");
    },
    onError: (error) => {
      console.error("Error updating service report:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedServiceReports = [
      ...previousServiceReports,
      { serviceReportNo, date, description },
    ];

    const requestPayload = {
      id,
      serviceReports: updatedServiceReports,
      calibrationDates: previousCalibrationDates,
    };

    console.log("Request payload:", requestPayload);

    mutation.mutate(requestPayload, {
      onError: (error) => {
        console.error("Submission error:", error.message);
      },
      onSuccess: () => {
        navigate("/dashboard/agency");
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

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
