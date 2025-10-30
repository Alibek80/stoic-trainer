import mixpanel from 'mixpanel-browser';

let initialized = false;

export function initAnalytics(): void {
  if (initialized) return;
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  if (!token) return;
  const apiHost = process.env.NEXT_PUBLIC_MIXPANEL_API_HOST;
  mixpanel.init(token, {
    debug: false,
    track_pageview: true,
    persistence: 'localStorage',
    api_host: apiHost,
  } as any);
  initialized = true;
  try {
    mixpanel.track('app_start');
  } catch {}
}

export function identifyUser(userId: string): void {
  if (!initialized) return;
  mixpanel.identify(userId);
}

export function setUserProps(props: Record<string, unknown>): void {
  if (!initialized) return;
  mixpanel.people.set(props as any);
}

export function trackEvent(eventName: string, props?: Record<string, unknown>): void {
  if (!initialized) return;
  mixpanel.track(eventName, props);
}


