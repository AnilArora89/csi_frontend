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
import { Link } from "react-router-dom";
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const filteredAgency = data?.data.filter((agency: Agency) =>
    agency.routeNo.toLowerCase().includes(search.toLowerCase())
  );

  console.log(filteredAgency);
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
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Route No.</TableHead>
                <TableHead>Agency No.</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Service Report No.
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgency?.map((agency: Agency) => (
                <TableRow key={agency._id}>
                  <TableCell className="hidden sm:table-cell">
                    <img
                      alt={agency.routeNo}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={agency.coverImage}
                      width="64"
                    />
                  </TableCell>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => mutation.mutate(agency._id)}
                        >
                          Delete
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
            Showing <strong>{filteredAgency?.length}</strong> of{" "}
            <strong>{data?.data.length}</strong> Agency
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgencyPage;
