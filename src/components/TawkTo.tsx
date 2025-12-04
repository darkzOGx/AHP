'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkTo = () => {
  useEffect(() => {
    // Only load Tawk.to in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_TAWK !== 'true') {
      console.log('Tawk.to disabled in development. Set NEXT_PUBLIC_ENABLE_TAWK=true to enable.');
      return;
    }

    // Don't load Tawk.to on search/dashboard pages on mobile only
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      const isDashboardPage = window.location.pathname === '/dashboard' || 
                             window.location.pathname.startsWith('/dashboard/');
      
      if (isMobile && isDashboardPage) {
        console.log('Tawk.to disabled on dashboard pages for mobile devices');
        return;
      }
    }

    // Check if Tawk.to is already loaded
    if (window.Tawk_API) {
      return;
    }

    // Set up Tawk.to variables
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // You'll need to replace this with your actual Tawk.to Property ID
    // Get it from your Tawk.to dashboard: Administration > Property Settings
    const tawkPropertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || '675c40e04304b50e4e5cfc83';
    const tawkWidgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || '1iehi5h2m';

    // Create and append the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Add script to document
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Optional: Configure Tawk.to settings
    window.Tawk_API.onLoad = function() {
      console.log('Tawk.to loaded successfully');
      
      // Check if user has hidden the chat widget
      const chatHidden = localStorage.getItem('tawk-chat-hidden');
      if (chatHidden === 'true') {
        window.Tawk_API.hideWidget();
        return;
      }
      
      // Mobile optimizations
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Make the widget smaller on mobile
        window.Tawk_API.setAttributes({
          name: '',
          email: '',
          hash: ''
        }, function(error) {
          // Callback
        });
        
        // Add custom CSS for mobile
        const style = document.createElement('style');
        style.textContent = `
          /* Make Tawk.to widget smaller on mobile */
          @media (max-width: 768px) {
            #tawk-bubble-container {
              bottom: 20px !important;
              right: 15px !important;
              transform: scale(0.8) !important;
              transform-origin: bottom right !important;
            }
            
            /* Make chat window take less space */
            .tawk-chatbar {
              width: calc(100vw - 20px) !important;
              height: calc(100vh - 100px) !important;
              right: 10px !important;
              bottom: 10px !important;
            }
            
            /* Add option to minimize */
            .tawk-min-container {
              display: block !important;
            }
          }
          
          /* Add a small close button for user control */
          .tawk-custom-hide {
            position: fixed;
            bottom: 90px;
            right: 15px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            cursor: pointer;
            z-index: 999999;
            display: none;
          }
          
          @media (max-width: 768px) {
            .tawk-custom-hide {
              display: block;
            }
          }
        `;
        document.head.appendChild(style);
        
        // Add custom hide button
        setTimeout(() => {
          const hideBtn = document.createElement('button');
          hideBtn.innerHTML = '×';
          hideBtn.className = 'tawk-custom-hide';
          hideBtn.title = 'Hide chat';
          hideBtn.onclick = function() {
            window.Tawk_API.hideWidget();
            localStorage.setItem('tawk-chat-hidden', 'true');
            hideBtn.style.display = 'none';
            
            // Show a small "show chat" button
            const showBtn = document.createElement('button');
            showBtn.innerHTML = '💬';
            showBtn.className = 'tawk-custom-show';
            showBtn.style.cssText = `
              position: fixed;
              bottom: 20px;
              right: 15px;
              background: #2196F3;
              color: white;
              border: none;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              font-size: 16px;
              cursor: pointer;
              z-index: 999999;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            showBtn.title = 'Show chat';
            showBtn.onclick = function() {
              window.Tawk_API.showWidget();
              localStorage.setItem('tawk-chat-hidden', 'false');
              showBtn.remove();
              hideBtn.style.display = 'block';
            };
            document.body.appendChild(showBtn);
          };
          document.body.appendChild(hideBtn);
        }, 2000);
      }
    };

    // Optional: Handle chat events
    window.Tawk_API.onChatStarted = function() {
      console.log('Chat started');
      // Track analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'chat_started', { event_category: 'support' });
      }
    };

    window.Tawk_API.onChatEnded = function() {
      console.log('Chat ended');
      // Track analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'chat_ended', { event_category: 'support' });
      }
    };

    // Cleanup function
    return () => {
      // Remove Tawk.to script if component unmounts
      const tawkScript = document.querySelector(`script[src*="embed.tawk.to"]`);
      if (tawkScript) {
        tawkScript.remove();
      }
      
      // Clean up global variables
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
      if (window.Tawk_LoadStart) {
        delete window.Tawk_LoadStart;
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default TawkTo;