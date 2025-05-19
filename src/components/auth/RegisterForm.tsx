
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema validation with conditional validation for regNumber
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(["student", "admin"]),
  regNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Only require regNumber for students
  if (data.role === "student" && (!data.regNumber || data.regNumber.length < 3)) {
    return false;
  }
  return true;
}, {
  message: "Registration number is required for students",
  path: ["regNumber"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      regNumber: "",
    },
    mode: "onChange"
  });

  // Watch the role to conditionally show regNumber field
  const selectedRole = form.watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Attempting registration with:", {
        name: data.name,
        regNumber: data.regNumber || "",
        email: data.email,
        role: data.role
      });
      
      const success = await register(
        data.name,
        data.regNumber || "",
        data.email,
        data.password,
        data.role as UserRole
      );
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Welcome to VARP!",
        });
        // Navigation is handled in the AuthContext
      } else {
        // Show more specific error messages based on role
        if (data.role === "student") {
          setError(`Registration number ${data.regNumber} is already registered. Please use another or contact support.`);
        } else {
          setError(`Email address ${data.email} is already registered. Please use another or try resetting your password.`);
        }
        toast({
          title: "Registration failed",
          description: data.role === "student" 
            ? "Registration number already in use" 
            : "Email address already in use",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      
      // Check if the error is related to a duplicate user
      if (err.message?.includes("already registered") || err.message?.includes("already exists")) {
        if (selectedRole === "student") {
          setError(`Registration number ${form.getValues("regNumber")} is already registered. Please use another number.`);
        } else {
          setError(`Email ${form.getValues("email")} is already registered. Please use another email address.`);
        }
      } else {
        setError("An error occurred during registration. Please try again.");
      }
      
      toast({
        title: "Registration error",
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function for demo registration
  const registerAsTestUser = async (userType: 'student' | 'admin') => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Default test credentials with random values to avoid conflicts
      const timestamp = new Date().getTime().toString().slice(-6);
      const testData = userType === 'student' 
        ? {
            name: "Test Student",
            email: `test.student.${timestamp}@example.com`,
            regNumber: "221" + timestamp,
            password: "password123",
            role: "student" as UserRole
          }
        : {
            name: "Test Admin",
            email: `test.admin.${timestamp}@example.com`,
            regNumber: "",
            password: "password123",
            role: "admin" as UserRole
          };
      
      console.log(`Demo registration: Attempting to register test ${userType} with:`, testData);
      
      const success = await register(
        testData.name,
        testData.regNumber,
        testData.email,
        testData.password,
        testData.role
      );
      
      if (success) {
        toast({
          title: "Test registration successful",
          description: `Registered as test ${userType}`,
        });
        // Navigation is handled in the AuthContext
      } else {
        setError(`Could not register test ${userType}`);
        toast({
          title: "Test registration failed",
          description: `Could not register as test ${userType}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Test registration error:", err);
      setError(`An error occurred during test ${userType} registration`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
          Create an account to access the VARP platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedRole === "student" && (
              <FormField
                control={form.control}
                name="regNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 220014748" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Enter your University of Rwanda registration number (e.g. 220014748, 221022348, 221000780)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </Form>
        
        {/* Demo account creation section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Demo Accounts</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => registerAsTestUser('student')}
              disabled={isSubmitting}
            >
              Create Test Student
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => registerAsTestUser('admin')}
              disabled={isSubmitting}
            >
              Create Test Admin
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            These buttons create random test accounts with password: password123
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
