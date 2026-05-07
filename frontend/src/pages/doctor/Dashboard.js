import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  ArrowRight,
  IndianRupee,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Avatar, AvatarFallback } from '../../components/ui/Avatar';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        '/appointments/doctor-appointments'
      );
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    revenue: appointments
      .filter((a) => a.status === 'completed')
      .reduce((sum, a) => sum + a.fees, 0),
  };

  // Status badge variant
  const getStatusBadgeVariant = (status) => {
    const styles = {
      pending: 'warning',
      confirmed: 'default',
      completed: 'success',
      cancelled: 'destructive',
    };
    return styles[status] || 'secondary';
  };

  // Get today appointments
  const todayAppointments = appointments.filter((a) => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  return (
    <DoctorLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome, Dr. {user?.name}! 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Here is your practice summary
        </p>
      </div>

      {loading ? (
         <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
              { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-50' },
              { label: 'Confirmed', value: stats.confirmed, icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
              { label: 'Completed', value: stats.completed, icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
              { label: 'Cancelled', value: stats.cancelled, icon: <XCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-50' },
              { label: 'Revenue', value: `₹${stats.revenue}`, icon: <IndianRupee className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
            ].map((stat, index) => (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`${stat.bg} p-3 rounded-full mb-1`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Appointments */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Today's Appointments
                  {todayAppointments.length > 0 && (
                    <Badge variant="success" className="rounded-full px-2">
                      {todayAppointments.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment._id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{appointment.patientId?.name}</p>
                            <p className="text-xs text-slate-500">{appointment.timeSlot}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(appointment.status)} className="capitalize">
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No appointments today</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
                <Link
                  to="/doctor/appointments"
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {appointments.slice(0, 5).map((appointment) => (
                      <div key={appointment._id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{appointment.patientId?.name}</p>
                            <p className="text-xs text-slate-500">{appointment.date} • {appointment.timeSlot}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(appointment.status)} className="capitalize hidden sm:inline-flex">
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No appointments yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DoctorLayout>
  );
};

export default Dashboard;