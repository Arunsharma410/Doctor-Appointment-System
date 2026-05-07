import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Users,
  Stethoscope,
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Avatar, AvatarFallback } from '../../components/ui/Avatar';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    const styles = {
      pending: 'warning',
      confirmed: 'default',
      completed: 'success',
      cancelled: 'destructive',
    };
    return styles[status] || 'secondary';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Here's what's happening with your clinic today.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Patients',
            value: stats?.users?.totalPatients || 0,
            icon: <Users className="h-6 w-6 text-blue-600" />,
            bgColor: 'bg-blue-50',
          },
          {
            label: 'Total Doctors',
            value: stats?.users?.totalDoctors || 0,
            icon: <Stethoscope className="h-6 w-6 text-green-600" />,
            bgColor: 'bg-green-50',
          },
          {
            label: 'Appointments',
            value: stats?.appointments?.total || 0,
            icon: <Calendar className="h-6 w-6 text-orange-600" />,
            bgColor: 'bg-orange-50',
          },
          {
            label: 'Revenue',
            value: `₹${stats?.totalRevenue || 0}`,
            icon: <IndianRupee className="h-6 w-6 text-purple-600" />,
            bgColor: 'bg-purple-50',
          },
        ].map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctor Stats & Appointment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Doctor Stats */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Doctor Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Pending Approval', value: stats?.doctors?.pending || 0, icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-100' },
                { label: 'Approved', value: stats?.doctors?.approved || 0, icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, bg: 'bg-green-100' },
                { label: 'Rejected', value: stats?.doctors?.rejected || 0, icon: <XCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-100' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${item.bg}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Stats */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Appointment Status</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Pending', value: stats?.appointments?.pending || 0, dot: 'bg-yellow-500' },
                { label: 'Confirmed', value: stats?.appointments?.confirmed || 0, dot: 'bg-blue-500' },
                { label: 'Completed', value: stats?.appointments?.completed || 0, dot: 'bg-green-500' },
                { label: 'Cancelled', value: stats?.appointments?.cancelled || 0, dot: 'bg-red-500' },
              ].map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${stat.dot}`} />
                    <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                </div>
              ))}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
          <Link
            to="/admin/appointments"
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {stats?.recentAppointments?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {appointment.patientId?.name}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        Dr. {appointment.doctorId?.userId?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{appointment.date}</p>
                      <p className="text-xs text-slate-500">{appointment.timeSlot}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(appointment.status)} className="capitalize min-w-[80px] justify-center">
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No recent appointments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;