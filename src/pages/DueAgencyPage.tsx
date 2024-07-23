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
import { getAgency } from "@/http/api";
import { Agency } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
const DueAgencyPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Agency"],
    queryFn: getAgency,
    staleTime: 10000, // in milliseconds
  });

  const [search, setSearch] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const filteredAgency = data?.data.filter((agency: Agency) =>
    agency.person.toLowerCase().includes(search.toLowerCase())
  );
  const sortedAgencies = filteredAgency.map((agency: Agency) => {
    // Check if the agency has lastCalibrationDates and is an array
    if (
      agency.lastCalibrationDates &&
      Array.isArray(agency.lastCalibrationDates)
    ) {
      const sortedDates = agency.lastCalibrationDates.sort(
        (a: Date, b: Date) => {
          return new Date(b).getTime() - new Date(a).getTime();
        }
      );
      // Return the agency with sorted lastCalibrationDates
      return {
        ...agency,
        lastCalibrationDates: sortedDates,
        mostRecentDate: sortedDates.length > 0 ? sortedDates[0] : null,
      };
    } else {
      // Return the agency as-is if lastCalibrationDates is not defined or not an array
      return agency;
    }
  });
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const dueThisMonthAgencies = sortedAgencies.filter((agency: agency) => {
    if (agency.mostRecentDate) {
      const futureDate = new Date(agency.mostRecentDate);
      futureDate.setMonth(futureDate.getMonth() + 6);
      return (
        futureDate.getMonth() + 1 === currentMonth &&
        futureDate.getFullYear() === currentYear
      );
    }
    return false;
  });

  console.log(sortedAgencies);
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
              <BreadcrumbLink href="/dashboard/agencies">Agency</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>DueAgency</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mt-4">
        <Input
          type="search"
          placeholder="Search Agency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
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
              {dueThisMonthAgencies?.map((agency: Agency) => (
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
                    {agency.serviceReportNo || "N/A"}
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
                          className="cursor-pointer hover:scale-110 text-center"
                          onClick={() =>
                            navigate(`/dashboard/agency/done/${agency._id}`)
                          }
                        >
                          Done
                        </DropdownMenuItem>
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
            Showing <strong>{dueThisMonthAgencies?.length}</strong> of{" "}
            <strong>{data?.data.length}</strong> Agency
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DueAgencyPage;
