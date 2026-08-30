/**
 * OM ONLINE MART - CLIENT SIDE APPLICATION SCRIPT
 * Handles vCard generation, Native Web Share, QR Code rendering, and Interactive Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const currentUrl = window.location.href.includes('http') ? window.location.href : 'https://omonlinemart.in';
  const qrCanvas = document.getElementById('qr-code-canvas');
  const qrModal = document.getElementById('qr-modal');
  const shareModal = document.getElementById('share-modal');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  // Set Current Year in Footer
  const yearSpan = document.getElementById('year-span');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

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
  function copyToClipboard(text, successMsg = 'લિંક કોપી થઈ ગઈ! / Link copied!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
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
      'EMAIL;TYPE=INTERNET,WORK:omonlinemart@gmail.com',
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

    showToast('સંપર્ક ફાઈલ ડાઉનલોડ થઈ! / Contact saved!');
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
    showToast('QR Code ડાઉનલોડ થયો! / QR downloaded!');
  }

  // Modal Open/Close Controls
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

  // QR Modal Trigger
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
      text: 'Meesho પર Selling શરૂ કરો — Account, Product Listing અને Order Dispatchની સંપૂર્ણ Service અમારી તરફથી.',
      url: currentUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(() => {
        // User cancelled or failed -> fallback to modal
      });
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
