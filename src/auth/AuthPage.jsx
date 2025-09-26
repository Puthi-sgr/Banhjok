import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Truck, 
  UtensilsCrossed,
  Store,
  Shield
} from 'lucide-react';

const AuthPage = () => {
  const { user, loginCustomer, loginVendor, loginAdmin, registerCustomer } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('admin'); // 'customer', 'vendor', 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  // email: 'systemAdmin@example.com',
  //   password: 'AdminPassword123'

  // Redirect if already logged in
  if (user) {
    if (user.role === 'customer') return <Navigate to="/" replace />;
    if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
  }

  const userTypes = [
    {
      id: 'customer',
      name: 'Customer',
      icon: UtensilsCrossed,
      description: 'Order food from restaurants',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      borderColor: 'border-green-500',
      textColor: 'text-green-600'
    },
    // {
    //   id: 'vendor',
    //   name: 'Vendor',
    //   icon: Store,
    //   description: 'Manage your restaurant',
    //   color: 'bg-purple-600',
    //   hoverColor: 'hover:bg-purple-700',
    //   borderColor: 'border-purple-500',
    //   textColor: 'text-purple-600'
    // },
    {
      id: 'admin',
      name: 'Admin',
      icon: Shield,
      description: 'Manage the platform',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600'
    }
  ];

  const currentUserType = userTypes.find(type => type.id === userType);

  const validateForm = () => {
    const newErrors = {};
    
    if (isRegister && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      if (isRegister) {
        await registerCustomer(formData.name, formData.email, formData.password);
        navigate('/');
      } else {
        let userData;
        switch (userType) {
          case 'customer':
            userData = await loginCustomer(formData.email, formData.password);
            navigate('/');
            break;
          case 'vendor':
            userData = await loginVendor(formData.email, formData.password);
            navigate('/vendor');
            break;
          case 'admin':
            userData = await loginAdmin(formData.email, formData.password);
            navigate('/dashboard');
            break;
          default:
            throw new Error('Invalid user type');
        }
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong, please try again!" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setIsRegister(false); // Reset to login when switching user types
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  };

  const toggleMode = () => {
    if (userType === 'customer') {
      setIsRegister(!isRegister);
      setErrors({});
      setFormData({ name: '', email: '', password: '' });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className={`${currentUserType.color} p-3 rounded-full`}>
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegister ? 'Join our food delivery platform' : 'Sign in to continue'}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {isRegister ? 'Register as' : 'Sign in as'}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleUserTypeChange(type.id)}
                className={`relative flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  userType === type.id
                    ? `${type.borderColor} bg-gray-50`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`${userType === type.id ? type.color : 'bg-gray-400'} p-2 rounded-lg mr-4 transition-colors duration-200`}>
                  <type.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className={`font-medium ${userType === type.id ? type.textColor : 'text-gray-900'}`}>
                    {type.name}
                  </div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
                {userType === type.id && (
                  <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 pr-10 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {errors.submit && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${currentUserType.color} ${currentUserType.hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <currentUserType.icon className="h-5 w-5 mr-2" />
                    {isRegister ? `Create ${currentUserType.name} Account` : `Sign in as ${currentUserType.name}`}
                  </>
                )}
              </button>
            </div>

            {userType === 'admin' && !isRegister && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Admin Test Credentials</p>
                <div className="space-y-1 font-mono">
                  <p>Email: systemAdmin@example.com</p>
                  <p>Password: AdminPassword123</p>
                </div>
                <p className="mt-2 text-xs text-blue-700">
                  Use these credentials to access the admin dashboard during testing.
                </p>
              </div>
            )}

            {userType === 'customer' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  {isRegister 
                    ? "Already have an account? Sign in" 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
