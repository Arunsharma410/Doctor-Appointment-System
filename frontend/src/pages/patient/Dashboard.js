import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/patient/PatientLayout';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Stethoscope,
  ArrowRight,
  Search
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
      const response = await axios.get('/appointments/my-appointments');
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

  return (
    <PatientLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Here is your health summary
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Total',
                value: stats.total,
                icon: <Calendar className="w-6 h-6 text-blue-600" />,
                bg: 'bg-blue-50',
              },
              {
                label: 'Pending',
                value: stats.pending,
                icon: <Clock className="w-6 h-6 text-yellow-600" />,
                bg: 'bg-yellow-50',
              },
              {
                label: 'Completed',
                value: stats.completed,
                icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
                bg: 'bg-green-50',
              },
              {
                label: 'Cancelled',
                value: stats.cancelled,
                icon: <XCircle className="w-6 h-6 text-red-600" />,
                bg: 'bg-red-50',
              },
            ].map((stat, index) => (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className={`${stat.bg} p-4 rounded-full`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/doctors"
              className="group bg-primary text-primary-foreground rounded-2xl p-6 hover:bg-primary/90 transition-all flex items-center justify-between shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/10 rounded-xl">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Find a Doctor</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Browse and book appointments
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/patient/appointments"
              className="group bg-blue-600 text-white rounded-2xl p-6 hover:bg-blue-700 transition-all flex items-center justify-between shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/10 rounded-xl">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">My Appointments</h3>
                  <p className="text-blue-100 text-sm">
                    View and manage appointments
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Recent Appointments */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Appointments</CardTitle>
              <Link
                to="/patient/appointments"
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
                    <div
                      key={appointment._id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Stethoscope className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Dr. {appointment.doctorId?.userId?.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {appointment.doctorId?.specialization}
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
                  <p className="text-slate-500 font-medium mb-4">No appointments yet</p>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Find a Doctor
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </PatientLayout>
  );
};

export default Dashboard;