import { HomePage } from './pages/HomePage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <HomePage />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
