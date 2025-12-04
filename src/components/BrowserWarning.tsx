'use client';

import { useEffect, useState } from 'react';
import { isInAppBrowser, getDefaultBrowserUrl } from '@/lib/browser-detection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrowserWarningProps {
  onDismiss?: () => void;
  showForGoogleAuth?: boolean;
}

export function BrowserWarning({ onDismiss, showForGoogleAuth = false }: BrowserWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isAndroid, setIsAndroid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shouldShow = isInAppBrowser();
      setIsVisible(shouldShow);
      setCurrentUrl(window.location.href);
      setIsAndroid(/android/i.test(navigator.userAgent));
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setSuccessMessage('Link copied! You can now paste this link in your default browser.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      setSuccessMessage('Copy failed. Please manually copy the URL from your address bar.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  const openInBrowser = () => {
    const browserUrl = getDefaultBrowserUrl(currentUrl);
    
    // Try to open in default browser
    if (isAndroid) {
      window.location.href = browserUrl;
    } else {
      // For iOS and other platforms, we can't force open in default browser
      // Show instructions instead
      setSuccessMessage('💡 Look for "Open in Safari" or "Open in Browser" option in your current app, or copy the link below.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 6000);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <CardTitle className="text-xl">Browser Compatibility Notice</CardTitle>
              <CardDescription>
                {showForGoogleAuth 
                  ? "Google Sign-In requires a secure browser"
                  : "For the best experience, please use your default browser"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in-0 duration-300">
              <p className="text-sm text-green-800 font-medium">
                {successMessage}
              </p>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              {showForGoogleAuth ? (
                <>
                  Google requires a secure browser for sign-in. In-app browsers like LinkedIn, 
                  Facebook, or Twitter are not supported for security reasons.
                </>
              ) : (
                <>
                  You're currently viewing this in an in-app browser. For the best experience 
                  and full functionality, please open this page in your default browser.
                </>
              )}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">How to fix this:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="font-medium text-brand-red-600 mt-0.5">1.</span>
                <span>Look for "Open in Browser" or "Open in Safari/Chrome" option in your current app</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-brand-red-600 mt-0.5">2.</span>
                <span>Or copy the link below and paste it in your browser</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={openInBrowser}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {isAndroid ? 'Open in Default Browser' : 'Show Instructions'}
            </Button>
            
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>

            <Button 
              onClick={handleDismiss}
              variant="ghost"
              className="w-full text-gray-600"
            >
              Continue Anyway
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 break-all">
              {currentUrl}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}