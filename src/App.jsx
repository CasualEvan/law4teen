import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import CaseOfTheWeek from './pages/CaseOfTheWeek';
import LegalTerms from './pages/LegalTerms';
import Headlines from './pages/Headlines';
import LSATPractice from './pages/LSATPractice';
import Amendments from './pages/Amendments';
import About from './pages/About';
import Admin from './pages/Admin';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/case-of-the-week" element={<CaseOfTheWeek />} />
            <Route path="/legal-terms" element={<LegalTerms />} />
            <Route path="/headlines" element={<Headlines />} />
            <Route path="/lsat-practice" element={<LSATPractice />} />
            <Route path="/amendments" element={<Amendments />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
