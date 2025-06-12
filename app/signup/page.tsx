// "use client";

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
// import { z } from 'zod';

// const SignupSchema = z.object({
//     name: z.string().min(2).max(100).nonempty(),
//     email: z.string().email(),
//     password: z.string().min(8).max(100).nonempty(),
//     confirmPassword: z.string().min(8).max(100).nonempty()
// }).refine(data => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"]
// });

// // Extract the inferred type from the schema
// type SignupFormData = z.infer<typeof SignupSchema>;

// export default function Signup() {
//     // Form state
//     const [formData, setFormData] = useState<SignupFormData>({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });

//     // UI state
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
//     const [signupSuccess, setSignupSuccess] = useState(false);

//     // Handle input changes
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         // Clear error when field is edited
//         if (formErrors[name]) {
//             setFormErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }));
//         }
//     };



//     // Handle form submission
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         // Clear previous errors
//         setFormErrors({});
        
//         // Validate using Zod
//         const validationResult = SignupSchema.safeParse(formData);
        
//         if (!validationResult.success) {
//             // Extract and format Zod errors
//             const zodErrors: {[key: string]: string} = {};
//             validationResult.error.issues.forEach(issue => {
//                 const path = issue.path[0] as string;
//                 zodErrors[path] = issue.message;
//             });
            
//             setFormErrors(zodErrors);
//             return;
//         }
        
//         setIsSubmitting(true);

//         try {
//             // Send data to signup API endpoint
//             const response = await fetch('/api/auth/signup', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     email: formData.email,
//                     password: formData.password
//                 }),
//             });
            
//             const data = await response.json();
            
//             if (!response.ok) {
//                 // Handle API errors
//                 throw new Error(data.message || 'Signup failed');
//             }
            
//             // Show success state
//             setSignupSuccess(true);
            
//             // Reset form
//             setFormData({
//                 name: '',
//                 email: '',
//                 password: '',
//                 confirmPassword: ''
//             });
//         } catch (error) {
//             console.error('Signup error:', error);
//             setFormErrors({ 
//                 form: error instanceof Error ? error.message : 'Failed to create account. Please try again.' 
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//             <div className="sm:mx-auto sm:w-full sm:max-w-md">
//                 <div className="text-center">
//                     <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-400">
//                         <span className="font-bold text-xl">DevToolbox</span>
//                     </Link>
//                 </div>

//                 <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
//                     Create your account
//                 </h2>
//                 <p className="mt-2 text-center text-sm text-gray-400">
//                     Already have an account?{' '}
//                     <Link href="/signin" className="font-medium text-blue-500 hover:text-blue-400">
//                         sign in
//                     </Link>
//                 </p>
//             </div>

//             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//                 <motion.div
//                     className="bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4 }}
//                 >
//                     {signupSuccess ? (
//                         <div className="text-center py-8">
//                             <motion.div
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ delay: 0.2, type: "spring" }}
//                                 className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"
//                             >
//                                 <CheckCircle className="h-10 w-10 text-green-600" />
//                             </motion.div>
//                             <h3 className="text-xl font-medium text-white mb-2">Account created!</h3>
//                             <p className="text-gray-400 mb-6">Your account has been successfully created.</p>
//                             <div className="flex flex-col space-y-3">
//                                 <Link href="/signin" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                                     Sign in now
//                                     <ArrowRight className="ml-2 h-4 w-4" />
//                                 </Link>
//                                 <Link href="/" className="text-sm text-gray-400 hover:text-gray-300">
//                                     Return to home page
//                                 </Link>
//                             </div>
//                         </div>
//                     ) : (
//                         <form className="space-y-6" onSubmit={handleSubmit}>
//                             {formErrors.form && (
//                                 <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-md text-sm">
//                                     {formErrors.form}
//                                 </div>
//                             )}

//                             {/* Name Field */}
//                             <div>
//                                 <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//                                     Full Name
//                                 </label>
//                                 <div className="mt-1 relative rounded-md shadow-sm">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <User className="h-5 w-5 text-gray-500" />
//                                     </div>
//                                     <input
//                                         id="name"
//                                         name="name"
//                                         type="text"
//                                         autoComplete="name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         className={`block w-full pl-10 pr-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-700'
//                                             } rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                                         placeholder="John Doe"
//                                     />
//                                 </div>
//                                 {formErrors.name && (
//                                     <p className="mt-2 text-sm text-red-500">{formErrors.name}</p>
//                                 )}
//                             </div>

