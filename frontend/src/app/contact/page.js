import Contact from '@/components/Contact.js';

export const metadata = {
  title: 'Contactez-Nous - La volaille en Bray',
  description:
    'Contactez La volaille en Bray pour toute question ou demande via notre formulaire de contact.',
  alternates: {
    canonical: `${process.env.FRONTEND_BASE_URL}/contact`,
  },
};

export default function ContactPage() {
  return <Contact />;
}
