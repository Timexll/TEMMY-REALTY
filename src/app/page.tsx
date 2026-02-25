
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Award, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROPERTIES } from '@/app/lib/mock-data';
import { PropertyCard } from '@/components/PropertyCard';

export default function Home() {
  const featuredProperties = PROPERTIES.filter(p => p.featured).slice(0, 3);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/realty-hero/1920/1080"
            alt="Luxury American Home"
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint="luxury house"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm border border-secondary/30 px-4 py-1.5 rounded-full text-secondary font-bold text-sm tracking-widest uppercase">
              <Award className="w-4 h-4" />
              American Standard Realty
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight">
              Find Your Dream Home in <span className="text-secondary">America</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed font-light">
              Temmy American Realty provides safe, affordable, and luxury housing options for families, individuals, and investors across the United States.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/buy">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold gap-2 bg-primary">
                  Explore Buy
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/rent">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg font-bold gap-2">
                  Explore Rent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8 sticky top-24">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">Your Journey Home</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We specialize in helping clients navigate the American real estate market. Our goal is to provide transparency, professionalism, and excellent customer service to everyone looking for a place to call home.
              </p>
            </div>
            
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://picsum.photos/seed/about-realty/800/1000"
                alt="About Temmy Realty"
                fill
                className="object-cover"
                data-ai-hint="modern family"
              />
              <div className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-primary font-bold text-4xl mb-1">10+</div>
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Years Experience</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {[
              { title: 'Customer Support', icon: Users, desc: '24/7 dedicated assistance for all your real estate needs.', href: '/support' },
              { title: 'Easy Search', icon: Search, desc: 'Unified property search engine for all American listings.', href: '/search' },
            ].map((item, idx) => (
              <Link href={item.href} key={idx} className="group">
                <div className="flex gap-6 items-center p-8 rounded-3xl bg-white shadow-xl shadow-primary/5 border border-transparent transition-all">
                  <div className="bg-primary/5 p-4 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-headline font-bold text-xl text-primary">{item.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary/20 ml-auto group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-headline font-bold text-primary">Featured Listings</h2>
              <p className="text-muted-foreground">Handpicked properties that offer exceptional value and luxury.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/buy">
                <Button variant="outline" className="font-bold rounded-xl">View All For Sale</Button>
              </Link>
              <Link href="/rent">
                <Button variant="outline" className="font-bold rounded-xl">View All For Rent</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-headline font-bold text-primary">Simple Steps to Your New Home</h2>
          <p className="text-muted-foreground">We've streamlined the process to make buying or renting as easy as possible.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Buying Process */}
          <div className="bg-primary/5 p-10 rounded-[2.5rem] space-y-8 border border-primary/5">
            <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm">01</div>
              Buying Process
            </h3>
            <div className="space-y-6">
              {[
                'Choose your desired property',
                'Schedule a professional inspection',
                'Secure your financing options',
                'Complete legal documentation',
                'Move into your dream home'
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-center font-medium">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <Link href="/buy" className="block">
              <Button className="w-full h-14 font-bold text-lg rounded-2xl">Browse Houses For Sale</Button>
            </Link>
          </div>

          {/* Renting Process */}
          <div className="bg-secondary/5 p-10 rounded-[2.5rem] space-y-8 border border-secondary/5">
            <h3 className="text-2xl font-headline font-bold text-secondary flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center text-sm">02</div>
              Rental Process
            </h3>
            <div className="space-y-6">
              {[
                'Select your perfect rental unit',
                'Submit your rental application',
                'Verification of documents & background',
                'Sign your flexible lease agreement',
                'Immediate move-in assistance'
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-center font-medium">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <Link href="/rent" className="block">
              <Button variant="secondary" className="w-full h-14 font-bold text-lg rounded-2xl">Browse Rental Options</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
