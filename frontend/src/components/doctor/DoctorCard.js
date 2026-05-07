import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  Building,
  GraduationCap,
  Stethoscope,
  IndianRupee,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const DoctorCard = ({ doctor }) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group border-none shadow-md">
      {/* Card Header */}
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-slate-100 flex flex-row items-center gap-4">
        {/* Doctor Avatar */}
        <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
          {doctor.userId?.profilePhoto ? (
             <AvatarImage src={doctor.userId.profilePhoto} alt={doctor.userId?.name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary">
            <Stethoscope className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>

        {/* Doctor Basic Info */}
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-bold text-slate-900 leading-none">
            {doctor.userId?.name}
          </h3>
          <p className="text-primary font-medium text-sm">
            {doctor.specialization}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-700">
              {doctor.rating || '4.5'}
            </span>
            <span className="text-slate-500 text-sm">
              ({doctor.totalReviews || '0'} reviews)
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Card Body */}
      <CardContent className="p-6">
        {/* Doctor Details */}
        <div className="space-y-3 mb-6">
          {/* Experience */}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <span className="text-sm font-medium">
              {doctor.experience} years experience
            </span>
          </div>

          {/* Qualifications */}
          {doctor.qualifications && (
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-sm font-medium">
                {doctor.qualifications}
              </span>
            </div>
          )}

          {/* Hospital */}
          {doctor.hospital && (
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-sm font-medium">
                {doctor.hospital}
              </span>
            </div>
          )}

          {/* City */}
          {doctor.city && (
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-sm font-medium">{doctor.city}</span>
            </div>
          )}
        </div>

        {/* Availability Badge */}
        <div className="flex flex-wrap gap-2 mb-2">
          {doctor.availability && doctor.availability.length > 0 ? (
            doctor.availability.slice(0, 3).map((avail, index) => (
              <Badge key={index} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                {avail.day}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-slate-500">
              Schedule not set
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Fee and Book Button */}
      <CardFooter className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 mt-4">
        <div className="pt-4">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Consultation Fee</p>
          <p className="text-primary font-bold text-2xl flex items-center">
            <IndianRupee className="w-5 h-5 mr-1" />
            {doctor.fees}
          </p>
        </div>
        <Link to={`/doctors/${doctor._id}`} className="mt-4">
          <Button variant="default" className="w-full">
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;