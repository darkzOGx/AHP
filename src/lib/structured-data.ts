// Structured data generators for SEO

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AutohunterPro",
    "url": "https://www.autohunterpro.com",
    "logo": "https://www.autohunterpro.com/logo.png",
    "description": "AI-powered vehicle deal discovery platform. Create alerts for your favorite vehicles and never miss a great deal.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://www.autohunterpro.com/support"
    },
    "sameAs": [
      // Add your social media URLs here
      // "https://twitter.com/autohunterpro",
      // "https://facebook.com/autohunterpro"
    ]
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AutohunterPro",
    "url": "https://www.autohunterpro.com",
    "description": "AI-powered vehicle deal discovery platform",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.autohunterpro.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

export function generateVehicleSchema(vehicle: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicle.product_title,
    "description": vehicle.product_description || "Vehicle listing on AutohunterPro",
    "image": vehicle.images?.[0] || "https://www.autohunterpro.com/og.jpeg",
    "url": `https://www.autohunterpro.com/vehicle/${vehicle.objectID}`,
    "offers": vehicle.product_price ? {
      "@type": "Offer",
      "price": vehicle.product_price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "AutohunterPro"
      }
    } : undefined,
    "brand": vehicle.vehicle_info?.make ? {
      "@type": "Brand",
      "name": vehicle.vehicle_info.make
    } : undefined,
    "model": vehicle.vehicle_info?.model,
    "vehicleModelDate": vehicle.vehicle_info?.year,
    "mileageFromOdometer": vehicle.vehicle_info?.mileage ? {
      "@type": "QuantitativeValue",
      "value": vehicle.vehicle_info.mileage,
      "unitCode": "SMI"
    } : undefined
  };
}

export function generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}