
// Hard-coded list of mental health services in Rwanda
// This would be replaced with a real API/database in a production app

export interface ServiceLocation {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  serviceTypes: string[];
  riskLevelsServed: ('low' | 'moderate' | 'high')[];
  description: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const mentalHealthServices: ServiceLocation[] = [
  {
    name: "Rwanda Counselling Center",
    address: "KG 7 Ave, Kigali",
    city: "Kigali",
    phone: "+250 78 123 4567",
    email: "contact@rwandacounselling.org",
    website: "https://www.rwandacounselling.org",
    serviceTypes: ["Counselling", "Group Therapy", "Crisis Intervention"],
    riskLevelsServed: ["low", "moderate"],
    description: "Offers confidential counseling services for students and young adults facing mental health challenges.",
    coordinates: {
      latitude: -1.9441,
      longitude: 30.0619
    }
  },
  {
    name: "University of Rwanda Mental Health Support",
    address: "University of Rwanda, Huye Campus",
    city: "Huye",
    phone: "+250 78 987 6543",
    email: "mentalhealth@ur.ac.rw",
    serviceTypes: ["Peer Counselling", "Academic Support", "Wellness Programs"],
    riskLevelsServed: ["low", "moderate"],
    description: "On-campus support services specifically designed for university students.",
    coordinates: {
      latitude: -2.6168,
      longitude: 29.7441
    }
  },
  {
    name: "CARAES Ndera Neuropsychiatric Hospital",
    address: "Ndera, Gasabo",
    city: "Kigali",
    phone: "+250 78 835 9121",
    email: "info@caraesndera.org",
    website: "https://www.caraesndera.org",
    serviceTypes: ["Psychiatric Care", "Inpatient Services", "Crisis Intervention"],
    riskLevelsServed: ["moderate", "high"],
    description: "Comprehensive psychiatric services for severe mental health conditions.",
    coordinates: {
      latitude: -1.9046,
      longitude: 30.1196
    }
  },
  {
    name: "Hope and Healing Rwanda",
    address: "KK 15 Rd, Kicukiro",
    city: "Kigali",
    phone: "+250 72 564 8901",
    email: "support@hopeandhealingrwanda.org",
    serviceTypes: ["Trauma Counselling", "Youth Support Groups", "Telehealth Services"],
    riskLevelsServed: ["low", "moderate", "high"],
    description: "Specialized in trauma-informed care and youth mental health support.",
    coordinates: {
      latitude: -1.9707,
      longitude: 30.0604
    }
  },
  {
    name: "Rwanda National Youth Council Mental Health Program",
    address: "Nyarugenge, Kigali",
    city: "Kigali",
    phone: "+250 78 012 3456",
    email: "youth@nyc.gov.rw",
    serviceTypes: ["Peer Support", "Educational Workshops", "Community Programs"],
    riskLevelsServed: ["low"],
    description: "Youth-focused mental health awareness and preventive programs."
  },
  {
    name: "Isange One Stop Center - Kacyiru Hospital",
    address: "Kacyiru Hospital, KG 11 Ave",
    city: "Kigali",
    phone: "+250 78 301 2345",
    email: "isangeonestop@police.gov.rw",
    serviceTypes: ["Crisis Intervention", "Trauma Support", "Medical Services"],
    riskLevelsServed: ["moderate", "high"],
    description: "Integrated services for victims of gender-based violence and psychological trauma."
  },
  {
    name: "Icyizere Counselling Center",
    address: "Musanze District",
    city: "Musanze",
    phone: "+250 73 456 7890",
    email: "info@icyizere.org",
    serviceTypes: ["Individual Counselling", "Family Therapy", "Outreach Programs"],
    riskLevelsServed: ["low", "moderate"],
    description: "Community-based mental health support serving the Northern Province."
  },
  {
    name: "Rwanda Psychological Society",
    address: "KG 579 St, Kigali",
    city: "Kigali",
    phone: "+250 78 678 9012",
    email: "contact@rwandapsychology.org",
    website: "https://www.rwandapsychology.org",
    serviceTypes: ["Professional Referrals", "Educational Resources", "Assessment Services"],
    riskLevelsServed: ["low", "moderate", "high"],
    description: "Professional association providing resources and referrals to certified mental health practitioners."
  }
];

// Function to find services matching a specific risk level
export const findServicesByRiskLevel = (riskLevel: 'low' | 'moderate' | 'high'): ServiceLocation[] => {
  return mentalHealthServices.filter(service => 
    service.riskLevelsServed.includes(riskLevel)
  );
};

// Function to get all services
export const getAllServices = (): ServiceLocation[] => {
  return mentalHealthServices;
};
