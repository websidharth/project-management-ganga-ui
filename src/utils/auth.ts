// import { refreshTokenResponseDto } from '@/dtos/LoginDto';
// import { useRefreshToken } from '@/hooks/service-hooks/useAccountService';
// import { useEffect, useState } from 'react';

// export async function refreshAccessToken() {
//   const at = localStorage.getItem('at');
//   if (!at) throw new Error('No access token');

//   const [data, setData] = useState<refreshTokenResponseDto>();

//   const getAllnewsletterResponse = useRefreshToken(at || '');
//   console.log('at', at);
//   useEffect(() => {
//     if (getAllnewsletterResponse.status === 'success' && getAllnewsletterResponse.data?.data?.data) {
//       setData(getAllnewsletterResponse.data?.data?.data);
//     }
//   }, [getAllnewsletterResponse.status, getAllnewsletterResponse.data]);

//   console.log('Newsletter data:', data?.refreshToken);
//   console.log('[auth] Calling /auth/refresh-token');

//   const newAccessToken = data?.refreshToken as string;

//   // keep both keys in sync: existing code reads 'at', some may read 'accessToken'
//   localStorage.setItem('at', newAccessToken);
//   localStorage.setItem('accessToken', newAccessToken);

//   console.log('[auth] Access token refreshed successfully at', new Date().toISOString());
//   console.log('[auth] Got new access token, scheduling next refresh');

//   // schedule next refresh using the new token
//   scheduleAccessTokenRefresh(newAccessToken);

//   return newAccessToken;
// }

// export function scheduleAccessTokenRefresh(accessToken: string) {
//   try {
//     const [, payload] = accessToken.split('.');
//     if (!payload) {
//       console.warn('[auth] Cannot schedule refresh, invalid token payload');
//       return;
//     }

//     // decode JWT payload
//     const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };

//     if (!decoded.exp) {
//       console.warn('[auth] Token has no exp, not scheduling refresh');
//       return;
//     }

//     const expMs = decoded.exp * 1000;
//     // refresh 1 minute before expiry
//     //const refreshIn = expMs - Date.now() - 60_000;
//     const refreshIn = 5_000;

//     console.log('[auth] Token exp (ms):', expMs, 'refresh in (ms):', refreshIn);

//     if (refreshIn <= 0) {
//       console.log('[auth] Token already near/after expiry, refreshing now');
//       void refreshAccessToken();
//       return;
//     }

//     setTimeout(() => {
//       console.log('[auth] Timer fired, refreshing access token');
//       void refreshAccessToken();
//     }, refreshIn);
//   } catch (err) {
//     console.error('[auth] Failed to schedule token refresh', err);
//   }
// }
