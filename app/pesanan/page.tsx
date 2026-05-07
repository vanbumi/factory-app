"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const orders = [
  {
    id: "PO-2024-001",
    customer: "PT Maju Jaya",
    product: "Botol HDPE 500ml",
    quantity: "10,000 pcs",
    value: "Rp 45.000.000",
    orderDate: "01 Mei 2024",
    dueDate: "15 Mei 2024",
    status: "success" as const,
    statusLabel: "Selesai",
  },
  {
    id: "PO-2024-002",
    customer: "CV Sejahtera",
    product: "Kantong PP 30x40",
    quantity: "50,000 pcs",
    value: "Rp 75.000.000",
    orderDate: "02 Mei 2024",
    dueDate: "20 Mei 2024",
    status: "info" as const,
    statusLabel: "Produksi",
  },
  {
    id: "PO-2024-003",
    customer: "PT Indo Plastik",
    product: "Galon PET 19L",
    quantity: "5,000 pcs",
    value: "Rp 125.000.000",
    orderDate: "03 Mei 2024",
    dueDate: "25 Mei 2024",
    status: "warning" as const,
    statusLabel: "Pending",
  },
  {
    id: "PO-2024-004",
    customer: "UD Berkah",
    product: "Tutup Botol PP",
    quantity: "100,000 pcs",
    value: "Rp 30.000.000",
    orderDate: "04 Mei 2024",
    dueDate: "18 Mei 2024",
    status: "info" as const,
    statusLabel: "Produksi",
  },
  {
    id: "PO-2024-005",
    customer: "PT Sentosa",
    product: "Pipa PVC 3 inch",
    quantity: "2,000 m",
    value: "Rp 180.000.000",
    orderDate: "05 Mei 2024",
    dueDate: "30 Mei 2024",
    status: "success" as const,
    statusLabel: "Selesai",
  },
  {
    id: "PO-2024-006",
    customer: "CV Abadi",
    product: "Jerigen HDPE 20L",
    quantity: "3,000 pcs",
    value: "Rp 90.000.000",
    orderDate: "06 Mei 2024",
    dueDate: "22 Mei 2024",
    status: "default" as const,
    statusLabel: "Draft",
  },
]

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
            <p className="text-muted-foreground">
              Kelola pesanan pelanggan
            </p>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Buat Pesanan
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">48</div>
              <p className="text-sm text-muted-foreground">Total Pesanan</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Dalam Produksi</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">Rp 545 jt</div>
              <p className="text-sm text-muted-foreground">Nilai Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari pesanan..."
              className="pl-9 bg-secondary/50 border-0"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Orders Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Daftar Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">No. Pesanan</TableHead>
                  <TableHead className="text-muted-foreground">Pelanggan</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Produk</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Jumlah</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Nilai</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Jatuh Tempo</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-border/50 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.customer}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {order.product}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-medium">
                      {order.value}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {order.dueDate}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} label={order.statusLabel} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Cetak Invoice</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Batalkan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
