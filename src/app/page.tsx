'use client';

import { Container } from '@/ui/Container';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import { ArrowRight, Zap, Shield, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <div>
                <Badge className="mb-4">✨ Built for Scale</Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 leading-tight">
                  Modern Platform for{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Tomorrow
                  </span>
                </h1>
              </div>
              <p className="text-lg text-neutral-600 leading-relaxed max-w-lg">
                Experience a production-grade platform built with cutting-edge technologies. Designed
                for startups that demand excellence and scalability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="primary" className="gap-2">
                  Get Started <ArrowRight size={20} />
                </Button>
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 mx-auto mb-4 flex items-center justify-center">
                    <Zap className="text-white" size={32} />
                  </div>
                  <p className="text-neutral-700 font-medium">Next-Gen Architecture</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-neutral-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Production-Grade Features
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-primary-600" size={32} />,
                title: 'Lightning Fast',
                description: 'Built on Next.js 15 with Turbopack for blazing-fast development and production performance.',
              },
              {
                icon: <Shield className="text-secondary-600" size={32} />,
                title: 'Type Safe',
                description: 'Full TypeScript support with strict typing ensuring reliability and maintainability.',
              },
              {
                icon: <Layers className="text-primary-600" size={32} />,
                title: 'Scalable Architecture',
                description: 'Clean folder structure designed for enterprise-level applications and growing teams.',
              },
            ].map((feature, index) => (
              <Card key={index} hoverable className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-neutral-50 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Build?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Start building your next great product with our production-ready foundation.
            </p>
            <Button size="lg" variant="primary" className="bg-white text-primary-600 hover:bg-neutral-100">
              Get Started Free <ArrowRight size={20} />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
