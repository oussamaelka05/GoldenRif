import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedCars from '../components/FeaturedCars';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="font-sans overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeaturedCars />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