//                             {/* Email Field */}
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//                                     Email address
//                                 </label>
//                                 <div className="mt-1 relative rounded-md shadow-sm">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Mail className="h-5 w-5 text-gray-500" />
//                                     </div>
//                                     <input
//                                         id="email"
//                                         name="email"
//                                         type="email"
//                                         autoComplete="email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         className={`block w-full pl-10 pr-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-700'
//                                             } rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                                         placeholder="you@example.com"
//                                     />
//                                 </div>
//                                 {formErrors.email && (
//                                     <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>
//                                 )}
//                             </div>

//                             {/* Password Field */}
//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                                     Password
//                                 </label>
//                                 <div className="mt-1 relative rounded-md shadow-sm">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Lock className="h-5 w-5 text-gray-500" />
//                                     </div>
//                                     <input
//                                         id="password"
//                                         name="password"
//                                         type={showPassword ? "text" : "password"}
//                                         autoComplete="new-password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         className={`block w-full pl-10 pr-10 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-700'
//                                             } rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                                         placeholder="••••••••"
//                                     />
//                                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowPassword(!showPassword)}
//                                             className="text-gray-500 hover:text-gray-400 focus:outline-none"
//                                         >
//                                             {showPassword ? (
//                                                 <EyeOff className="h-5 w-5" />
//                                             ) : (
//                                                 <Eye className="h-5 w-5" />
//                                             )}
//                                         </button>
//                                     </div>
//                                 </div>
//                                 {formErrors.password ? (
//                                     <p className="mt-2 text-sm text-red-500">{formErrors.password}</p>
//                                 ) : (
//                                     <p className="mt-2 text-xs text-gray-500">
//                                         Password must be at least 8 characters long
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Confirm Password Field */}
//                             <div>
//                                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
//                                     Confirm Password
//                                 </label>
//                                 <div className="mt-1 relative rounded-md shadow-sm">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Lock className="h-5 w-5 text-gray-500" />
//                                     </div>
//                                     <input
//                                         id="confirmPassword"
//                                         name="confirmPassword"
//                                         type={showConfirmPassword ? "text" : "password"}
//                                         autoComplete="new-password"
//                                         value={formData.confirmPassword}
//                                         onChange={handleChange}
//                                         className={`block w-full pl-10 pr-10 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'
//                                             } rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                                         placeholder="••••••••"
//                                     />
//                                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                             className="text-gray-500 hover:text-gray-400 focus:outline-none"
//                                         >
//                                             {showConfirmPassword ? (
//                                                 <EyeOff className="h-5 w-5" />
//                                             ) : (
//                                                 <Eye className="h-5 w-5" />
//                                             )}
//                                         </button>
//                                     </div>
//                                 </div>

//                             </div>

//                             <div>
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:bg-blue-500 disabled:cursor-not-allowed"
//                                 >
//                                     {isSubmitting ? 'Creating account...' : 'Sign up'}
//                                 </button>
//                             </div>
//                         </form>
//                     )}
//                 </motion.div>

                
//             </div>
//         </div>
//     );
// }


"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { useRouter } from "next/navigation";

const SignupSchema = z.object({
    name: z.string().min(2).max(100).nonempty(),
    email: z.string().email(),
    password: z.string().min(8).max(100).nonempty(),
    confirmPassword: z.string().min(8).max(100).nonempty()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type SignupFormData = z.infer<typeof SignupSchema>;

export default function Signup() {
    const router = useRouter();

    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [signupSuccess, setSignupSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});
        setIsSubmitting(true);

        const result = SignupSchema.safeParse(formData);

        if (!result.success) {
            const errors: { [key: string]: string } = {};
            result.error.errors.forEach(err => {
                if (err.path[0]) errors[err.path[0]] = err.message;
            });
            setFormErrors(errors);
            setIsSubmitting(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setSignupSuccess(true);
            setIsSubmitting(false);
            // Redirect to signin and replace history
            router.replace("/signin");
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {signupSuccess ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="text-green-500 mb-2" size={40} />
                        <p className="text-green-600 mb-4">Signup successful! Redirecting to sign in...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-10 pr-3 py-2 border rounded w-full"
                                    placeholder="Your Name"
                                    autoComplete="name"
                                />
                            </div>
                            {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 pr-3 py-2 border rounded w-full"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 pr-10 py-2 border rounded w-full"
                                    placeholder="Password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-gray-400"
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="pl-10 pr-10 py-2 border rounded w-full"
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-gray-400"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            ) : (
                                <ArrowRight className="mr-2" size={18} />
                            )}
                            Sign Up
                        </button>
                    </form>
                )}
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}