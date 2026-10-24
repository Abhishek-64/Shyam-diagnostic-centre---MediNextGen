import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api.js';

function getOrCreateVisitorId() {
  let vid = localStorage.getItem('sdc_visitor_id');
  if (!vid) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('sdc_visitor_id', vid);
  }
  return vid;
}

function getOrCreateSessionId() {
  let sid = sessionStorage.getItem('sdc_session_id');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    sessionStorage.setItem('sdc_session_id', sid);
  }
  return sid;
}

export function usePageTracking() {
  const location = useLocation();
  const lastTrackedPath = useRef('');

  useEffect(() => {
    const currentPath = location.pathname;

    // Do not count internal admin routes as public patient traffic
    if (currentPath.startsWith('/admin')) {
      return;
    }

    if (lastTrackedPath.current === currentPath) {
      return;
    }
    lastTrackedPath.current = currentPath;

    try {
      const visitorId = getOrCreateVisitorId();
      const sessionId = getOrCreateSessionId();

      api
        .post('/analytics/track', {
          visitorId,
          sessionId,
          path: currentPath,
          referrer: document.referrer || '',
        })
        .catch(() => {
          // Fail silently without disrupting patient UX
        });
    } catch {
      // Ignore client tracking errors
    }
  }, [location.pathname]);
}
