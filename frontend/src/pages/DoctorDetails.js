import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Building,
  GraduationCap,
  IndianRupee,
  Stethoscope,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`/doctors/${id}`);

      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load doctor details');
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      return toast.error('Please select both a date and a time slot');
    }

    setIsBooking(true);
    try {
      const response = await axios.post('/appointments/book', {
        doctorId: id,
        date: selectedDate,
        timeSlot: selectedTime,
      });

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        setBookingSuccess(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Booking failed'
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-6 container mx-auto">
         <Button variant="ghost" className="mb-6 invisible">
           <ChevronLeft className="w-4 h-4 mr-2" /> Back
         </Button>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="animate-pulse border-none shadow-sm h-64"></Card>
                <Card className="animate-pulse border-none shadow-sm h-48"></Card>
            </div>
            <div className="space-y-6">
                 <Card className="animate-pulse border-none shadow-sm h-96"></Card>
            </div>
         </div>
      </div>
    );
  }

  if (!doctor) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
             <div className="text-center">
                 <Stethoscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                 <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
                 <p className="text-muted-foreground mb-6">The doctor you are looking for does not exist or is unavailable.</p>
                 <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
             </div>
         </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Premium Header */}
      <div className="bg-primary pt-12 pb-24 text-primary-foreground relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
         <div className="container mx-auto px-4 md:px-6 relative z-10">
            <Button 
                variant="ghost" 
                className="mb-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 -ml-4"
                onClick={() => navigate('/doctors')}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back to Doctors
            </Button>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
               <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-4 ring-primary/20">
                  {doctor.userId?.profilePhoto ? (
                    <AvatarImage src={doctor.userId.profilePhoto} alt={doctor.userId?.name} />
                  ) : null}
                  <AvatarFallback className="bg-white text-primary text-4xl">
                     <Stethoscope className="w-12 h-12" />
                  </AvatarFallback>
               </Avatar>
               
               <div className="text-center md:text-left space-y-2 flex-1 pt-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                     <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {doctor.userId?.name}
                     </h1>
                     <Badge className="bg-primary-foreground text-primary hover:bg-primary-foreground w-fit mx-auto md:mx-0 font-bold border-none shadow-sm">
                        {doctor.specialization}
                     </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-primary-foreground/90 font-medium">
                     <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-5 h-5 opacity-70" />
                        <span>{doctor.qualifications || 'MBBS, MD'}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <Clock className="w-5 h-5 opacity-70" />
                        <span>{doctor.experience} Years Exp.</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-amber-300">
                        <Star className="w-5 h-5 fill-current" />
                        <span>{doctor.rating || '4.8'} ({doctor.totalReviews || '120'} Reviews)</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-border">
                   <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      Clinic Details
                   </CardTitle>
               </CardHeader>
               <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
                   <div>
                       <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wider">Hospital/Clinic Name</p>
                       <p className="text-lg font-semibold text-foreground">{doctor.hospital || 'Apollo Hospitals'}</p>
                   </div>
                   <div>
                       <p className="text-sm text-muted-foreground font-medium mb-1 uppercase tracking-wider">Location</p>
                       <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {doctor.city || 'Not Specified'}
                       </p>
                   </div>
                   <div className="sm:col-span-2 pt-4 border-t border-border">
                       <p className="text-sm text-muted-foreground font-medium mb-3 uppercase tracking-wider">About Doctor</p>
                       <p className="text-slate-600 leading-relaxed">
                          {doctor.about || `${doctor.userId?.name} is a highly experienced ${doctor.specialization} with ${doctor.experience} years of clinical practice. Dedicated to providing comprehensive and compassionate care to patients. Known for a patient-centric approach and staying updated with the latest medical advancements.`}
                       </p>
                   </div>
               </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
                <CardHeader className="bg-slate-50 border-b border-border">
                   <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Availability Schedule
                   </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                   {doctor.availability && doctor.availability.length > 0 ? (
                       <div className="grid gap-4 sm:grid-cols-2">
                           {doctor.availability.map((avail, i) => (
                               <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50">
                                   <span className="font-semibold text-slate-700">{avail.day}</span>
                                   <Badge variant="outline" className="bg-white">
                                       {avail.startTime} - {avail.endTime}
                                   </Badge>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <p className="text-muted-foreground flex items-center gap-2">
                           <Clock className="w-4 h-4" />
                           Standard working hours: Mon - Sat, 9:00 AM - 5:00 PM
                       </p>
                   )}
               </CardContent>
            </Card>
          </div>

          {/* Booking Widget Column */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
             {bookingSuccess ? (
                <Card className="border-none shadow-xl border-t-4 border-t-green-500 overflow-hidden">
                    <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                        <p className="text-muted-foreground mb-6">
                            Your appointment with {doctor.userId?.name} has been successfully scheduled.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg mb-8 text-left space-y-2 border">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-muted-foreground text-sm">Date</span>
                                <span className="font-semibold">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-muted-foreground text-sm">Time</span>
                                <span className="font-semibold">{selectedTime}</span>
                            </div>
                        </div>
                        <Button className="w-full" onClick={() => navigate('/patient/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
             ) : (
                <Card className="border-none shadow-xl">
                <CardHeader className="bg-gradient-to-br from-slate-50 to-white border-b border-border pb-6">
                    <CardTitle className="text-xl">Book Appointment</CardTitle>
                    <CardDescription>Select a date and time slot</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div>
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Consultation Fee</p>
                            <p className="text-3xl font-bold text-slate-900 flex items-center">
                                <IndianRupee className="w-6 h-6 mr-1" />
                                {doctor.fees}
                            </p>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-none">
                            Pay at clinic
                        </Badge>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Select Date
                    </Label>
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="h-12 w-full border-border rounded-xl cursor-pointer"
                    />
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Select Time Slot
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                        <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-1 text-sm font-medium rounded-lg border transition-all duration-200 ${
                            selectedTime === slot
                                ? 'bg-primary border-primary text-primary-foreground shadow-md ring-2 ring-primary/20 ring-offset-2'
                                : 'bg-white border-border text-slate-600 hover:border-primary/50 hover:bg-slate-50'
                            }`}
                        >
                            {slot}
                        </button>
                        ))}
                    </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                    <Button
                        onClick={handleBooking}
                        disabled={isBooking || !selectedDate || !selectedTime}
                        className="w-full h-12 text-lg shadow-lg relative overflow-hidden group"
                    >
                        {isBooking ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : (
                            <>
                                <span className="relative z-10">Confirm Booking</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </>
                        )}
                    </Button>
                </CardFooter>
                </Card>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;