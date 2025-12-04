declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackPageView = (url: string, title?: string) => {
  gtag('config', 'G-KKNDWKNBJQ', {
    page_location: url,
    page_title: title,
  });
};

export const trackUserSignup = (method: string) => {
  gtag('event', 'sign_up', {
    method: method,
  });
};

export const trackUserLogin = (method: string) => {
  gtag('event', 'login', {
    method: method,
  });
};

export const trackSubscription = (planType: string, value: number) => {
  gtag('event', 'purchase', {
    transaction_id: `subscription_${Date.now()}`,
    value: value,
    currency: 'USD',
    items: [
      {
        item_id: planType,
        item_name: `${planType} subscription`,
        item_category: 'subscription',
        quantity: 1,
        price: value,
      },
    ],
  });
};

export const trackAlertCreated = (vehicleType?: string) => {
  gtag('event', 'alert_created', {
    event_category: 'engagement',
    event_label: vehicleType,
  });
};

export const trackChatStarted = () => {
  gtag('event', 'chat_started', {
    event_category: 'support',
  });
};

export const trackChatEnded = () => {
  gtag('event', 'chat_ended', {
    event_category: 'support',
  });
};

export const trackVehicleViewed = (vehicleId: string, vehicleType?: string) => {
  gtag('event', 'view_item', {
    item_id: vehicleId,
    item_name: vehicleType,
    item_category: 'vehicle',
  });
};