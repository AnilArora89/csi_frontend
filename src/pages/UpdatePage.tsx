import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAgencyById, updateAgency, Agency } from "@/http/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UpdatePage = () => {
  const { agencyId } = useParams<{ agencyId: string }>();
  const navigate = useNavigate();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAgency = async () => {
      if (agencyId) {
        try {
          const response = await getAgencyById(agencyId);
          setAgency(response);
        } catch (error) {
          console.error("Error fetching agency data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAgency();
  }, [agencyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgency((prevAgency) => {
      if (prevAgency) {
        return { ...prevAgency, [name]: value };
      }
      return null;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (agency) {
      try {
        await updateAgency(agencyId as string, agency);
        navigate("dashboard/agencies");
      } catch (error) {
        console.error("Error updating agency:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!agency) {
    return <div>Error loading agency data</div>;
  }

  return (
    <div>
      <h1>Edit Agency</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="person"
          placeholder="Person Name"
          value={agency.person}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="routeNo"
          placeholder="Route No."
          value={agency.routeNo}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="agencyNo"
          placeholder="Agency No."
          value={agency.agencyNo}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          value={agency.description}
          onChange={handleChange}
        />

        {/* Add more input fields as necessary */}
        <Button type="submit">Update Agency</Button>
      </form>
    </div>
  );
};

export default UpdatePage;
