import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });
  
  const { user, updateUser } = useAuth();
  const { getUserProfile, profile, isLoading: profileLoading } = useProfile();
  const { updateUserProfile, isLoading } = useUpdateProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id && !profile && !profileLoading) {
      // Fetch the complete profile data only if not already loaded
      getUserProfile(user.id);
    }
  }, [user?.id, getUserProfile, profile, profileLoading]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.profile?.firstName || "",
        lastName: profile.profile?.lastName || "",
        email: profile.user?.email || "",
        mobile: profile.user?.mobile || "",
      });
    } else if (user) {
      // Fallback to user data if profile is not loaded yet
      setFormData({
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedProfile = await updateUserProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
      });
      
      if (updatedProfile) {
        // Update the user context with the new profile data
        const updatedUser = {
          id: updatedProfile.user.id,
          email: updatedProfile.user.email,
          mobile: updatedProfile.user.mobile,
          roleId: updatedProfile.user.roleId,
          uuid: updatedProfile.user.uuid,
          profile: updatedProfile.profile,
        };
        updateUser(updatedUser);
      }
      
      navigate("/");
    } catch (error: any) {
      // Error handling is done in the hook
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Edit Profile
              </h1>
              <p className="text-foreground-muted">
                Update your personal information
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <Card className="backdrop-blur-xl bg-background/98 border-border/30 shadow-2xl ring-1 ring-primary/10">
            <CardHeader className="space-y-4">
              <CardTitle className="text-xl font-semibold text-foreground">
                Personal Information
              </CardTitle>
              <CardDescription className="text-foreground-muted">
                Update your name, email, and phone number
              </CardDescription>
            </CardHeader>

            <CardContent>
              {profileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-foreground-muted">Loading profile...</span>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name *
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name *
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-sm font-medium text-foreground">
                      Phone Number
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
