
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

import { useAuth } from "@/context/AuthContext";
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
import { supabase } from "@/integrations/supabase/client";

// Form schema validation
const loginSchema = z.object({
  loginType: z.enum(["student", "admin"]),
  identifier: z.string().min(1, "This field is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginType: "student",
      identifier: "",
      password: "",
    },
  });

  // Watch the login type to change the identifier field label and placeholder
  const loginType = form.watch("loginType");

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Attempting login with:", { 
        identifier: data.identifier, 
        loginType: data.loginType 
      });
      
      // For student, we use regNumber, for admin we use email
      const success = await login(data.identifier, data.password, data.loginType);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      } else {
        const errorMessage = loginType === "student" 
          ? "Invalid registration number or password. Please check your details and try again."
          : "Invalid email or password. Please check your details and try again.";
          
        setError(errorMessage);
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again later.");
      toast({
        title: "Login error",
        description: "There was a problem processing your login. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Development helper function
  const loginAsTestUser = async (userType: 'student' | 'admin') => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Default test credentials
      let email = userType === 'student' ? '220014748@example.com' : 'admin@example.com';
      let password = 'password123';
      
      console.log(`Development login: Attempting to log in as test ${userType}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Test login error:", error.message);
        toast({
          title: "Development login failed",
          description: `Could not log in as test ${userType}. Error: ${error.message}`,
          variant: "destructive",
        });
        setError(`Test ${userType} login failed: ${error.message}`);
        return;
      }
      
      if (data.user) {
        toast({
          title: "Development login successful",
          description: `Logged in as test ${userType}`,
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Development login error:", err);
      setError(`An error occurred during test ${userType} login`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
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
              name="loginType"
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
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {loginType === "student" ? "Registration Number" : "Email"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={loginType === "student" ? "e.g. 220014748" : "you@example.com"} 
                      {...field} 
                    />
                  </FormControl>
                  {loginType === "student" && (
                    <FormDescription className="text-xs">
                      Enter your University of Rwanda registration number (e.g. 220014748, 221022348, 221000780)
                    </FormDescription>
                  )}
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
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        
        {/* Development tools section */}
        {import.meta.env.DEV && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Development Accounts</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => loginAsTestUser('student')}
                disabled={isSubmitting}
              >
                Test Student
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => loginAsTestUser('admin')}
                disabled={isSubmitting}
              >
                Test Admin
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              These buttons use test accounts with password: password123
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
