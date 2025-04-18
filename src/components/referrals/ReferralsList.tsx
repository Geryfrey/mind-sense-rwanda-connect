
import React, { useState, useEffect } from "react";
import { findServicesByRiskLevel, getAllServices, ServiceLocation } from "@/data/referralServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useML } from "@/context/MLContext";
import { Search, MapPin, Phone, Mail, Globe, BadgeInfo } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ReferralsList: React.FC = () => {
  const { assessmentHistory } = useML();
  const [services, setServices] = useState<ServiceLocation[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("");
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all");
  
  // Get most recent assessment risk level
  const mostRecentAssessment = assessmentHistory[0];
  const recentRiskLevel = mostRecentAssessment?.riskLevel || 'low';

  // Get unique cities and service types for filters
  const cities = Array.from(new Set(getAllServices().map(service => service.city)));
  const serviceTypes = Array.from(new Set(getAllServices().flatMap(service => service.serviceTypes)));

  // Initialize services based on most recent assessment
  useEffect(() => {
    let initialServices: ServiceLocation[];
    
    if (mostRecentAssessment) {
      initialServices = findServicesByRiskLevel(recentRiskLevel);
      setRiskLevelFilter(recentRiskLevel);
    } else {
      initialServices = getAllServices();
    }
    
    setServices(initialServices);
    setFilteredServices(initialServices);
  }, [mostRecentAssessment, recentRiskLevel]);

  // Apply filters when they change
  useEffect(() => {
    let results = services;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        service => 
          service.name.toLowerCase().includes(query) || 
          service.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by city
    if (cityFilter) {
      results = results.filter(service => service.city === cityFilter);
    }
    
    // Filter by service type
    if (serviceTypeFilter) {
      results = results.filter(service => service.serviceTypes.includes(serviceTypeFilter));
    }
    
    // Filter by risk level
    if (riskLevelFilter !== 'all') {
      results = results.filter(service => 
        service.riskLevelsServed.includes(riskLevelFilter as 'low' | 'moderate' | 'high')
      );
    }
    
    setFilteredServices(results);
  }, [services, searchQuery, cityFilter, serviceTypeFilter, riskLevelFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setCityFilter("");
    setServiceTypeFilter("");
    setRiskLevelFilter("all");
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Mental Health Support Services</CardTitle>
        <CardDescription>
          {mostRecentAssessment ? (
            <>Based on your recent assessment, here are recommended support services</>
          ) : (
            <>Find mental health support services near you</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sm:w-[140px]">
              <Select
                value={riskLevelFilter}
                onValueChange={setRiskLevelFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="moderate">Moderate Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-1/2">
              <Select
                value={cityFilter}
                onValueChange={setCityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-1/2">
              <Select
                value={serviceTypeFilter}
                onValueChange={setServiceTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">All Services</SelectItem>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchQuery || cityFilter || serviceTypeFilter || riskLevelFilter !== 'all') && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No services found matching your filters.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div key={service.name} className="border rounded-lg overflow-hidden">
                <div className={`p-4 relative ${
                  service.riskLevelsServed.includes('high') ? 'border-l-4 border-l-red-500' : 
                  service.riskLevelsServed.includes('moderate') ? 'border-l-4 border-l-yellow-500' : 
                  'border-l-4 border-l-green-500'
                }`}>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{service.address}, {service.city}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{service.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-start gap-1 flex-wrap">
                    {service.serviceTypes.map(type => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.email && (
                      <a
                        href={`mailto:${service.email}`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </a>
                    )}
                    
                    {service.website && (
                      <a
                        href={service.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                    
                    <div className="ml-auto flex items-center">
                      <BadgeInfo className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Serves: 
                        {service.riskLevelsServed.map((level, i) => (
                          <span key={level}>
                            {i > 0 && ", "}
                            <span className={`capitalize ${
                              level === 'high' ? 'text-red-700' : 
                              level === 'moderate' ? 'text-yellow-700' : 
                              'text-green-700'
                            }`}>
                              {level}
                            </span>
                          </span>
                        ))} risk
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralsList;
