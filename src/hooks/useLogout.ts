import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useLogout = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return { handleLogout };
};
