import React from 'react';
import styles from './WhatsAppButton.module.css';

function WhatsAppIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.52 3.48A11.93 11.93 0 0 0 12.07 0C5.44 0 .04 5.4.04 12.04c0 2.12.55 4.19 1.6 6.01L0 24l6.13-1.61a11.97 11.97 0 0 0 5.94 1.57h.01c6.63 0 12.03-5.4 12.03-12.04 0-3.22-1.25-6.24-3.59-8.44zm-8.45 18.52h-.01a9.97 9.97 0 0 1-5.08-1.39l-.36-.22-3.77.99 1.01-3.68-.24-.38a9.98 9.98 0 0 1-1.53-5.28c0-5.52 4.49-10.01 10.02-10.01 2.67 0 5.18 1.04 7.07 2.93a9.93 9.93 0 0 1 2.94 7.07c0 5.52-4.5 10.01-10.03 10.01zm5.49-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.89-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.24-.24-.59-.49-.51-.68-.52-.17-.01-.38-.01-.58-.01-.2 0-.52.08-.8.38-.27.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.08-.13-.28-.2-.58-.35z"
      />
    </svg>
  );
}

export default function WhatsAppButton({
  phone = '8320740996',
  message = 'Hello Shyam Diagnostic & MediNextGen, I would like to enquire about diagnostic services.',
  label = 'Chat on WhatsApp',
  variant = 'solid', // 'solid' | 'outline' | 'pill' | 'iconOnly'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const cleanPhone = String(phone).replace(/\D/g, '');
  const internationalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(message.trim());
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodedText}`;

  const iconSizes = { sm: 18, md: 22, lg: 26 };
  const iconPixel = iconSizes[size] || 22;

  if (variant === 'iconOnly') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.iconBtn} ${styles[size]} ${className}`}
        title="Chat with us on WhatsApp"
        aria-label="Chat with us on WhatsApp"
      >
        <WhatsAppIcon size={iconPixel} />
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
    >
      <WhatsAppIcon size={iconPixel} className={styles.icon} />
      <span>{label}</span>
    </a>
  );
}
