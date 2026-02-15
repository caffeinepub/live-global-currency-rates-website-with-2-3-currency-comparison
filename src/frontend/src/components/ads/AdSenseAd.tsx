import { useEffect, useRef, useState } from 'react';
import { isAdSenseConfigured, isAdSenseAvailable, getAdSenseClientId } from '@/config/adsense';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Reusable AdSense ad unit component
 * Renders Google AdSense ads with proper initialization and fallback handling
 * Supports multiple ad units on the same page with idempotent push logic
 */
export function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style,
  className = '',
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [showFallback, setShowFallback] = useState(false);
  const pushAttemptedRef = useRef(false);

  useEffect(() => {
    // Reset push state when slot changes
    pushAttemptedRef.current = false;
    setShowFallback(false);
  }, [adSlot]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if AdSense is configured
    if (!isAdSenseConfigured()) {
      setShowFallback(true);
      return;
    }

    // Check if ad slot is provided
    if (!adSlot || adSlot.trim() === '') {
      setShowFallback(true);
      return;
    }

    // Prevent duplicate pushes for the same ad unit
    if (pushAttemptedRef.current) return;

    // Wait for AdSense script to load
    const checkAndPushAd = () => {
      if (pushAttemptedRef.current) return;

      const insElement = adRef.current;
      if (!insElement) return;

      // Check if this specific ad unit has already been initialized by AdSense
      // AdSense adds data-adsbygoogle-status attribute after processing
      if (insElement.getAttribute('data-adsbygoogle-status')) {
        pushAttemptedRef.current = true;
        return;
      }

      if (isAdSenseAvailable()) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          pushAttemptedRef.current = true;
        } catch (error) {
          console.warn('AdSense initialization error:', error);
          setShowFallback(true);
          pushAttemptedRef.current = true;
        }
      } else {
        // AdSense not available yet, show fallback after timeout
        setTimeout(() => {
          if (!pushAttemptedRef.current && !isAdSenseAvailable()) {
            setShowFallback(true);
            pushAttemptedRef.current = true;
          }
        }, 3000);
      }
    };

    // Try to push ad immediately or wait for script load
    if (isAdSenseAvailable()) {
      checkAndPushAd();
    } else {
      // Wait a bit for script to load
      const timer = setTimeout(checkAndPushAd, 500);
      return () => clearTimeout(timer);
    }
  }, [adSlot]);

  // Don't render if not configured or slot is missing
  if (!isAdSenseConfigured() || !adSlot || adSlot.trim() === '') {
    return (
      <div 
        className={`min-h-[100px] flex items-center justify-center bg-muted/30 rounded-lg border border-border/50 ${className}`}
        style={style}
      >
        <p className="text-xs text-muted-foreground">Ad space</p>
      </div>
    );
  }

  // Show fallback if ad blocked or failed to load
  if (showFallback) {
    return (
      <div 
        className={`min-h-[100px] flex items-center justify-center bg-muted/30 rounded-lg border border-border/50 ${className}`}
        style={style}
      >
        <p className="text-xs text-muted-foreground">Advertisement</p>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        minHeight: '100px',
        ...style,
      }}
      data-ad-client={getAdSenseClientId()}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
}
