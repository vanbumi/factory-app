import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "./status-badge"

const orders = [
  {
    id: "PO-2024-001",
    customer: "PT Maju Jaya",
    product: "Botol HDPE 500ml",
    quantity: "10,000 pcs",
    status: "success" as const,
    statusLabel: "Selesai",
    date: "07 Mei 2024",
  },
  {
    id: "PO-2024-002",
    customer: "CV Sejahtera",
    product: "Kantong PP 30x40",
    quantity: "50,000 pcs",
    status: "info" as const,
    statusLabel: "Produksi",
    date: "06 Mei 2024",
  },
  {
    id: "PO-2024-003",
    customer: "PT Indo Plastik",
    product: "Galon PET 19L",
    quantity: "5,000 pcs",
    status: "warning" as const,
    statusLabel: "Pending",
    date: "05 Mei 2024",
  },
  {
    id: "PO-2024-004",
    customer: "UD Berkah",
    product: "Tutup Botol PP",
    quantity: "100,000 pcs",
    status: "info" as const,
    statusLabel: "Produksi",
    date: "04 Mei 2024",
  },
  {
    id: "PO-2024-005",
    customer: "PT Sentosa",
    product: "Pipa PVC 3 inch",
    quantity: "2,000 m",
    status: "success" as const,
    statusLabel: "Selesai",
    date: "03 Mei 2024",
  },
]

export function RecentOrders() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          Pesanan Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                No. Pesanan
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Pelanggan
              </TableHead>
              <TableHead className="text-muted-foreground font-medium hidden md:table-cell">
                Produk
              </TableHead>
              <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">
                Jumlah
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="border-border/50 hover:bg-muted/50"
              >
                <TableCell className="font-medium font-mono text-sm">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {order.product}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {order.quantity}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} label={order.statusLabel} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
