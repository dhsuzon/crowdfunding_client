'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInAndGetToken as signIn } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Input, InputGroup, TextField, Label, FieldError, Form } from '@heroui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

function getLoginError(err) {
  if (!err) return 'Login failed. Please try again.';
  const msg = (err.message || '').toLowerCase();
  const code = (err.code || '').toLowerCase();
  if (code === 'user_not_found' || msg.includes('user not found') || msg.includes('no account')) {
    return 'No account found with this email. Please check your email or register.';
  }
  if (code === 'invalid_password' || msg.includes('invalid password') || msg.includes('invalid email or password')) {
    return 'Invalid email or password. Please try again.';
  }
  if (msg.includes('rate limit') || code === 'rate_limit') {
    return 'Too many attempts. Please wait and try again.';
  }
  return err.message || 'Login failed. Please try again.';
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await signIn.email({ email: form.email, password: form.password });
      if (result.error) {
        toast.error(getLoginError(result.error));
        return;
      }
      if (result.data) {
        toast.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(getLoginError(err));
    } finally {
      setLoading(false);
    }
  }, [form, validate, router]);

  const handleGoogle = useCallback(async () => {
    try {
      const result = await signIn.social({ provider: 'google' });
      if (result?.data) {
        const { getApiToken } = await import('@/lib/auth-client');
        await getApiToken();
        toast.success('Google login successful!');
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err?.message || 'Google login failed');
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>
          <Form onSubmit={handleSubmit} className="space-y-5">
            <TextField value={form.email} onChange={(v) => setForm({ ...form, email: v })} isInvalid={!!errors.email} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <Input placeholder="your@email.com" />
              {errors.email && <FieldError className="text-red-500 text-sm">{errors.email}</FieldError>}
            </TextField>
            <TextField value={form.password} onChange={(v) => setForm({ ...form, password: v })} isInvalid={!!errors.password} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <InputGroup>
                <InputGroup.Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                <InputGroup.Suffix>
                  <Button isIconOnly variant="ghost" size="sm" onPress={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
              {errors.password && <FieldError className="text-red-500 text-sm">{errors.password}</FieldError>}
            </TextField>
            <Button type="submit" isDisabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>
          <div className="mt-4">
            <Button onPress={handleGoogle} className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span>Continue with Google</span>
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account? <Link href="/register" className="text-indigo-600 hover:underline">Register</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
