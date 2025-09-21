# Authentication Setup Guide

This guide explains how to set up and use the authentication system in the Cinesaga frontend.

## Features

- **Email & Phone OTP Authentication**: Users can sign in/up using either email or phone number
- **JWT Token Management**: Secure token-based authentication
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Context**: Global user state management
- **Responsive UI**: Mobile-friendly authentication forms

## API Integration

The frontend integrates with the backend authentication API:

### Backend Endpoints Used:
- `POST /auth/send-otp` - Send OTP to email/phone
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `POST /auth/reset-password` - Reset password with OTP
- `POST /otp/verify` - Verify OTP code

### Environment Configuration

Create a `.env` file in the Frontend directory:

```env
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
```

## Authentication Flow

### Sign Up Process:
1. User enters name, password, and contact info (email/phone)
2. System sends OTP to selected contact method
3. User verifies OTP
4. Account is created and user is redirected to sign in

### Sign In Process:
1. User enters contact info (email/phone)
2. System sends OTP for verification
3. User verifies OTP
4. User enters password
5. User is logged in and redirected to home

## Components

### Core Components:
- `AuthContext` - Global authentication state
- `ProtectedRoute` - Route protection wrapper
- `SignIn` - Sign in page with OTP + password flow
- `SignUp` - Registration page with OTP verification

### Custom Hooks:
- `useAuth` - Authentication actions (login, register, OTP)
- `useLogout` - Logout functionality
- `usePasswordReset` - Password reset with OTP

## Usage Examples

### Using Authentication Context:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.email}!</div>;
  }
  
  return <div>Please sign in</div>;
}
```

### Protecting Routes:
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### Using Authentication Hooks:
```tsx
import { useLogin, useOtp } from '@/hooks/useAuth';

function LoginForm() {
  const { handleLogin, isLoading } = useLogin();
  const { sendOtp, verifyOtp } = useOtp();
  
  // Use the hooks for authentication actions
}
```

## API Service

The `apiService` handles all backend communication:

```tsx
import { apiService } from '@/services/api';

// Send OTP
await apiService.sendOtp({
  identifier: 'user@example.com',
  type: 'email',
  purpose: 'registration'
});

// Login
await apiService.login({
  identifier: 'user@example.com',
  password: 'password123',
  type: 'email'
});
```

## Error Handling

All authentication actions include proper error handling with toast notifications:

- Invalid credentials
- Network errors
- OTP verification failures
- Registration errors

## Security Features

- **Password Hashing**: Handled by backend
- **JWT Tokens**: Secure token-based authentication
- **OTP Expiry**: 10-minute OTP validity
- **Input Validation**: Client-side validation
- **Secure Storage**: Tokens stored in localStorage

## Development

### Running the Frontend:
```bash
cd Frontend
npm install
npm run dev
```

### Backend Requirements:
- Backend must be running on `http://localhost:3000`
- All authentication endpoints must be available
- CORS must be configured for frontend domain

## Troubleshooting

### Common Issues:

1. **API Connection Failed**: Check if backend is running and `VITE_API_URL` is correct
2. **OTP Not Received**: Check email/spam folder or verify phone number format
3. **Login Redirect Issues**: Ensure AuthProvider wraps the entire app
4. **Token Expired**: User will be automatically logged out

### Debug Mode:
Set `VITE_NODE_ENV=development` to enable detailed error logging.
