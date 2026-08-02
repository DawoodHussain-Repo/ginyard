import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesGrid from './components/FeaturesGrid';
import AiSpotlight from './components/AiSpotlight';
import PricingSection from './components/PricingSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import './Landing.css';

import { settingsAction } from '@/redux/settings/actions';
import { selectAppSettings } from '@/redux/settings/selectors';

export default function LandingPage() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(selectAuth);
  const appSettings = useSelector(selectAppSettings);

  const isDarkMode = (appSettings?.app_theme || document.documentElement.getAttribute('data-theme')) === 'dark';

  const toggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('app_theme', nextTheme);
    if (isLoggedIn) {
      dispatch(
        settingsAction.updateMany({
          entity: 'setting',
          jsonData: {
            settings: [{ settingKey: 'app_theme', settingValue: nextTheme }],
          },
          options: { notifyOnSuccess: false, notifyOnFailed: false },
        })
      );
    }
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
