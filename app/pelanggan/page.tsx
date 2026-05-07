"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Users, Building2, TrendingUp, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const customers = [
  {
    id: "CUS-001",
    name: "PT Maju Jaya",
    contact: "Budi Hartono",
    email: "budi@majujaya.co.id",
    phone: "021-5551234",
    city: "Jakarta",
    totalOrders: 45,
    totalValue: "Rp 2.1 M",
    lastOrder: "07 Mei 2024",
  },
  {
    id: "CUS-002",
    name: "CV Sejahtera",
    contact: "Dewi Lestari",
    email: "dewi@sejahtera.com",
    phone: "022-4447890",
    city: "Bandung",
    totalOrders: 32,
    totalValue: "Rp 1.5 M",
    lastOrder: "06 Mei 2024",
  },
  {
    id: "CUS-003",
    name: "PT Indo Plastik",
    contact: "Ahmad Syafii",
    email: "ahmad@indoplastik.co.id",
    phone: "031-8889012",
    city: "Surabaya",
    totalOrders: 28,
    totalValue: "Rp 980 jt",
    lastOrder: "05 Mei 2024",
  },
  {
    id: "CUS-004",
    name: "UD Berkah",
    contact: "Siti Rahayu",
    email: "siti@udberkah.com",
    phone: "024-7773456",
    city: "Semarang",
    totalOrders: 19,
    totalValue: "Rp 450 jt",
    lastOrder: "04 Mei 2024",
  },
  {
    id: "CUS-005",
    name: "PT Sentosa",
    contact: "Hendra Wijaya",
    email: "hendra@sentosa.co.id",
    phone: "021-6665678",
    city: "Jakarta",
    totalOrders: 52,
    totalValue: "Rp 3.2 M",
    lastOrder: "03 Mei 2024",
  },
  {
    id: "CUS-006",
    name: "CV Abadi",
    contact: "Ratna Sari",
    email: "ratna@cvabadi.com",
    phone: "0274-5559012",
    city: "Yogyakarta",
    totalOrders: 15,
    totalValue: "Rp 320 jt",
    lastOrder: "02 Mei 2024",
  },
]

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pelanggan</h1>
            <p className="text-muted-foreground">
              Kelola data pelanggan Anda
            </p>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pelanggan
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-sm text-muted-foreground">Total Pelanggan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                  <Building2 className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-sm text-muted-foreground">Pelanggan Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">Pelanggan Baru</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">Rp 8.5 M</div>
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari pelanggan..."
            className="pl-9 bg-secondary/50 border-0"
          />
        </div>

        {/* Customers Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Daftar Pelanggan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Pelanggan</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Kontak</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Kota</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Total Pesanan</TableHead>
                  <TableHead className="text-muted-foreground">Total Nilai</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Pesanan Terakhir</TableHead>
                  <TableHead className="text-muted-foreground w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="border-border/50 hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <div className="text-sm">{customer.contact}</div>
                        <div className="text-sm text-muted-foreground">{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {customer.city}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.totalValue}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {customer.lastOrder}
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
                          <DropdownMenuItem>Riwayat Pesanan</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Hapus
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
