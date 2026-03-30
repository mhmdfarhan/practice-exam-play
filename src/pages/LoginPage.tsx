import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(email, password)) {
      setError('Email atau password salah');
    }
  };

  const fillDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') { setEmail('admin@cbt.com'); setPassword('admin123'); }
    else { setEmail('budi@email.com'); setPassword('user123'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🎌</div>
          <CardTitle className="text-2xl">CBT Ujian Jepang</CardTitle>
          <CardDescription>Login untuk memulai ujian JLPT, JFT, atau SSW</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@contoh.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Masuk</Button>
          </form>
          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-muted-foreground text-center mb-3">Demo Account</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => fillDemo('admin')}>
                🛠️ Admin
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => fillDemo('user')}>
                👤 User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
