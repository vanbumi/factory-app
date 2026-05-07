import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Factory, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Factory className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PlastikERP</span>
          </div>
          
          <Card className="border-border/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Cek Email Anda</CardTitle>
              <CardDescription>
                Kami telah mengirim link konfirmasi ke email Anda. 
                Silakan klik link tersebut untuk mengaktifkan akun.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground text-center">
                  Tidak menerima email? Cek folder spam atau coba daftar kembali.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/login">
                    Kembali ke Halaman Masuk
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
