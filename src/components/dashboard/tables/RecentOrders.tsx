import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

const orders = [
  {
    id: "ORD-1001",
    customer: "Rahul Kumar",
    amount: "₹1,250",
    status: "Delivered",
    date: "Today",
  },
  {
    id: "ORD-1002",
    customer: "Anjali",
    amount: "₹3,420",
    status: "Pending",
    date: "Today",
  },
  {
    id: "ORD-1003",
    customer: "Akhil",
    amount: "₹950",
    status: "Cancelled",
    date: "Yesterday",
  },
  {
    id: "ORD-1004",
    customer: "Sneha",
    amount: "₹5,200",
    status: "Delivered",
    date: "Yesterday",
  },
];

export default function RecentOrders() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id}
                </TableCell>

                <TableCell>{order.customer}</TableCell>

                <TableCell>{order.amount}</TableCell>

                <TableCell>
                  <Badge
                    variant={
                      order.status === "Delivered"
                        ? "default"
                        : order.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>

                <TableCell>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}