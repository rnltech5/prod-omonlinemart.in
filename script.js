/**
 * OM ONLINE MART - CLIENT SIDE APPLICATION SCRIPT
 * Features:
 * 1. Two-Pill Bilingual Language Switcher (Gujarati <-> English) with Persistent Storage
 * 2. Sticky Top Navbar with Brand Logo & Name that reveals on scroll
 * 3. Smart Mobile Deep-Linking (Native App Redirection for WhatsApp, Instagram, Telegram, YouTube)
 * 4. Dynamic vCard (.vcf) Generation & Contact Saving
 * 5. Dynamic QR Code Generator with PNG Image Download
 * 6. Web Share API with Fallback Dialog & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  const currentUrl = window.location.href.includes('http') ? window.location.href : 'https://omonlinemart.in';
  const qrCanvas = document.getElementById('qr-code-canvas');
  const qrModal = document.getElementById('qr-modal');
  const shareModal = document.getElementById('share-modal');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  const stickyTopNav = document.getElementById('sticky-top-nav');
  const stickyBrandLogoBtn = document.getElementById('sticky-brand-logo-btn');

  // =========================================================================
  // BILINGUAL TRANSLATIONS DICTIONARY (GUJARATI & ENGLISH)
  // =========================================================================
  const translations = {
    gu: {
      verified_badge: "Verified Business Partner",
      brand_category: "Meesho Selling & Dropshipping Service",
      location: "Gujarat",
      feat_products: "2000+ Products",
      feat_dispatch: "Fast Dispatch",
      feat_profit: "High Profit",
      spotlight_badge: "Official Service",
      spotlight_title: "Meesho Selling & Dropshipping Service",
      spotlight_desc: "Meesho પર Selling શરૂ કરો - Account, Product Listing અને Order Dispatchની સંપૂર્ણ Service અમારી તરફથી.",
      spotlight_btn: "WhatsApp પર સંપર્ક કરો",
      connect_title: "ઝડપી સંપર્ક અને સોશિયલ મીડિયા",
      connect_sub: "Connect With Us • Instant Channels",
      wa_label: "WhatsApp Chat",
      wa_sub: "મેસેજ કરો (7304429236)",
      call_label: "Direct Call",
      call_sub: "+91 7304429236",
      insta_label: "Instagram",
      insta_sub: "@om_online_mart",
      tg_label: "Telegram Channel",
      tg_sub: "@onlinemartom",
      yt_label: "YouTube Channel",
      yt_sub: "@omonlinemart",
      vcard_label: "Save Contact",
      vcard_sub: "ફોનમાં નંબર સેવ કરો",
      services_title: "અમારી મુખ્ય સેવાઓ અને વિશેષતાઓ",
      services_sub: "Why Choose OM Online Mart • Complete Selling Support",
      badge_benefits: "9 Key Benefits",
      f1_title: "Meesho Seller Account બનાવવાની સુવિધા",
      f1_desc: "નવું Seller Account સરળતાથી અને ઝડપથી સેટઅપ કરી આપીશું.",
      f2_title: "2000+ Products ઉપલબ્ધ",
      f2_desc: "ટ્રેન્ડિંગ અને હાઈ-ડિમાન્ડ પ્રોડક્ટ્સનો વિશાળ સ્ટોક.",
      f3_title: "Product Listing ઉપલબ્ધ",
      f3_desc: "પ્રોફેશનલ Title, Description અને Images સાથે લિસ્ટિંગ.",
      f4_title: "દરેક Productમાં Profit Margin",
      f4_desc: "તમારા દરેક ઓર્ડર પર બેસ્ટ અને ગેરંટીડ નફો મેળવો.",
      f5_title: "Order આવ્યા પછી જ Payment",
      f5_desc: "કોઈ એડવાન્સ ઇન્વેસ્ટમેન્ટ નહીં, ઓર્ડર મળે ત્યારે જ પેમેન્ટ.",
      f6_title: "માત્ર Wholesale Product Rate + Packing Charge",
      f6_desc: "તદ્દન વ્યાજબી હોલસેલ રેટ અને પારદર્શક પેકિંગ ચાર્જ.",
      f7_title: "અમે Product Pack કરીને Dispatch કરીશું",
      f7_desc: "પેકિંગ, લેબલિંગ અને કુરિયર ડિસ્પેચની તમામ જવાબદારી અમારી.",
      f8_title: "Return Product સંભાળવાની સુવિધા",
      f8_desc: "Return Product અમારી પાસે આવશે અને Reusable હોય તો આગળના Orderમાં ઉપયોગ કરીશું.",
      f9_title: "તમામ કામગીરી Meesho Policy મુજબ",
      f9_desc: "૧૦૦% સિક્યોર અને Meesho ની તમામ ગાઇડલાઇન્સ મુજબ કામગીરી.",
      cta_badge: "🎯 Easy E-Commerce",
      cta_title: "તમારે માત્ર Selling પર ધ્યાન આપવાનું - બાકીનું કામ અમે સંભાળીશું.",
      cta_desc: "આજે જ તમારો Meesho બિઝનેસ શરૂ કરો અને ઘરે બેઠા સારો નફો કમાઓ.",
      cta_btn: "WhatsApp પર શરૂ કરો",
      contact_card_title: "સંપર્ક માહિતી (Contact Information)",
      lbl_mobile: "મોબાઇલ નંબર (Mobile / WhatsApp)",
      lbl_location: "સ્થળ (Location)",
      val_location: "Surat, Gujarat, India",
      lbl_hours: "સર્વિસ સમય (Working Hours)",
      val_hours: "સોમવાર - શનિવાર: 9:00 AM - 9:00 PM",
      qr_pill_btn: "QR Code",
      share_pill_btn: "Share",
      qr_title: "સ્કેન કરો / Scan QR Code",
      qr_desc: "તમારા મોબાઈલ કેમેરાથી સ્કેન કરીને OM Online Mart પ્રોફાઈલ સરળતાથી શેર કરો.",
      qr_copy_btn: "Copy Link",
      qr_save_btn: "Save QR",
      share_title: "Share OM Online Mart",
      toast_copy: "લિંક કોપી થઈ ગઈ! / Link copied!",
      toast_vcard: "સંપર્ક સેવ ફાઈલ ડાઉનલોડ થઈ! / Contact saved!",
      toast_qr: "QR Code ડાઉનલોડ થયો! / QR downloaded!",
      sticky_call: "Call Now",
      sticky_wa: "WhatsApp",
      sticky_share: "Share",
      lang_changed: "ભાષા બદલાઈ ગઈ: ગુજરાતી"
    },
    en: {
      verified_badge: "Verified Business Partner",
      brand_category: "Meesho Selling & Dropshipping Service",
      location: "Gujarat",
      feat_products: "2000+ Products",
      feat_dispatch: "Fast Dispatch",
      feat_profit: "High Profit",
      spotlight_badge: "Official Service",
      spotlight_title: "Meesho Selling & Dropshipping Service",
      spotlight_desc: "Start selling on Meesho — Complete service for Seller Account, Product Listing & Order Dispatch by our expert team.",
      spotlight_btn: "Contact on WhatsApp",
      connect_title: "Quick Contact & Social Media",
      connect_sub: "Connect With Us • Instant Channels",
      wa_label: "WhatsApp Chat",
      wa_sub: "Message Us (7304429236)",
      call_label: "Direct Call",
      call_sub: "+91 7304429236",
      insta_label: "Instagram",
      insta_sub: "@om_online_mart",
      tg_label: "Telegram Channel",
      tg_sub: "@onlinemartom",
      yt_label: "YouTube Channel",
      yt_sub: "@omonlinemart",
      vcard_label: "Save Contact",
      vcard_sub: "Save to Phone Contacts",
      services_title: "Our Key Services & Highlights",
      services_sub: "Why Choose OM Online Mart • Complete Selling Support",
      badge_benefits: "9 Key Benefits",
      f1_title: "Meesho Seller Account Setup",
      f1_desc: "Quick, hassle-free creation and verification of your new Meesho Seller account.",
      f2_title: "2000+ Products Ready in Stock",
      f2_desc: "Huge catalog of trending and high-demand products ready for dropshipping.",
      f3_title: "Professional Product Listing",
      f3_desc: "Optimized product listings with high-converting titles, descriptions & images.",
      f4_title: "High Profit Margin per Product",
      f4_desc: "Earn strong, guaranteed profit margins on every single customer order.",
      f5_title: "Payment Only After Order Arrival",
      f5_desc: "Zero advance inventory investment — pay only when you receive customer orders.",
      f6_title: "Wholesale Rate + Packing Charge Only",
      f6_desc: "Direct wholesale pricing with transparent, minimal packaging charges.",
      f7_title: "Complete Packing & Courier Dispatch",
      f7_desc: "We handle professional packing, barcode labeling, and timely courier dispatch.",
      f8_title: "Seamless Return Management",
      f8_desc: "Returns are received at our facility and reusable items are restocked for your next orders.",
      f9_title: "100% Compliant with Meesho Policies",
      f9_desc: "Fully secure operations adhering strictly to official Meesho guidelines.",
      cta_badge: "🎯 Easy E-Commerce",
      cta_title: "You focus on Selling — We will handle everything else.",
      cta_desc: "Start your Meesho dropshipping business today and earn high profits from home.",
      cta_btn: "Get Started on WhatsApp",
      contact_card_title: "Contact Information",
      lbl_mobile: "Mobile / WhatsApp",
      lbl_location: "Location",
      val_location: "Surat, Gujarat, India",
      lbl_hours: "Working Hours",
      val_hours: "Monday - Saturday: 9:00 AM - 9:00 PM",
      qr_pill_btn: "QR Code",
      share_pill_btn: "Share",
      qr_title: "Scan QR Code",
      qr_desc: "Scan with your phone camera to quickly open or share OM Online Mart profile.",
      qr_copy_btn: "Copy Link",
      qr_save_btn: "Save QR",
      share_title: "Share OM Online Mart",
      toast_copy: "Link copied to clipboard!",
      toast_vcard: "Contact card downloaded!",
      toast_qr: "QR Code image downloaded!",
      sticky_call: "Call Now",
      sticky_wa: "WhatsApp",
      sticky_share: "Share",
      lang_changed: "Language changed: English"
    }
  };

  let currentLang = localStorage.getItem('om_lang') || 'gu';

  function setLanguage(lang, showToastNotification = false) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('om_lang', lang);
    document.documentElement.lang = lang;

    // Update all i18n DOM elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Update active class on all language pill buttons
    document.querySelectorAll('.lang-pill').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (showToastNotification) {
      showToast(translations[lang].lang_changed);
    }
  }

  // Setup Language Pill Click Handlers
  document.querySelectorAll('.lang-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      if (selectedLang !== currentLang) {
        setLanguage(selectedLang, true);
      }
    });
  });

  // Apply initial language
  setLanguage(currentLang, false);

  // =========================================================================
  // STICKY TOP NAVBAR ON SCROLL
  // =========================================================================
  function handleScrollStickyNav() {
    if (!stickyTopNav) return;
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 150) {
      stickyTopNav.classList.add('sticky-visible');
    } else {
      stickyTopNav.classList.remove('sticky-visible');
    }
  }

  window.addEventListener('scroll', handleScrollStickyNav, { passive: true });

  if (stickyBrandLogoBtn) {
    stickyBrandLogoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // DEVICE DETECTION & SMART DEEP-LINKING (APP INTENT HANDLER)
  // =========================================================================
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
  }

  function setupAppDeepLinks() {
    const appLinks = document.querySelectorAll('.app-intent-link');

    appLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const appUrl = link.getAttribute('data-app-url');
        const webUrl = link.href;

        // If on mobile and a native app scheme is specified
        if (isMobileDevice() && appUrl) {
          e.preventDefault();
          
          const clickTime = Date.now();
          
          // Try to launch native app directly
          window.location.href = appUrl;

          // If the app is not installed, user remains on page -> fallback to web url
          setTimeout(() => {
            if (Date.now() - clickTime < 2200 && !document.hidden) {
              window.open(webUrl, '_blank');
            }
          }, 1400);
        }
      });
    });
  }

  setupAppDeepLinks();

  // =========================================================================
  // TOAST NOTIFICATION UTILITY
  // =========================================================================
  let toastTimer = null;
  function showToast(message, isSuccess = true) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = message;
    toastIcon.className = isSuccess 
      ? 'fa-solid fa-circle-check toast-icon' 
      : 'fa-solid fa-circle-info toast-icon';
    toastIcon.style.color = isSuccess ? '#22c55e' : '#38bdf8';
    toast.classList.add('show');
    
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // =========================================================================
  // CLIPBOARD COPY UTILITY
  // =========================================================================
  function copyToClipboard(text, successMsg) {
    const msg = successMsg || (translations[currentLang] ? translations[currentLang].toast_copy : 'Link copied!');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(msg);
      }).catch(() => {
        fallbackCopy(text, msg);
      });
    } else {
      fallbackCopy(text, msg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      showToast('Copying failed. Please copy manually.', false);
    }
    document.body.removeChild(textArea);
  }

  // =========================================================================
  // DYNAMIC VCARD (.VCF) GENERATION & DOWNLOAD
  // =========================================================================
  function downloadVCard() {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:OM Online Mart',
      'N:Online Mart;OM;;;',
      'ORG:OM Online Mart (Meesho Dropshipping Service)',
      'TITLE:Meesho Selling & Dropshipping Partner',
      'TEL;TYPE=CELL,VOICE,pref:+917304429236',
      'URL:https://omonlinemart.in',
      'ADR;TYPE=WORK:;;Surat;Gujarat;;India',
      'X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/om_online_mart/',
      'X-SOCIALPROFILE;TYPE=telegram:https://t.me/onlinemartom',
      'X-SOCIALPROFILE;TYPE=youtube:https://www.youtube.com/@omonlinemart',
      'NOTE:Meesho Seller Account, Product Listing and Order Dispatch Service. Call/WhatsApp: 7304429236.',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'OM_Online_Mart.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    const msg = translations[currentLang] ? translations[currentLang].toast_vcard : 'Contact saved!';
    showToast(msg);
  }

  const btnSaveContact = document.getElementById('btn-save-contact');
  if (btnSaveContact) {
    btnSaveContact.addEventListener('click', downloadVCard);
  }

  // =========================================================================
  // QR CODE GENERATION & MANAGEMENT
  // =========================================================================
  let qrInstance = null;
  function initQRCode() {
    if (typeof QRious !== 'undefined' && qrCanvas) {
      qrInstance = new QRious({
        element: qrCanvas,
        value: currentUrl,
        size: 220,
        level: 'H',
        foreground: '#0056d2',
        background: '#ffffff'
      });
    }
  }

  function downloadQRCode() {
    if (!qrCanvas) return;
    const imageUri = qrCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageUri;
    link.download = 'OM_Online_Mart_QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    const msg = translations[currentLang] ? translations[currentLang].toast_qr : 'QR downloaded!';
    showToast(msg);
  }

  // Modal Controls
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const btnQrModal = document.getElementById('btn-qr-modal');
  const btnCloseQr = document.getElementById('btn-close-qr');
  const btnCopyUrl = document.getElementById('btn-copy-url');
  const btnDownloadQr = document.getElementById('btn-download-qr');

  if (btnQrModal) {
    btnQrModal.addEventListener('click', () => {
      initQRCode();
      openModal(qrModal);
    });
  }

  if (btnCloseQr) {
    btnCloseQr.addEventListener('click', () => closeModal(qrModal));
  }

  if (btnCopyUrl) {
    btnCopyUrl.addEventListener('click', () => {
      copyToClipboard(currentUrl);
      closeModal(qrModal);
    });
  }

  if (btnDownloadQr) {
    btnDownloadQr.addEventListener('click', downloadQRCode);
  }

  // =========================================================================
  // WEB SHARE API & SHARE MODAL
  // =========================================================================
  function handleShare() {
    const shareData = {
      title: 'OM Online Mart - Meesho Selling & Dropshipping Service',
      text: translations[currentLang].spotlight_desc,
      url: currentUrl
    };

    if (isMobileDevice() && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(() => {});
    } else {
      openModal(shareModal);
    }
  }

  const btnShareTop = document.getElementById('btn-share-top');
  const btnStickyShare = document.getElementById('sticky-share-btn');
  const btnCloseShare = document.getElementById('btn-close-share');
  const btnShareCopy = document.getElementById('btn-share-copy');

  if (btnShareTop) btnShareTop.addEventListener('click', handleShare);
  if (btnStickyShare) btnStickyShare.addEventListener('click', handleShare);
  if (btnCloseShare) btnCloseShare.addEventListener('click', () => closeModal(shareModal));

  if (btnShareCopy) {
    btnShareCopy.addEventListener('click', () => {
      copyToClipboard(currentUrl);
      closeModal(shareModal);
    });
  }

  // Close modals on backdrop click
  [qrModal, shareModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(qrModal);
      closeModal(shareModal);
    }
  });

  // Initialize QR on startup
  initQRCode();
});
