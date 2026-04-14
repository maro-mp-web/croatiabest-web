import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MapPin, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Settings, 
  TrendingUp, 
  AlertCircle,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Ukupno Objekata', value: '1,284', icon: MapPin, color: 'text-blue-600' },
    { label: 'Aktivne Pretplate', value: '412', icon: CreditCard, color: 'text-green-600' },
    { label: 'Novi Članci (30d)', value: '18', icon: FileText, color: 'text-purple-600' },
    { label: 'Posjeti Danas', value: '5.2k', icon: Users, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Upravljajte portalom CroatiaBest</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/ai-writer">
              <Button className="bg-primary">
                <Sparkles className="size-4 mr-2" /> AI Pisač
              </Button>
            </Link>
            <Button variant="outline">
              <Plus className="size-4 mr-2" /> Novi Listing
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-secondary ${stat.color}`}>
                    <stat.icon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Management Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Nedavne Aktivnosti</CardTitle>
                <CardDescription>Najnoviji listingi i prijave</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">R</div>
                        <div>
                          <p className="font-bold">Restoran "Galeb"</p>
                          <p className="text-xs text-muted-foreground">Zadar • Dodano prije 2h</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Plaćeno (89€)</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-6 text-primary">Vidi svu aktivnost</Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Maintenance */}
          <div className="space-y-8">
            <Card className="bg-primary text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" /> Status Sustava
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Server Status</span>
                  <span className="font-bold">Online</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Plaćanja</span>
                  <span className="font-bold">Aktivno</span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[98%]" />
                </div>
                <p className="text-xs text-white/60">Svi sustavi rade optimalno.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brze Postavke</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                  <Users className="size-4 mr-3" /> Korisnici
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                  <Settings className="size-4 mr-3" /> Konfiguracija Portala
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                  <AlertCircle className="size-4 mr-3" /> Prijavljeni Problemi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}