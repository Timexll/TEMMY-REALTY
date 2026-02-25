
"use client";

import { MessageCircle, Mail, Phone, Clock, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I schedule a property inspection?",
      answer: "You can schedule an inspection by clicking the 'Call Agent' or 'WhatsApp Us' button on any property detail page. Our team will coordinate a time that works best for you, usually within 24 hours."
    },
    {
      question: "What documents do I need for a rental application?",
      answer: "Typically, you'll need a valid ID, proof of income (recent pay stubs or bank statements), and sometimes a background check authorization. Our agents will provide a specific checklist based on the property requirements."
    },
    {
      question: "Do you offer financing assistance for buyers?",
      answer: "Yes! We work with several trusted American financial institutions and can guide you through the pre-approval process and mortgage options suitable for your investment goals."
    },
    {
      question: "Is there 24/7 support for rental tenants?",
      answer: "Absolutely. All our managed rental properties come with access to our 24/7 emergency maintenance and support line to ensure your peace of mind."
    },
    {
      question: "How long does the closing process take for a purchase?",
      answer: "In the US market, a typical residential closing takes between 30 to 45 days, depending on financing and inspection results. We manage the timeline to ensure a smooth transition."
    }
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-primary pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-bold text-xs tracking-widest uppercase mb-6">
            <HelpCircle className="w-4 h-4" />
            Temmy Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">How Can We Help You?</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Our dedicated support team is available 24/7 to assist with your real estate journey in America.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary">WhatsApp Support</h3>
              <p className="text-muted-foreground text-sm">Real-time assistance for quick inquiries and scheduling.</p>
              <Button className="w-full font-bold bg-green-500 hover:bg-green-600" onClick={() => window.open('https://wa.me/12532999533')}>
                Chat Now
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary">Email Inquiry</h3>
              <p className="text-muted-foreground text-sm">Send us your detailed requirements or document files.</p>
              <Button className="w-full font-bold" onClick={() => window.open('mailto:Jordankatie767@gmail.com')}>
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 text-secondary-foreground rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary">Direct Call</h3>
              <p className="text-muted-foreground text-sm">Speak directly with a certified real estate professional.</p>
              <Button variant="secondary" className="w-full font-bold" onClick={() => window.open('tel:+12532999533')}>
                Call Now
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* FAQ Section */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold text-primary">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Find quick answers to common real estate inquiries.</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-0 mb-4 bg-white rounded-2xl px-6 shadow-sm border">
                  <AccordionTrigger className="hover:no-underline font-bold text-left text-primary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Support Features */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border space-y-8">
            <h3 className="text-2xl font-headline font-bold text-primary">Why Our Support is Different</h3>
            <div className="space-y-6">
              {[
                { icon: Clock, title: '24/7 Availability', desc: 'We operate across time zones to serve international clients.' },
                { icon: ShieldCheck, title: 'Verified Agents', desc: 'All interactions are with licensed US real estate experts.' },
                { icon: MessageCircle, title: 'Multilingual Support', desc: 'Communication simplified for global investors and renters.' }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="bg-primary/5 p-4 rounded-2xl h-fit">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-primary">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground italic text-center">
                "Our mission is to make the American real estate market accessible and stress-free for everyone."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
