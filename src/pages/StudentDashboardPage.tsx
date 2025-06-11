import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useML } from "@/context/MLContext";
import { useAuth } from "@/context/AuthContext";
import StudentSidebar from "@/components/student/StudentSidebar";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import AssessmentHistory from "@/components/assessment/AssessmentHistory";
import ReferralsPage from "@/components/referrals/ReferralsPage";
import ResourcesPage from "@/components/resources/ResourcesPage";
import { Menu, Brain, BarChart3, BookOpen, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Mock assessment results data
const mockAssessmentResults = [
  { id: 1, date: "2024-05-22", score: 15, risk: "Low", mood: "Good", stress: "Minimal", recommendation: "Continue current wellness practices" },
  { id: 2, date: "2024-05-18", score: 28, risk: "Medium", mood: "Okay", stress: "Moderate", recommendation: "Consider stress management techniques" },
  { id: 3, date: "2024-05-14", score: 12, risk: "Low", mood: "Very Good", stress: "Low", recommendation: "Maintain healthy lifestyle" },
  { id: 4, date: "2024-05-10", score: 35, risk: "Medium", mood: "Struggling", stress: "High", recommendation: "Seek counseling support" }
];

// Mock journal entries
const mockJournalEntries = [
  { id: 1, date: "2024-05-22", title: "Exam Preparation", content: "Feeling a bit overwhelmed with upcoming exams but trying to stay positive. Started using the breathing exercises from the resources section.", mood: "Anxious but hopeful" },
  { id: 2, date: "2024-05-20", title: "Weekend Reflection", content: "Had a good weekend with friends. Feeling more connected and supported. The group study session really helped reduce my stress.", mood: "Content" },
  { id: 3, date: "2024-05-18", title: "Academic Stress", content: "Assignment deadlines are piling up. Need to work on time management. Maybe I should talk to someone about stress management strategies.", mood: "Stressed" }
];

// Student dashboard pages
const StudentHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get display name for welcome message
  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.name?.split(' ')[0] || 'Student';
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {getDisplayName()}!</h1>
        <p className="text-gray-600 mt-2">Monitor your mental health and access support resources</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/check-mental-health')}>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold text-lg ml-3">Quick Assessment</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Take a quick mental health check</p>
            <Button className="w-full">Start Assessment</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/results')}>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-lg ml-3">Recent Results</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">Last assessment: May 22, 2024</p>
            <div className="flex items-center mb-4">
              <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
              <span className="ml-2 text-sm text-gray-600">Score: 15/60</span>
            </div>
            <Button variant="outline" className="w-full">View All Results</Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student/resources')}>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold text-lg ml-3">Resources</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Access mental health resources and self-help materials</p>
            <Button variant="outline" className="w-full">Browse Resources</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Wellness Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Wellness</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-sm font-medium">Good</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Stress Level</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>
                  <span className="text-sm font-medium">Low</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sleep Quality</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-sm font-medium">Good</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Practice Deep Breathing</p>
                <p className="text-xs text-blue-700">Try the 4-7-8 technique for instant stress relief</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-900">Stay Connected</p>
                <p className="text-xs text-green-700">Reach out to friends or family when feeling overwhelmed</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-900">Journal Your Thoughts</p>
                <p className="text-xs text-purple-700">Writing can help process emotions and reduce stress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StudentResults: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">My Assessment Results</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">4</p>
              <p className="text-gray-600">Total Assessments</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">Improving</p>
              <p className="text-gray-600">Overall Trend</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">Low</p>
              <p className="text-gray-600">Current Risk Level</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAssessmentResults.map((result) => (
            <div key={result.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Assessment - {result.date}</p>
                  <p className="text-sm text-gray-600">Score: {result.score}/60</p>
                </div>
                <Badge variant={
                  result.risk === "Low" ? "default" : 
                  result.risk === "Medium" ? "secondary" : "destructive"
                }>
                  {result.risk} Risk
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Mood: </span>
                  <span>{result.mood}</span>
                </div>
                <div>
                  <span className="font-medium">Stress: </span>
                  <span>{result.stress}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium text-sm">Recommendation: </span>
                <span className="text-sm text-gray-700">{result.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const StudentJournal: React.FC = () => {
  const [entries, setEntries] = useState(mockJournalEntries);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", mood: "" });
  const [isWriting, setIsWriting] = useState(false);

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry = {
        id: entries.length + 1,
        date: new Date().toISOString().split('T')[0],
        ...newEntry
      };
      setEntries([entry, ...entries]);
      setNewEntry({ title: "", content: "", mood: "" });
      setIsWriting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Journal / Notes</h1>
        <Button onClick={() => setIsWriting(true)} disabled={isWriting}>
          <BookOpen className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {isWriting && (
        <Card>
          <CardHeader>
            <CardTitle>New Journal Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
            />
            <Input
              placeholder="How are you feeling?"
              value={newEntry.mood}
              onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
            />
            <Textarea
              placeholder="Write your thoughts..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
              rows={4}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSaveEntry}>Save Entry</Button>
              <Button variant="outline" onClick={() => setIsWriting(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                  <p className="text-sm text-gray-600">{entry.date}</p>
                </div>
                <Badge variant="outline">{entry.mood}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const StudentAppointments: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">Dr. Sarah Uwimana</p>
              <p className="text-sm text-gray-600">May 25, 2024 at 2:00 PM</p>
              <p className="text-sm">Initial consultation</p>
              <Badge className="mt-2">Confirmed</Badge>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Group Therapy Session</p>
              <p className="text-sm text-gray-600">May 28, 2024 at 4:00 PM</p>
              <p className="text-sm">Stress management workshop</p>
              <Badge variant="secondary" className="mt-2">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book New Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule with Counselor
            </Button>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Join Group Session
            </Button>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Emergency Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Available Support Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Individual Counseling</h4>
            <p className="text-sm text-gray-600">One-on-one sessions with licensed counselors</p>
            <p className="text-sm text-blue-600">Available Mon-Fri, 9AM-5PM</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Group Therapy</h4>
            <p className="text-sm text-gray-600">Peer support groups for various topics</p>
            <p className="text-sm text-blue-600">Weekly sessions available</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Crisis Support</h4>
            <p className="text-sm text-gray-600">24/7 emergency mental health support</p>
            <p className="text-sm text-red-600">Call: 116 (Rwanda Crisis Line)</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Wellness Workshops</h4>
            <p className="text-sm text-gray-600">Educational sessions on mental health topics</p>
            <p className="text-sm text-blue-600">Monthly schedule available</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const StudentSettings: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Assessment Reminders</p>
              <p className="text-sm text-gray-600">Weekly wellness check-ins</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Appointment Reminders</p>
              <p className="text-sm text-gray-600">24-hour appointment notifications</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Resource Updates</p>
              <p className="text-sm text-gray-600">New self-help materials</p>
            </div>
            <Badge variant="secondary">Disabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Data Sharing</p>
              <p className="text-sm text-gray-600">Anonymous data for research</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Progress Tracking</p>
              <p className="text-sm text-gray-600">Store assessment history</p>
            </div>
            <Badge>Enabled</Badge>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Emergency Contacts</p>
              <p className="text-sm text-gray-600">Family notification in crisis</p>
            </div>
            <Badge variant="secondary">Not Set</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const StudentDashboardPage: React.FC = () => {
  const { isLoading } = useML();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main content area with proper spacing */}
      <div className="flex-1 flex flex-col">
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
          {isLoading && (
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
                  <p className="text-sm text-gray-500">Processing assessment... Please wait</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/check-mental-health" element={<AssessmentForm />} />
            <Route path="/results" element={<StudentResults />} />
            <Route path="/journal" element={<StudentJournal />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/appointments" element={<StudentAppointments />} />
            <Route path="/settings" element={<StudentSettings />} />
            {/* Legacy routes */}
            <Route path="/history" element={<Navigate to="/student/results" replace />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
