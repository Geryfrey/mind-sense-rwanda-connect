
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useML } from "@/context/MLContext";
import { mentalHealthServices, ServiceLocation, findServicesByRiskLevel } from "@/data/referralServices";

const ReferralsPage: React.FC = () => {
  const { assessmentHistory } = useML();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState<ServiceLocation[]>([]);
  
  // Get latest assessment risk level if available
  const latestAssessment = assessmentHistory[0];
  const defaultRiskLevel = latestAssessment?.riskLevel || "low";
  
  // Initialize with services matching the latest assessment risk level
  useEffect(() => {
    if (latestAssessment) {
      setFilteredServices(findServicesByRiskLevel(latestAssessment.riskLevel));
    } else {
      setFilteredServices(mentalHealthServices);
    }
  }, [latestAssessment]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    // Filter services based on search query
    if (query) {
      const results = mentalHealthServices.filter(
        service =>
          service.name.toLowerCase().includes(query) ||
          service.city.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.serviceTypes.some(type => type.toLowerCase().includes(query))
      );
      setFilteredServices(results);
    } else if (latestAssessment) {
      // Reset to recommended services based on latest assessment
      setFilteredServices(findServicesByRiskLevel(latestAssessment.riskLevel));
    } else {
      setFilteredServices(mentalHealthServices);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle>Mental Health Support Services</CardTitle>
          <CardDescription>
            Find mental health support services in Rwanda based on your needs
            {latestAssessment && (
              <span className="block mt-1">
                Based on your recent assessment, we recommend services for{" "}
                <span className="font-medium capitalize">{latestAssessment.riskLevel} priority</span> support.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              placeholder="Search by name, location, or service type..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No services match your search criteria.</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:bg-muted/10 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={16} className="mr-1" />
                        <span>{service.address}, {service.city}</span>
                      </div>
                      <p className="mt-2 text-sm">{service.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.serviceTypes.map((type, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-3 md:mt-0">
                      <div className="text-sm flex items-center">
                        <Phone size={16} className="mr-2 text-gray-500" />
                        <span>{service.phone}</span>
                      </div>
                      <div className="text-sm flex items-center">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        <span>{service.email}</span>
                      </div>
                      {service.website && (
                        <a
                          href={service.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Globe size={16} className="mr-2" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex flex-wrap gap-2">
                      {service.riskLevelsServed.map((level, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            level === 'high' ? 'bg-red-100 text-red-800' :
                            level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {level} priority
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsPage;
