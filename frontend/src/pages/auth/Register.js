import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import {
  Stethoscope,
  User,
  Eye,
  EyeOff,
  Building,
  GraduationCap,
  MapPin,
  IndianRupee,
  Clock,
  BriefcaseMedical
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    // Doctor specific fields
    specialization: '',
    experience: '',
    fees: '',
    city: '',
    hospital: '',
    qualifications: '',
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Specializations list
  const specializations = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'Gynecologist',
    'Ophthalmologist',
    'ENT Specialist',
    'Dentist',
    'General Physician',
    'Urologist',
    'Oncologist',
    'Radiologist',
    'Anesthesiologist',
  ];

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    // Doctor specific validations
    if (formData.role === 'doctor') {
      if (!formData.specialization) {
        newErrors.specialization = 'Specialization is required';
      }
      if (!formData.experience) {
        newErrors.experience = 'Experience is required';
      }
      if (!formData.fees) {
        newErrors.fees = 'Consultation fees is required';
      }
      if (!formData.city) {
        newErrors.city = 'City is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Step 1: Register user
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
      };

      const response = await axios.post('/auth/register', registerData);

      if (response.data.success) {
        // Save user to context
        login(response.data.data);

        // Step 2: If doctor, create doctor profile
        if (formData.role === 'doctor') {
          try {
            await axios.post('/doctors/profile', {
              specialization: formData.specialization,
              experience: Number(formData.experience),
              fees: Number(formData.fees),
              city: formData.city,
              hospital: formData.hospital,
              qualifications: formData.qualifications,
              bio: '',
            });
          } catch (profileError) {
            console.log('Profile creation error:', profileError);
          }
        }

        toast.success('Registration successful! Welcome to DocBook!');

        // Redirect based on role
        if (formData.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2.5 rounded-xl">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              DocBook
            </span>
          </Link>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <div className="mb-8">
              <label className="text-sm font-medium text-slate-700 mb-3 block">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'patient' })}
                  className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                    formData.role === 'patient'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-6 h-6 mb-2" />
                  <span className="font-semibold text-sm">Patient</span>
                  <span className="text-xs text-slate-500 mt-1">Book appointments</span>
                  {formData.role === 'patient' && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'doctor' })}
                  className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                    formData.role === 'doctor'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className="w-6 h-6 mb-2" />
                  <span className="font-semibold text-sm">Doctor</span>
                  <span className="text-xs text-slate-500 mt-1">Manage appointments</span>
                  {formData.role === 'doctor' && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                        errors.name ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                      }`}
                    />
                    {errors.name && <p className="text-[0.8rem] font-medium text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                        errors.phone ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                      }`}
                    />
                    {errors.phone && <p className="text-[0.8rem] font-medium text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                      errors.email ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                    }`}
                  />
                  {errors.email && <p className="text-[0.8rem] font-medium text-destructive">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                        className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-colors ${
                          errors.password ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[0.8rem] font-medium text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat password"
                        className={`flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-colors ${
                          errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[0.8rem] font-medium text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Doctor Specific Fields */}
              {formData.role === 'doctor' && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b pb-2">
                    Professional Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Specialization *</label>
                      <div className="relative">
                        <BriefcaseMedical className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className={`flex h-10 w-full rounded-md border bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors appearance-none ${
                            errors.specialization ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                          }`}
                        >
                          <option value="">Select Specialization</option>
                          {specializations.map((spec) => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>
                      {errors.specialization && <p className="text-[0.8rem] font-medium text-destructive">{errors.specialization}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Experience (years) *</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="e.g. 5"
                          min="0"
                          className={`flex h-10 w-full rounded-md border bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                            errors.experience ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                          }`}
                        />
                      </div>
                      {errors.experience && <p className="text-[0.8rem] font-medium text-destructive">{errors.experience}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Consultation Fees *</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="number"
                          name="fees"
                          value={formData.fees}
                          onChange={handleChange}
                          placeholder="Amount in ₹"
                          min="0"
                          className={`flex h-10 w-full rounded-md border bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                            errors.fees ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                          }`}
                        />
                      </div>
                      {errors.fees && <p className="text-[0.8rem] font-medium text-destructive">{errors.fees}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">City *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Mumbai"
                          className={`flex h-10 w-full rounded-md border bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
                            errors.city ? 'border-destructive focus-visible:ring-destructive/20' : 'border-input hover:border-slate-400 focus-visible:ring-primary/20'
                          }`}
                        />
                      </div>
                      {errors.city && <p className="text-[0.8rem] font-medium text-destructive">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Hospital/Clinic</label>
                      <div className="relative">
                         <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          name="hospital"
                          value={formData.hospital}
                          onChange={handleChange}
                          placeholder="Primary workplace"
                          className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Qualifications</label>
                       <div className="relative">
                        <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={handleChange}
                          placeholder="e.g. MBBS, MD"
                          className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:border-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                  
                   <div className="bg-warning/10 border border-warning/20 rounded-md p-3 text-sm text-warning mt-2 flex gap-2 items-start">
                    <span className="text-base leading-none">⚠️</span>
                    <p>Doctor accounts require admin approval before you can start accepting appointments.</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full mt-4"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
            <div className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;