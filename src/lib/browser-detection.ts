export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  
  // Check for common in-app browsers
  const inAppBrowsers = [
    'fban',          // Facebook
    'fbav',          // Facebook
    'instagram',     // Instagram
    'linkedin',      // LinkedIn
    'twitter',       // Twitter
    'twitterbot',    // Twitter bot
    'whatsapp',      // WhatsApp
    'snapchat',      // Snapchat
    'telegram',      // Telegram
    'pinterest',     // Pinterest
    'reddit',        // Reddit
    'wechat',        // WeChat
    'line',          // Line
    'kakaotalk',     // KakaoTalk
  ];
  
  return inAppBrowsers.some(browser => ua.includes(browser));
}

export function getDefaultBrowserUrl(currentUrl: string): string {
  const baseUrl = currentUrl.split('?')[0]; // Remove query params if any
  
  // For mobile devices, suggest opening in default browser
  if (/android/i.test(navigator.userAgent)) {
    return `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end;`;
  }
  
  if (/iphone|ipad/i.test(navigator.userAgent)) {
    // For iOS, we can't force open in Safari, but we can provide instructions
    return currentUrl;
  }
  
  return currentUrl;
}

export function showBrowserWarning(): boolean {
  return isInAppBrowser();
}