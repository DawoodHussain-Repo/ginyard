import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesGrid from './components/FeaturesGrid';
import AiSpotlight from './components/AiSpotlight';
import PricingSection from './components/PricingSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import './Landing.css';

export default function LandingPage() {
  const { isLoggedIn } = useSelector(selectAuth);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.title = 'Ledgerly OS — Autonomous AI Financial Intelligence & ERP';
  }, []);

  return (
    <div className="landing-container">
      <Navbar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} isLoggedIn={isLoggedIn} />
      <main>
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesGrid />
        <AiSpotlight />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
