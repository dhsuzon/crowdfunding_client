'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpAndGetToken as signUp } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Input, TextField, Label, FieldError } from '@heroui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '', role: 'supporter' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await signUp.email({
        name: form.name, email: form.email, password: form.password, role: form.role, photoURL: form.photoURL,
      });
      if (data) {
        toast.success('Registration successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField value={form.name} onChange={(v) => setForm({ ...form, name: v })} isInvalid={!!errors.name} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">Name</Label>
              <Input placeholder="John Doe" />
              {errors.name && <FieldError className="text-red-500 text-sm">{errors.name}</FieldError>}
            </TextField>
            <TextField value={form.email} onChange={(v) => setForm({ ...form, email: v })} isInvalid={!!errors.email} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <Input placeholder="your@email.com" />
              {errors.email && <FieldError className="text-red-500 text-sm">{errors.email}</FieldError>}
            </TextField>
            <TextField value={form.photoURL} onChange={(v) => setForm({ ...form, photoURL: v })} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">Profile Picture URL</Label>
              <Input placeholder="https://example.com/photo.jpg" />
            </TextField>
            <TextField value={form.password} onChange={(v) => setForm({ ...form, password: v })} isInvalid={!!errors.password} type={showPassword ? 'text' : 'password'} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder="•••••••• (min 6 chars)" className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              {errors.password && <FieldError className="text-red-500 text-sm">{errors.password}</FieldError>}
            </TextField>
            <TextField value={form.role} onChange={(v) => setForm({ ...form, role: v })} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">I want to join as</Label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="supporter">Supporter (Get 50 Credits)</option>
                <option value="creator">Creator (Get 20 Credits)</option>
              </select>
            </TextField>
            <Button type="submit" isDisabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
