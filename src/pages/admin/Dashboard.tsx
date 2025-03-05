import React from 'react';
import { Building2, Users, ClipboardList, GraduationCap } from 'lucide-react';

const DashboardCard = ({ icon: Icon, title, count, description }: {
  icon: React.ElementType;
  title: string;
  count: number;
  description: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-primary-darker">{title}</h3>
        <p className="text-3xl font-bold mt-2 text-primary">{count}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <Icon className="w-12 h-12 text-primary opacity-20" />
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-darker mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={Building2}
          title="Toplam Şirket"
          count={12}
          description="Aktif müşteri şirketler"
        />
        <DashboardCard
          icon={Users}
          title="Toplam Kullanıcı"
          count={156}
          description="Tüm kullanıcılar"
        />
        <DashboardCard
          icon={ClipboardList}
          title="Aktif Test"
          count={8}
          description="Yayında olan testler"
        />
        <DashboardCard
          icon={GraduationCap}
          title="Eğitimler"
          count={4}
          description="Mevcut eğitim programları"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;