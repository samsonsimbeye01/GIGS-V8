import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
  gigData?: {
    title: string;
    description: string;
    location: string;
    salary: string;
    category: string;
  };
}

const SEOMetadata: React.FC<SEOMetadataProps> = ({
  title = 'Linka - Africa\'s Real-Time Gig Platform',
  description = 'Find and post gigs across Africa. Real-time matching, secure payments, and AI-powered recommendations.',
  keywords = 'gigs, jobs, Africa, freelance, work, employment, real-time',
  url = 'https://linka.africa',
  image = '/og-image.jpg',
  type = 'website',
  gigData
}) => {
  const structuredData = gigData ? {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': gigData.title,
    'description': gigData.description,
    'hiringOrganization': {
      '@type': 'Organization',
      'name': 'Linka Platform'
    },
    'jobLocation': {
      '@type': 'Place',
      'address': gigData.location
    },
    'baseSalary': {
      '@type': 'MonetaryAmount',
      'currency': 'USD',
      'value': gigData.salary
    },
    'employmentType': 'CONTRACT',
    'industry': gigData.category,
    'datePosted': new Date().toISOString()
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Linka',
    'description': description,
    'url': url
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Linka" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://api.linka.africa" />
    </Helmet>
  );
};

export default SEOMetadata;