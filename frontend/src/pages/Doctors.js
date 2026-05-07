import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import DoctorCard from '../components/doctor/DoctorCard';
import {
  Search,
  Filter,
  X,
  Stethoscope,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

const Doctors = () => {
  const location = useLocation();

  // Get query params from URL
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialSpec = queryParams.get('specialization') || '';

  // States
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpec, setSelectedSpec] = useState(initialSpec);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedFee, setSelectedFee] = useState('');

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
  ];

  // Fetch all doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
        setFilteredDoctors(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedSpec, selectedCity, selectedExperience, selectedFee, doctors]);

  const applyFilters = () => {
    let filtered = [...doctors];

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.userId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpec) {
      filtered = filtered.filter((doc) =>
        doc.specialization
          ?.toLowerCase()
          .includes(selectedSpec.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter((doc) =>
        doc.city?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Filter by experience
    if (selectedExperience) {
      filtered = filtered.filter((doc) => {
        if (selectedExperience === '0-5') {
          return doc.experience >= 0 && doc.experience <= 5;
        } else if (selectedExperience === '5-10') {
          return doc.experience > 5 && doc.experience <= 10;
        } else if (selectedExperience === '10+') {
          return doc.experience > 10;
        }
        return true;
      });
    }

    // Filter by fee
    if (selectedFee) {
      filtered = filtered.filter((doc) => {
        if (selectedFee === '0-500') {
          return doc.fees >= 0 && doc.fees <= 500;
        } else if (selectedFee === '500-1000') {
          return doc.fees > 500 && doc.fees <= 1000;
        } else if (selectedFee === '1000+') {
          return doc.fees > 1000;
        }
        return true;
      });
    }

    setFilteredDoctors(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpec('');
    setSelectedCity('');
    setSelectedExperience('');
    setSelectedFee('');
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm ||
    selectedSpec ||
    selectedCity ||
    selectedExperience ||
    selectedFee;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">

      {/* ======================== */}
      {/* PAGE HEADER */}
      {/* ======================== */}
      <div className="bg-primary pt-24 pb-16 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Find Your Doctor
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Search from {doctors.length}+ verified doctors and book your appointment instantly.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-12 py-6 text-lg rounded-2xl shadow-xl border-none text-slate-900 bg-white focus-visible:ring-4 focus-visible:ring-primary/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================== */}
      {/* MAIN CONTENT */}
      {/* ======================== */}
      <div className="container mx-auto px-4 md:px-6 py-8 -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ======================== */}
          {/* FILTERS SIDEBAR */}
          {/* ======================== */}
          <div className={`
            fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden
            ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `} onClick={() => setShowFilters(false)} />
          
          <div className={`
            fixed inset-y-0 left-0 z-50 w-80 bg-background shadow-2xl transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-72 lg:bg-transparent lg:shadow-none lg:z-auto
            ${showFilters ? 'translate-x-0' : '-translate-x-full'}
          `}>
            
            {/* Filter Card */}
            <Card className="h-full lg:h-auto border-none lg:border-border lg:shadow-sm overflow-y-auto lg:sticky lg:top-24 rounded-none lg:rounded-xl">
               {/* Mobile Close Button */}
              <div className="flex justify-between items-center p-6 border-b lg:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <CardContent className="p-6">
                {/* Filter Header */}
                <div className="flex justify-between items-center mb-6 hidden lg:flex">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium text-destructive hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Mobile Clear Filters */}
                {hasActiveFilters && (
                  <div className="mb-6 lg:hidden">
                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full text-destructive border-destructive/20 hover:bg-destructive/10">
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {/* Specialization Filter */}
                <div className="space-y-3 mb-6">
                  <label className="text-sm font-semibold text-foreground block">
                    Specialization
                  </label>
                  <select
                    value={selectedSpec}
                    onChange={(e) => setSelectedSpec(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div className="space-y-3 mb-6">
                  <label className="text-sm font-semibold text-foreground block">
                    City
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter city name"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  />
                </div>

                {/* Experience Filter */}
                <div className="space-y-3 mb-6">
                  <label className="text-sm font-semibold text-foreground block">
                    Experience
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'Any Experience' },
                      { value: '0-5', label: '0 - 5 years' },
                      { value: '5-10', label: '5 - 10 years' },
                      { value: '10+', label: '10+ years' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="experience"
                            value={option.value}
                            checked={selectedExperience === option.value}
                            onChange={(e) =>
                              setSelectedExperience(e.target.value)
                            }
                            className="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:bg-primary transition-all cursor-pointer"
                          />
                          <div className="absolute w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fee Range Filter */}
                <div className="space-y-3 mb-8">
                  <label className="text-sm font-semibold text-foreground block">
                    Consultation Fee
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'Any Fee' },
                      { value: '0-500', label: 'Under ₹500' },
                      { value: '500-1000', label: '₹500 - ₹1000' },
                      { value: '1000+', label: 'Above ₹1000' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="fee"
                            value={option.value}
                            checked={selectedFee === option.value}
                            onChange={(e) => setSelectedFee(e.target.value)}
                            className="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:bg-primary transition-all cursor-pointer"
                          />
                          <div className="absolute w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Button (Mobile) */}
                <Button
                  onClick={() => setShowFilters(false)}
                  className="w-full lg:hidden"
                  size="lg"
                >
                  Show Results
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ======================== */}
          {/* DOCTORS LIST */}
          {/* ======================== */}
          <div className="flex-1">

            {/* Results Header & Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-8 lg:mt-0">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {loading
                    ? 'Loading...'
                    : `${filteredDoctors.length} Doctors Found`}
                </h2>
                {hasActiveFilters && (
                  <p className="text-muted-foreground text-sm mt-1">
                    Showing filtered results
                  </p>
                )}
              </div>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="lg:hidden w-full sm:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                    Active
                  </Badge>
                )}
              </Button>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchTerm && (
                  <Badge variant="secondary" className="px-3 py-1 bg-white border border-border text-foreground hover:bg-slate-50 gap-1 rounded-full font-medium">
                    <span className="text-muted-foreground mr-1 font-normal">Search:</span> {searchTerm}
                    <button onClick={() => setSearchTerm('')} className="ml-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-200 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedSpec && (
                  <Badge variant="secondary" className="px-3 py-1 bg-white border border-border text-foreground hover:bg-slate-50 gap-1 rounded-full font-medium">
                    {selectedSpec}
                    <button onClick={() => setSelectedSpec('')} className="ml-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-200 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCity && (
                  <Badge variant="secondary" className="px-3 py-1 bg-white border border-border text-foreground hover:bg-slate-50 gap-1 rounded-full font-medium">
                    {selectedCity}
                    <button onClick={() => setSelectedCity('')} className="ml-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-200 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedExperience && (
                  <Badge variant="secondary" className="px-3 py-1 bg-white border border-border text-foreground hover:bg-slate-50 gap-1 rounded-full font-medium">
                     <span className="text-muted-foreground mr-1 font-normal">Exp:</span> {selectedExperience} yrs
                    <button onClick={() => setSelectedExperience('')} className="ml-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-200 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedFee && (
                  <Badge variant="secondary" className="px-3 py-1 bg-white border border-border text-foreground hover:bg-slate-50 gap-1 rounded-full font-medium">
                     <span className="text-muted-foreground mr-1 font-normal">Fee:</span> ₹{selectedFee}
                    <button onClick={() => setSelectedFee('')} className="ml-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-slate-200 p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-100 h-32"></CardHeader>
                    <CardContent className="p-6 space-y-4 pt-8 relative">
                      <div className="w-16 h-16 bg-white rounded-full absolute -top-8 left-6 border-4 border-white shadow-sm flex items-center justify-center">
                        <div className="w-full h-full bg-slate-200 rounded-full" />
                      </div>
                      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="space-y-3 pt-4">
                         <div className="h-4 bg-slate-200 rounded w-full"></div>
                         <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredDoctors.length > 0 ? (
              /* Doctors Grid */
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <Card className="border-dashed border-2 bg-transparent shadow-none text-center py-24">
                <CardContent>
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Stethoscope className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">
                    No Doctors Found
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {hasActiveFilters
                      ? "We couldn't find any doctors matching your current filters. Try adjusting them or clearing all filters."
                      : "There are currently no approved doctors available in the system."}
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} size="lg">
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;