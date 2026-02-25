
import { Mail, Phone, MessageCircle, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-headline font-bold text-2xl text-primary">TEMMY REALTY</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Specializing in premium American real estate. Whether you're buying a dream villa or renting a luxury condo, we provide excellence every step of the way.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              <Instagram className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
              <Twitter className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/buy" className="hover:text-primary">Buy a Home</Link></li>
              <li><Link href="/rent" className="hover:text-primary">Rent Property</Link></li>
              <li><Link href="/#about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/admin/login" className="hover:text-primary">Admin Access</Link></li>
            </ul>
          </div>

          {/* Process */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider">Our Process</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Property Selection</li>
              <li>Inspection Scheduling</li>
              <li>Financing & Documentation</li>
              <li>Move In Ready</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4" id="contact">
            <h4 className="font-bold text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" />
                <a href="mailto:Jordankatie767@gmail.com" className="hover:text-primary">Jordankatie767@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+1 253-299-9533</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-secondary" />
                <span>WhatsApp: +1 253-299-9533</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <span>USA Based Realty Service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-xs text-muted-foreground">
          <p>© 2026 Temmy American Realty. All rights reserved. Buy and Rent Homes Across the United States.</p>
        </div>
      </div>
    </footer>
  );
};
