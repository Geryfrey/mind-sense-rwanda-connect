
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminExportReports from "@/components/admin/AdminExportReports";
import { Menu, Users, TrendingUp, Activity, Download, Brain, Settings, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for students
const mockStudents = [
  { id: 1, name: "Jean Baptiste Niyonzima", regNumber: "2021-CS-001", university: "University of Rwanda", year: "3rd Year", status: "Active", lastAssessment: "2024-05-20", riskLevel: "Low" },
  { id: 2, name: "Marie Claire Uwimana", regNumber: "2021-CS-002", university: "AUCA", year: "2nd Year", status: "Active", lastAssessment: "2024-05-19", riskLevel: "Medium" },
  { id: 3, name: "Patrick Mugabo", regNumber: "2021-ENG-003", university: "KIST", year: "4th Year", status: "Inactive", lastAssessment: "2024-05-15", riskLevel: "High" },
  { id: 4, name: "Grace Mutesi", regNumber: "2022-BUS-004", university: "University of Rwanda", year: "2nd Year", status: "Active", lastAssessment: "2024-05-22", riskLevel: "Low" },
  { id: 5, name: "Emmanuel Habimana", regNumber: "2021-MED-005", university: "University of Rwanda", year: "3rd Year", status: "Active", lastAssessment: "2024-05-21", riskLevel: "Medium" }
];

// Mock data for predictions
const mockPredictions = [
  { id: 1, studentName: "Jean Baptiste Niyonzima", regNumber: "2021-CS-001", timestamp: "2024-05-20 14:30", prediction: "Low Risk", confidence: "92%", symptoms: ["Mild stress", "Good sleep"], action: "Monitor" },
  { id: 2, studentName: "Marie Claire Uwimana", regNumber: "2021-CS-002", timestamp: "2024-05-19 10:15", prediction: "Medium Risk", confidence: "87%", symptoms: ["Anxiety", "Social withdrawal"], action: "Referred to counselor" },
  { id: 3, studentName: "Patrick Mugabo", regNumber: "2021-ENG-003", timestamp: "2024-05-15 16:45", prediction: "High Risk", confidence: "94%", symptoms: ["Depression indicators", "Sleep issues"], action: "Immediate follow-up" },
  { id: 4, studentName: "Grace Mutesi", regNumber: "2022-BUS-004", timestamp: "2024-05-22 09:20", prediction: "Low Risk", confidence: "89%", symptoms: ["Occasional stress"], action: "Self-help resources" }
];

// Admin dashboard pages
const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.regNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">Add New Student</Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Registry ({filteredStudents.length} students)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Reg Number</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Assessment</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.regNumber}</TableCell>
                  <TableCell>{student.university}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.lastAssessment}</TableCell>
                  <TableCell>
                    <Badge variant={
                      student.riskLevel === "Low" ? "default" : 
                      student.riskLevel === "Medium" ? "secondary" : "destructive"
                    }>
                      {student.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminPredictions: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Predictions Log</h1>
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export Log
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">127</p>
              <p className="text-gray-600">Total Predictions</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">91%</p>
              <p className="text-gray-600">Avg Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">15</p>
              <p className="text-gray-600">High Risk Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Prediction</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Key Symptoms</TableHead>
              <TableHead>Action Taken</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPredictions.map((prediction) => (
              <TableRow key={prediction.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{prediction.studentName}</p>
                    <p className="text-sm text-gray-500">{prediction.regNumber}</p>
                  </div>
                </TableCell>
                <TableCell>{prediction.timestamp}</TableCell>
                <TableCell>
                  <Badge variant={
                    prediction.prediction === "Low Risk" ? "default" : 
                    prediction.prediction === "Medium Risk" ? "secondary" : "destructive"
                  }>
                    {prediction.prediction}
                  </Badge>
                </TableCell>
                <TableCell>{prediction.confidence}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {prediction.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{prediction.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

const AdminAnalytics: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-gray-600">Active Students</p>
              <p className="text-sm text-green-600">+12% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">89</p>
              <p className="text-gray-600">Assessments Today</p>
              <p className="text-sm text-green-600">+5% from yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">92%</p>
              <p className="text-gray-600">Accuracy Rate</p>
              <p className="text-sm text-green-600">+2% this week</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">23</p>
              <p className="text-gray-600">High Risk Cases</p>
              <p className="text-sm text-red-600">+3 this week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Stress & Anxiety</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
                <span className="text-sm">68%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Depression Indicators</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '34%'}}></div>
                </div>
                <span className="text-sm">34%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Sleep Issues</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                <span className="text-sm">45%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Social Withdrawal</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '29%'}}></div>
                </div>
                <span className="text-sm">29%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>University Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>University of Rwanda</span>
              <Badge>542 students</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>AUCA</span>
              <Badge variant="secondary">298 students</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>KIST</span>
              <Badge variant="secondary">187 students</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Rwanda Polytechnic</span>
              <Badge variant="secondary">134 students</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Other Universities</span>
              <Badge variant="outline">86 students</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AdminModelFeedback: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Model Feedback & Performance</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">v2.1.3</p>
              <p className="text-gray-600">Current Model</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">94.2%</p>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">2,847</p>
              <p className="text-gray-600">Training Samples</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Tabs defaultValue="performance" className="space-y-6">
      <TabsList>
        <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        <TabsTrigger value="feedback">Feedback Log</TabsTrigger>
        <TabsTrigger value="training">Training Data</TabsTrigger>
      </TabsList>

      <TabsContent value="performance">
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Classification Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Precision</span>
                    <span className="font-mono">0.942</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recall</span>
                    <span className="font-mono">0.918</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F1-Score</span>
                    <span className="font-mono">0.930</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AUC-ROC</span>
                    <span className="font-mono">0.967</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Risk Level Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Low Risk</span>
                    <span className="text-green-600">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk</span>
                    <span className="text-yellow-600">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk</span>
                    <span className="text-red-600">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="feedback">
        <Card>
          <CardHeader>
            <CardTitle>Professional Feedback Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Dr. Sarah Uwimana - Clinical Psychologist</p>
                    <p className="text-sm text-gray-600">Reviewed Case #1247</p>
                  </div>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <p className="mt-2 text-sm">"Model correctly identified anxiety indicators. Recommendation was appropriate for immediate counseling referral."</p>
                <Badge className="mt-2">Confirmed Accurate</Badge>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Dr. Jean Paul Habimana - Psychiatrist</p>
                    <p className="text-sm text-gray-600">Reviewed Case #1245</p>
                  </div>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
                <p className="mt-2 text-sm">"Model sensitivity could be improved for detecting early depression symptoms in this demographic."</p>
                <Badge variant="secondary" className="mt-2">Needs Improvement</Badge>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Dr. Grace Mukamana - Counselor</p>
                    <p className="text-sm text-gray-600">Reviewed Case #1243</p>
                  </div>
                  <span className="text-sm text-gray-500">5 days ago</span>
                </div>
                <p className="mt-2 text-sm">"Excellent prediction accuracy. The risk assessment aligned perfectly with clinical evaluation."</p>
                <Badge className="mt-2">Highly Accurate</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="training">
        <Card>
          <CardHeader>
            <CardTitle>Training Data Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Data Sources</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Validated Assessments</span>
                    <span>2,847 samples</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional Reviews</span>
                    <span>1,523 samples</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Follow-up Outcomes</span>
                    <span>987 samples</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Data Quality</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Completeness</span>
                    <span className="text-green-600">98.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy</span>
                    <span className="text-green-600">96.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diversity Index</span>
                    <span className="text-green-600">92.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

const AdminSettings: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Send alerts for high-risk cases</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Auto Referrals</p>
              <p className="text-sm text-gray-600">Automatic counselor assignments</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Data Retention</p>
              <p className="text-sm text-gray-600">Assessment data retention period</p>
            </div>
            <Badge variant="secondary">2 Years</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Risk Threshold</p>
              <p className="text-sm text-gray-600">Minimum confidence for high-risk alerts</p>
            </div>
            <Badge>85%</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Auto Retrain</p>
              <p className="text-sm text-gray-600">Automatic model retraining</p>
            </div>
            <Badge>Weekly</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Feedback Integration</p>
              <p className="text-sm text-gray-600">Professional feedback learning</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/students" element={<AdminStudents />} />
            <Route path="/predictions" element={<AdminPredictions />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/reports" element={<AdminExportReports />} />
            <Route path="/model-feedback" element={<AdminModelFeedback />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
