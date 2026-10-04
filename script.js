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
  // =========================================================================
  // 🔗 APP CONFIGURATION & LINKS (EDIT YOUR LINKS HERE)
  // =========================================================================
  const APP_CONFIG = {
    // 📄 Paste your Google Drive PDF Catalog link here:
    // Example: "https://drive.google.com/file/d/1A2B3C4D5E6F/view?usp=sharing"
    CATALOG_DRIVE_URL: "https://drive.google.com/drive/folders/1MZryYIel2VUDi2lZCdPLwBD6AIZlhYpZ?usp=sharing",

    // 📦 Packing Material Google Drive folder link:
    PACKING_MATERIAL_DRIVE_URL: "https://drive.google.com/drive/folders/1997XRjgFyCZaapD6cocLtpmgY2aOVUvQ",

    // 🌐 Website base URL
    WEBSITE_URL: "https://omonlinemart.in",

    // 📞 Primary Contact Number
    CONTACT_PHONE: "+917304429236"
  };

  const currentUrl = window.location.href.includes('http') ? window.location.href : APP_CONFIG.WEBSITE_URL;
  const qrCanvas = document.getElementById('qr-code-canvas');
  const qrModal = document.getElementById('qr-modal');
  const shareModal = document.getElementById('share-modal');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  const stickyTopNav = document.getElementById('sticky-top-nav');
  const stickyBrandLogoBtn = document.getElementById('sticky-brand-logo-btn');
  const headerCatalogBtn = document.getElementById('header-catalog-btn');
  const headerPackingBtn = document.getElementById('header-packing-btn');

  // Dynamically set Catalog & Packing Material Google Drive URLs from APP_CONFIG
  if (headerCatalogBtn && APP_CONFIG.CATALOG_DRIVE_URL) {
    headerCatalogBtn.href = APP_CONFIG.CATALOG_DRIVE_URL;
  }
  if (headerPackingBtn && APP_CONFIG.PACKING_MATERIAL_DRIVE_URL) {
    headerPackingBtn.href = APP_CONFIG.PACKING_MATERIAL_DRIVE_URL;
  }

  // =========================================================================
  // BILINGUAL TRANSLATIONS DICTIONARY (GUJARATI & ENGLISH)
  // =========================================================================
  const translations = {
    gu: {
      brand_category: "Meesho Selling & Dropshipping Service",
      catalog_btn: "પ્રોડક્ટ કેટલોગ",
      packing_btn: "પેકિંગ મટીરીયલ",
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
      lang_changed: "ભાષા બદલાઈ ગઈ: ગુજરાતી",
      drawer_subtext: "હોટ સેલિંગ પ્રોડક્ટ્સ • Meesho ડ્રોપશિપિંગ",
      problem_loading: "Problem to load?",
      expand_view: "મોટો જુઓ",
      download_btn: "Download",
      download_hd: "HD ડાઉનલોડ",
      search_placeholder: "શીટ નંબર શોધો (દા.ત. 15, 80)...",
      toast_downloading: "ડાઉનલોડ શરૂ થઈ રહ્યું છે...",
      toast_download_success: "શીટ સફળતાપૂર્વક ડાઉનલોડ થઈ!",
      toast_download_error: "ડાઉનલોડ કરવામાં સમસ્યા આવી, Drive લિંક અજમાવો."
    },
    en: {
      brand_category: "Meesho Selling & Dropshipping Service",
      catalog_btn: "Product Catalog",
      packing_btn: "Packing Material",
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
      lang_changed: "Language changed: English",
      drawer_subtext: "Hot Selling Products • Meesho Dropshipping",
      problem_loading: "Problem to load?",
      expand_view: "Expand View",
      download_btn: "Download",
      download_hd: "Download HD",
      search_placeholder: "Search sheet number (e.g. 15, 80)...",
      toast_downloading: "Starting download...",
      toast_download_success: "Sheet downloaded successfully!",
      toast_download_error: "Download failed, try Google Drive link."
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

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (translations[lang][key]) {
        el.placeholder = translations[lang][key];
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

  // =========================================================================
  // 📦 PRODUCT CATALOG DRAWER & FULLSCREEN LIGHTBOX VIEWER
  // =========================================================================
  
  // 1. Data Layer: 83 Sheets (images-0 to images-85, skipping 9, 10, 11)
  const skippedSheets = new Set([9, 10, 11]);
  const CATALOG_ITEMS = [];
  for (let i = 0; i <= 85; i++) {
    if (skippedSheets.has(i)) continue;
    CATALOG_ITEMS.push({
      id: i,
      title: `HOT SELLING PRODUCT...7304429236-${i}`,
      shortTitle: `HOT SELLING PRODUCT...7304429236-${i}`,
      thumbUrl: `https://ik.imagekit.io/86fnw06jj/tr:w-250,q-55,f-auto/7304429236/HOT%20SELLING%20PRODUCT%207304429236-images-${i}.jpg`,
      fullUrl: `https://ik.imagekit.io/86fnw06jj/tr:w-1200,q-80,f-auto/7304429236/HOT%20SELLING%20PRODUCT%207304429236-images-${i}.jpg`,
      downloadUrl: `https://ik.imagekit.io/86fnw06jj/7304429236/HOT%20SELLING%20PRODUCT%207304429236-images-${i}.jpg`,
      fileName: `OM-Online-Mart-HOT-SELLING-Sheet-${i}.jpg`
    });
  }

  // State
  const BATCH_SIZE = 20;
  let catalogRenderedCount = 0;
  let filteredCatalog = [...CATALOG_ITEMS];
  let currentLightboxIndex = 0;
  let activeOpenDropdown = null;

  // Drawer DOM Elements
  const catalogDrawerOverlay = document.getElementById('catalog-drawer-overlay');
  const catalogDrawer = document.getElementById('catalog-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const btnExpandDrawer = document.getElementById('btn-expand-drawer');
  const drawerExpandIcon = document.getElementById('drawer-expand-icon');
  const drawerDragHandle = document.getElementById('drawer-drag-handle');
  const catalogGrid = document.getElementById('catalog-grid');
  const catalogScrollSentinel = document.getElementById('catalog-scroll-sentinel');
  const catalogLoadingIndicator = document.getElementById('catalog-loading-indicator');
  const catalogEmptyState = document.getElementById('catalog-empty-state');
  const catalogSearchInput = document.getElementById('catalog-sheet-search');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const btnResetSearch = document.getElementById('btn-reset-search');
  const catalogTotalBadge = document.getElementById('catalog-total-badge');
  const drawerDriveLink = document.getElementById('drawer-drive-link');

  // Lightbox DOM Elements
  const catalogLightbox = document.getElementById('catalog-lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxCurrentImg = document.getElementById('lightbox-current-img');
  const lightboxCounterPill = document.getElementById('lightbox-counter-pill');
  const lightboxSheetTitle = document.getElementById('lightbox-sheet-title');
  const lightboxSpinner = document.getElementById('lightbox-spinner');
  const btnLightboxPrev = document.getElementById('btn-lightbox-prev');
  const btnLightboxNext = document.getElementById('btn-lightbox-next');
  const btnLightboxClose = document.getElementById('btn-lightbox-close');
  const btnLightboxDownload = document.getElementById('btn-lightbox-download');
  const lightboxStage = document.getElementById('lightbox-stage');

  if (drawerDriveLink && APP_CONFIG.CATALOG_DRIVE_URL) {
    drawerDriveLink.href = APP_CONFIG.CATALOG_DRIVE_URL;
  }

  // Open Drawer Function
  function openCatalogDrawer() {
    if (!catalogDrawerOverlay) return;
    catalogDrawerOverlay.classList.add('active');
    catalogDrawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Initial batch render if empty
    if (catalogRenderedCount === 0) {
      renderNextBatch();
    }
  }

  // Close Drawer Function
  function closeCatalogDrawer() {
    if (!catalogDrawerOverlay) return;
    closeAllCardDropdowns();
    catalogDrawerOverlay.classList.remove('active');
    catalogDrawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Toggle Fullscreen Drawer Mode
  function toggleDrawerFullscreen() {
    if (!catalogDrawer) return;
    catalogDrawer.classList.toggle('is-fullscreen');
    const isFull = catalogDrawer.classList.contains('is-fullscreen');
    if (drawerExpandIcon) {
      drawerExpandIcon.className = isFull ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    }
  }

  // Open Drawer on "Product Catalog" button click
  if (headerCatalogBtn) {
    headerCatalogBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCatalogDrawer();
    });
  }

  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeCatalogDrawer);
  if (btnExpandDrawer) btnExpandDrawer.addEventListener('click', toggleDrawerFullscreen);
  if (drawerDragHandle) drawerDragHandle.addEventListener('click', toggleDrawerFullscreen);

  if (catalogDrawerOverlay) {
    catalogDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === catalogDrawerOverlay) {
        closeCatalogDrawer();
      }
    });
  }

  // Close all card 3-dot dropdowns
  function closeAllCardDropdowns() {
    if (activeOpenDropdown) {
      activeOpenDropdown.classList.remove('show');
      const prevBtn = activeOpenDropdown.parentElement.querySelector('.card-menu-btn');
      if (prevBtn) prevBtn.classList.remove('active');
      activeOpenDropdown = null;
    }
  }

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.card-menu-btn') && !e.target.closest('.card-dropdown-menu')) {
      closeAllCardDropdowns();
    }
  });

  // Render Next Batch (20 items at a time)
  function renderNextBatch() {
    if (catalogRenderedCount >= filteredCatalog.length) {
      if (catalogLoadingIndicator) catalogLoadingIndicator.style.display = 'none';
      return;
    }

    const nextBatch = filteredCatalog.slice(catalogRenderedCount, catalogRenderedCount + BATCH_SIZE);
    const fragment = document.createDocumentFragment();

    nextBatch.forEach((item, indexWithinBatch) => {
      const globalIndex = catalogRenderedCount + indexWithinBatch;
      const card = document.createElement('div');
      card.className = 'catalog-card';
      card.dataset.index = globalIndex;

      card.innerHTML = `
        <div class="catalog-card-header">
          <div class="card-title-col">
            <span class="card-type-icon" title="Product Sheet">
              <i class="fa-solid fa-image"></i>
            </span>
            <span class="card-title-text" title="${item.title}">${item.shortTitle}</span>
          </div>
          <button type="button" class="card-menu-btn" aria-label="Sheet options" title="Options">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <div class="card-dropdown-menu" role="menu">
            <button type="button" class="dropdown-item btn-menu-expand" role="menuitem">
              <i class="fa-solid fa-expand"></i>
              <span data-i18n="expand_view">Expand View</span>
            </button>
            <button type="button" class="dropdown-item btn-menu-download" role="menuitem">
              <i class="fa-solid fa-download"></i>
              <span data-i18n="download_hd">Download HD</span>
            </button>
          </div>
        </div>
        <div class="catalog-card-image-wrap" title="Tap to expand ${item.title}">
          <img src="${item.thumbUrl}" 
               alt="${item.title}" 
               loading="lazy"
               decoding="async" />
          <div class="card-hover-overlay">
            <span><i class="fa-solid fa-magnifying-glass-plus"></i> View #${item.id}</span>
          </div>
        </div>
      `;

      // 3-Dots Menu Button Toggle
      const menuBtn = card.querySelector('.card-menu-btn');
      const dropdownMenu = card.querySelector('.card-dropdown-menu');
      const btnMenuExpand = card.querySelector('.btn-menu-expand');
      const btnMenuDownload = card.querySelector('.btn-menu-download');
      const imageWrap = card.querySelector('.catalog-card-image-wrap');

      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.contains('show');
        closeAllCardDropdowns();
        if (!isOpen) {
          dropdownMenu.classList.add('show');
          menuBtn.classList.add('active');
          activeOpenDropdown = dropdownMenu;
        }
      });

      // Expand Option from 3-dot dropdown
      btnMenuExpand.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllCardDropdowns();
        openLightbox(globalIndex);
      });

      // Download HD Option from 3-dot dropdown
      btnMenuDownload.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllCardDropdowns();
        downloadSheet(item);
      });

      // Clicking the card image directly opens Lightbox
      imageWrap.addEventListener('click', () => {
        closeAllCardDropdowns();
        openLightbox(globalIndex);
      });

      fragment.appendChild(card);
    });

    catalogGrid.appendChild(fragment);
    catalogRenderedCount += nextBatch.length;

    // Apply translations to dynamic batch
    applyDynamicTranslations(catalogGrid);

    if (catalogRenderedCount >= filteredCatalog.length) {
      if (catalogLoadingIndicator) catalogLoadingIndicator.style.display = 'none';
    }
  }

  // Infinite Scroll Observer
  let catalogObserver = null;
  if ('IntersectionObserver' in window && catalogScrollSentinel) {
    catalogObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (catalogRenderedCount < filteredCatalog.length) {
          if (catalogLoadingIndicator) catalogLoadingIndicator.style.display = 'flex';
          renderNextBatch();
        }
      }
    }, {
      root: document.getElementById('catalog-drawer-scroll'),
      rootMargin: '250px',
      threshold: 0.1
    });

    catalogObserver.observe(catalogScrollSentinel);
  }

  // Search / Filter sheets by sheet number or keyword
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.trim().toLowerCase();
      if (btnClearSearch) {
        btnClearSearch.style.display = term ? 'block' : 'none';
      }

      if (!term) {
        filteredCatalog = [...CATALOG_ITEMS];
      } else {
        filteredCatalog = CATALOG_ITEMS.filter(item => 
          item.id.toString() === term ||
          item.id.toString().includes(term) ||
          item.title.toLowerCase().includes(term)
        );
      }

      catalogGrid.innerHTML = '';
      catalogRenderedCount = 0;
      closeAllCardDropdowns();

      if (filteredCatalog.length === 0) {
        if (catalogEmptyState) catalogEmptyState.style.display = 'block';
        if (catalogTotalBadge) catalogTotalBadge.textContent = '0 Sheets';
      } else {
        if (catalogEmptyState) catalogEmptyState.style.display = 'none';
        if (catalogTotalBadge) catalogTotalBadge.textContent = `${filteredCatalog.length} Sheets`;
        renderNextBatch();
      }
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      catalogSearchInput.value = '';
      btnClearSearch.style.display = 'none';
      catalogSearchInput.dispatchEvent(new Event('input'));
      catalogSearchInput.focus();
    });
  }

  if (btnResetSearch) {
    btnResetSearch.addEventListener('click', () => {
      if (catalogSearchInput) {
        catalogSearchInput.value = '';
        if (btnClearSearch) btnClearSearch.style.display = 'none';
        catalogSearchInput.dispatchEvent(new Event('input'));
      }
    });
  }

  // =========================================================================
  // LIGHTBOX EXPANDED VIEWER
  // =========================================================================
  function openLightbox(index) {
    if (!catalogLightbox || !filteredCatalog[index]) return;
    currentLightboxIndex = index;
    updateLightboxContent();
    catalogLightbox.classList.add('active');
    catalogLightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!catalogLightbox) return;
    catalogLightbox.classList.remove('active');
    catalogLightbox.setAttribute('aria-hidden', 'true');
  }

  function updateLightboxContent() {
    const item = filteredCatalog[currentLightboxIndex];
    if (!item) return;

    if (lightboxCounterPill) {
      lightboxCounterPill.textContent = `#${item.id}`;
    }
    if (lightboxSheetTitle) {
      lightboxSheetTitle.textContent = item.title;
    }

    if (lightboxSpinner) lightboxSpinner.classList.add('show');
    if (lightboxCurrentImg) {
      lightboxCurrentImg.style.opacity = '0.35';

      const tempImg = new Image();
      tempImg.src = item.fullUrl;
      tempImg.onload = () => {
        lightboxCurrentImg.src = item.fullUrl;
        lightboxCurrentImg.alt = item.title;
        lightboxCurrentImg.style.opacity = '1';
        if (lightboxSpinner) lightboxSpinner.classList.remove('show');
      };
      tempImg.onerror = () => {
        lightboxCurrentImg.src = item.downloadUrl;
        lightboxCurrentImg.style.opacity = '1';
        if (lightboxSpinner) lightboxSpinner.classList.remove('show');
      };
    }

    // Preload next and previous images
    preloadAdjacentImages();
  }

  function preloadAdjacentImages() {
    const nextIdx = (currentLightboxIndex + 1) % filteredCatalog.length;
    const prevIdx = (currentLightboxIndex - 1 + filteredCatalog.length) % filteredCatalog.length;

    if (filteredCatalog[nextIdx]) {
      const imgNext = new Image();
      imgNext.src = filteredCatalog[nextIdx].fullUrl;
    }
    if (filteredCatalog[prevIdx]) {
      const imgPrev = new Image();
      imgPrev.src = filteredCatalog[prevIdx].fullUrl;
    }
  }

  function showNextLightbox() {
    if (filteredCatalog.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredCatalog.length;
    updateLightboxContent();
  }

  function showPrevLightbox() {
    if (filteredCatalog.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredCatalog.length) % filteredCatalog.length;
    updateLightboxContent();
  }

  if (btnLightboxNext) btnLightboxNext.addEventListener('click', showNextLightbox);
  if (btnLightboxPrev) btnLightboxPrev.addEventListener('click', showPrevLightbox);
  if (btnLightboxClose) btnLightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation for Lightbox and Drawer
  document.addEventListener('keydown', (e) => {
    if (catalogLightbox && catalogLightbox.classList.contains('active')) {
      if (e.key === 'ArrowRight') showNextLightbox();
      if (e.key === 'ArrowLeft') showPrevLightbox();
      if (e.key === 'Escape') closeLightbox();
    } else if (catalogDrawerOverlay && catalogDrawerOverlay.classList.contains('active')) {
      if (e.key === 'Escape') closeCatalogDrawer();
    }
  });

  // Mobile Touch Swipe Navigation for Lightbox
  let touchStartX = 0;
  let touchStartY = 0;
  if (lightboxStage) {
    lightboxStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightboxStage.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) showNextLightbox();
        else showPrevLightbox();
      }
    }, { passive: true });
  }

  // =========================================================================
  // ONE-CLICK DIRECT IMAGE DOWNLOAD (HIGH QUALITY)
  // =========================================================================
  async function downloadSheet(item) {
    if (!item) return;

    const toastMsgStart = translations[currentLang] ? (translations[currentLang].toast_downloading || 'Starting download...') : 'Starting download...';
    showToast(toastMsgStart);

    const targetUrl = item.downloadUrl || item.fullUrl;
    const fileName = item.fileName || `OM-Online-Mart-Sheet-${item.id}.jpg`;

    try {
      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error('Network error');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      const toastSuccess = translations[currentLang] ? (translations[currentLang].toast_download_success || 'Sheet downloaded!') : 'Sheet downloaded!';
      showToast(toastSuccess);
    } catch (err) {
      // Direct anchor link fallback
      const fallbackLink = document.createElement('a');
      fallbackLink.href = targetUrl;
      fallbackLink.download = fileName;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  }

  // Lightbox Header Download Button
  if (btnLightboxDownload) {
    btnLightboxDownload.addEventListener('click', () => {
      const item = filteredCatalog[currentLightboxIndex];
      if (item) downloadSheet(item);
    });
  }

  // Helper to reapply translations to dynamically rendered batch
  function applyDynamicTranslations(container) {
    if (!container || !translations[currentLang]) return;
    container.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
      }
    });
  }
});
