import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteAgency, getAgency } from "@/http/api";
import { Agency } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
const AgencyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteAgency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Agency"] });
      console.log("Agency deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting Agency:", error.message);
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Agency"],
    queryFn: getAgency,
    staleTime: 10000, // in milliseconds
  });

  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const filteredAgency = data?.data.filter((agency: Agency) =>
    agency.person.toLowerCase().includes(search.toLowerCase())
  );

  const sortedAgencies = filteredAgency.map((agency: Agency) => {
    if (
      agency.lastCalibrationDates &&
      Array.isArray(agency.lastCalibrationDates)
    ) {
      const sortedDates = agency.lastCalibrationDates.sort(
        (a: Date, b: Date) => {
          return new Date(b).getTime() - new Date(a).getTime();
        }
      );
      return {
        ...agency,
        lastCalibrationDates: sortedDates,
        mostRecentDate: sortedDates.length > 0 ? sortedDates[0] : null,
      };
    } else {
      return agency;
    }
  });
  const filteredByMonthAgencies = selectedMonth
    ? sortedAgencies.filter((agency: Agency) => {
        const dueDate = new Date(
          new Date(agency.mostRecentDate).setMonth(
            new Date(agency.mostRecentDate).getMonth() + 6
          )
        );
        return dueDate.getMonth() === new Date(selectedMonth).getMonth();
      })
    : sortedAgencies;

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agency?"
    );
    if (confirmDelete) {
      try {
        await mutation.mutateAsync(id);
        console.log("Agency deleted successfully");
      } catch (error) {
        console.error("Error deleting agency:");
      }
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Agency</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link to="/dashboard/Agency/create">
          <Button>
            <CirclePlus size={20} />
            <span className="ml-2">Add Agency</span>
          </Button>
        </Link>
      </div>
      <div className="mt-4 flex gap-4">
        <Input
          type="search"
          placeholder="Search Agency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full md:w-1/2"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }).map((_, index) => {
            const month = new Date(0, index).toLocaleString("default", {
              month: "long",
            });
            return (
              <option key={index} value={index}>
                {month}
              </option>
            );
          })}
        </select>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Agency</CardTitle>
          <CardDescription>
            Manage your Agency and view their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person Name</TableHead>
                <TableHead>Route No.</TableHead>
                <TableHead>Agency No.</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Service Report No.
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Calibration Date
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Due Calibration Date
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredByMonthAgencies?.map((agency: Agency) => (
                <TableRow key={agency._id}>
                  <TableCell className="font-medium">{agency.person}</TableCell>
                  <TableCell className="font-medium">
                    {agency.routeNo}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{agency.agencyNo}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {agency.description}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {agency.createdAt}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {agency.lastCalibrationDates[0].toString().substring(0, 10)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {(() => {
                      if (agency.lastCalibrationDates[0]) {
                        const futureDate = new Date(
                          agency.lastCalibrationDates[0]
                        );
                        futureDate.setMonth(futureDate.getMonth() + 6);
                        return futureDate.toISOString().substring(0, 10);
                      }
                      return "";
                    })()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/dashboard/Agency/edit/${agency._id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(agency._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>Done</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredByMonthAgencies?.length}</strong> of{" "}
            <strong>{data?.data.length}</strong> Agency
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgencyPage;