'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Input, InputGroup, TextField, Label, FieldError, Select, SelectTrigger, SelectValue, SelectPopover, Form, Card } from '@heroui/react';
import { ListBox, ListBoxItem } from 'react-aria-components';
import { HiEye, HiEyeOff } from 'react-icons/hi';

function getRegisterError(err) {
  if (!err) return 'Registration failed. Please try again.';
  const msg = (err.message || '').toLowerCase();
  const code = (err.code || '').toLowerCase();
  if (code === 'user_already_exists' || msg.includes('already exists') || msg.includes('already registered')) {
    return 'This email is already registered. Please sign in.';
  }
  if (code === 'invalid_email' || msg.includes('invalid email')) {
    return 'Please provide a valid email address.';
  }
  if (code === 'weak_password' || msg.includes('weak password') || msg.includes('password too short')) {
    return 'Password is too weak. Use at least 6 characters with letters and numbers.';
  }
  return err.message || 'Registration failed. Please try again.';
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '', role: 'supporter' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const credits = form.role === 'creator' ? 20 : 50;
      const result = await signUp.email({
        name: form.name, email: form.email, password: form.password,
        role: form.role, photoURL: form.photoURL, credits,
      });
      if (result.error) {
        if (result.error.code === 'USER_ALREADY_EXISTS') {
          toast.error('This email is already registered. Please sign in.');
          router.push('/login');
          return;
        }
        toast.error(getRegisterError(result.error));
        return;
      }
      toast.success('Account created! Please sign in.');
      router.push('/login');
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }, [form, validate, router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4 py-8">
        <Card className="w-full max-w-md shadow-lg">
          <Card.Content className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create Account</h2>
          <Form onSubmit={handleSubmit} className="space-y-5">
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
            <TextField value={form.password} onChange={(v) => setForm({ ...form, password: v })} isInvalid={!!errors.password} className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">Password</Label>
              <InputGroup>
                <InputGroup.Input type={showPassword ? 'text' : 'password'} placeholder="•••••••• (min 6 chars)" />
                <InputGroup.Suffix>
                  <Button isIconOnly variant="ghost" size="sm" onPress={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
              {errors.password && <FieldError className="text-red-500 text-sm">{errors.password}</FieldError>}
            </TextField>
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium text-gray-700">I want to join as</Label>
              <Select selectedKey={form.role} onSelectionChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none flex items-center justify-between">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopover>
                  <ListBox className="bg-white border rounded-lg shadow-lg p-1">
                    <ListBoxItem id="supporter" className="px-4 py-2 text-sm hover:bg-indigo-50 rounded cursor-pointer">Supporter (Get 50 Credits)</ListBoxItem>
                    <ListBoxItem id="creator" className="px-4 py-2 text-sm hover:bg-indigo-50 rounded cursor-pointer">Creator (Get 20 Credits)</ListBoxItem>
                  </ListBox>
                </SelectPopover>
              </Select>
            </div>
            <Button type="submit" isDisabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </Form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Sign In</Link>
          </p>
          </Card.Content>
        </Card>
      </div>
      <Footer />
    </>
  );
}
