"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function MainContent() {
  const data = [
    {
      name: "John Doe",
      job: "Frontend Dev",
      status: "Interview",
    },
    {
      name: "Jane Smith",
      job: "Backend Dev",
      status: "Selected",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Interview":
        return "secondary";
      case "Selected":
        return "default";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Candidates", value: 120 },
          { title: "Jobs", value: 25 },
          { title: "Applications", value: 300 },
          { title: "Selected", value: 45 },
        ].map((item, i) => (
          <Card key={i} className="border-l-4 border-l-primary bg-linear-to-br from-card via-card to-secondary/10">
            <CardContent className="p-5">
              <p className="text-muted-foreground">{item.title}</p>
              <h2 className="text-2xl font-bold">{item.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-4">Recent Applications</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.job}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="font-medium text-secondary-foreground transition-colors hover:text-primary">
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
