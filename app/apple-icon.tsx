import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#0A2540',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.5 L19.5 5.5 V11.5 C19.5 16.2 16.4 19.9 12 21.5 C7.6 19.9 4.5 16.2 4.5 11.5 V5.5 Z"
            fill="white"
            fillOpacity="0.22"
            stroke="white"
            strokeWidth="1.4"
          />
          <path
            d="M6.5 12.5 H9.2 L10.4 9.8 L12.4 15.4 L13.7 12.5 H17.5"
            stroke="white"
            strokeWidth="1.6"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
