import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { apiService, LoginRequest, RegisterRequest, SendOtpRequest, VerifyOtpRequest, ResetPasswordRequest, UserProfile } from '@/services/api';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in to Cinesaga.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        // For registration, we need to login the user after successful registration
        // Since the backend doesn't return a token in registration, we'll need to login
        toast({
          title: "Account Created!",
          description: "Welcome to Cinesaga! Your account has been created successfully.",
        });
        navigate("/signin");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
};

export const useOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendOtp = async (otpData: SendOtpRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.sendOtp(otpData);
      
      if (response.success) {
        toast({
          title: "OTP Sent!",
          description: `We've sent a 6-digit OTP to your ${otpData.type}.`,
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Unable to send OTP. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const verifyOtp = async (otpData: VerifyOtpRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.verifyOtp(otpData);
      
      if (response.success) {
        toast({
          title: "OTP Verified!",
          description: "Your OTP has been verified successfully.",
        });
        return true;
      }
    } catch (error: any) {
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Invalid or expired OTP. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const checkOtp = async (otpData: VerifyOtpRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.checkOtp(otpData);
      
      if (response.success && response.data) {
        return response.data.isValid;
      }
    } catch (error: any) {
      console.error('OTP check failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return { sendOtp, verifyOtp, checkOtp, isLoading };
};

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetPassword = async (resetData: ResetPasswordRequest) => {
    setIsLoading(true);
    try {
      const response = await apiService.resetPassword(resetData);
      
      if (response.success) {
        toast({
          title: "Password Reset!",
          description: "Your password has been reset successfully.",
        });
        navigate("/signin");
        return true;
      }
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return { resetPassword, isLoading };
};

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const getUserProfile = useCallback(async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await apiService.getUserProfile(userId);
      
      if (response.success && response.data) {
        setProfile(response.data);
        return response.data;
      }
    } catch (error: any) {
      toast({
        title: "Failed to load profile",
        description: error.message || "Unable to load user profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  }, [toast]);

  return { getUserProfile, profile, isLoading };
};

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuthContext();
  const { toast } = useToast();

  const updateUserProfile = async (userId: number, profileData: {
    firstName: string;
    lastName: string;
    email?: string;
    mobile?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiService.updateUserProfile(userId, profileData);
      
      if (response.success && response.data) {
        // Update the user in context with new profile data
        const updatedUser = {
          id: response.data.user.id,
          email: response.data.user.email,
          mobile: response.data.user.mobile,
          roleId: response.data.user.roleId,
          uuid: response.data.user.uuid,
          profile: response.data.profile,
        };
        updateUser(updatedUser);
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        
        return response.data;
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return { updateUserProfile, isLoading };
};
