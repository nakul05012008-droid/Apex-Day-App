// ===== DATE FUNCTION =====
function updateDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = now.getFullYear();
    document.getElementById('currentDate').textContent = `${day} ${month} ${year}`;
}

// ===== COUNTDOWN TIMER =====
function startCountdown() {
    const now = new Date();
    const target = new Date();
    target.setHours(20, 0, 0, 0);
    if (now > target) target.setDate(target.getDate() + 1);
    
    const diff = target - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
    document.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
    document.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
    
    const timer = document.querySelector('.countdown-timer');
    if (hours < 1) {
        timer.style.animation = 'blinkRed 0.8s infinite';
    } else {
        timer.style.animation = 'none';
        timer.style.background = 'rgba(0, 0, 0, 0.4)';
        timer.style.color = 'white';
    }
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== QR POPUP =====
function showQrPopup(color) {
    const title = color === 'blue' ? 'BLUE QR CODE' : 'YELLOW QR CODE';
    const qrSrc = color === 'blue' ? 'images/blue_qr.png' : 'images/yellow_qr.png';
    const upiId = color === 'blue' ? '7599181164@ybl' : '7599181164-2@ybl';
    const upiLink = color === 'blue' 
        ? 'upi://pay?pa=7599181164@ybl&pn=APEX%20DAY%20BLUE&cu=INR' 
        : 'upi://pay?pa=7599181164-2@ybl&pn=APEX%20DAY%20YELLOW&cu=INR';
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = `
        <div style="text-align: center;">
            <img src="${qrSrc}" alt="${color} QR" style="width: 200px; height: 200px; border-radius: 16px; margin-bottom: 16px; border: 2px solid #f0f0f0; padding: 10px; background: white;" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div style=\'width:200px;height:200px;background:linear-gradient(145deg,#f8f9fa,#e9ecef);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:16px;border:2px solid ${color === 'blue' ? '#4361ee' : '#ffd166'}\'><i class=\'fas fa-qrcode\' style=\'font-size:5rem;color:${color === 'blue' ? '#4361ee' : '#f8961e'};margin-bottom:10px;\'></i><span style=\'font-weight:700;color:${color === 'blue' ? '#4361ee' : '#f8961e'}\'>${color === 'blue' ? 'BLUE' : 'YELLOW'} QR</span></div>');">
            <div style="background: #f8f9fa; padding: 14px; border-radius: 14px; margin: 16px 0;">
                <p style="margin: 5px 0; font-size: 0.85rem;"><strong>UPI ID:</strong></p>
                <p style="font-family: monospace; font-size: 0.85rem; background: white; padding: 10px; border-radius: 10px; border: 1px solid #eee;">${upiId}</p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="copyUPI('${color}')" style="padding: 10px 16px; background: #4361ee; color: white; border: none; border-radius: 30px; cursor: pointer; font-size: 0.8rem;"><i class="far fa-copy"></i> Copy UPI</button>
                <a href="${upiLink}" style="text-decoration: none;"><button style="padding: 10px 16px; background: #ffd166; color: #212529; border: none; border-radius: 30px; cursor: pointer; font-size: 0.8rem;"><span style="font-size: 0.9rem;">₹</span> Pay Now</button></a>
            </div>
        </div>
    `;
    openModal('qrModal');
}

// ===== FULL SCREEN POSTER =====
function openFullScreen(img) {
    document.getElementById('modalTitle').textContent = 'APEX DAY';
    document.getElementById('modalBody').innerHTML = `<div style="text-align: center;"><img src="${img.src}" alt="Poster" style="width: 100%; border-radius: 12px; border: 2px solid #f0f0f0;"></div>`;
    openModal('qrModal');
}

// ===== COPY UPI =====
function copyUPI(color) {
    const upiId = color === 'blue' ? '7599181164@ybl' : '7599181164-2@ybl';
    navigator.clipboard.writeText(upiId).then(() => showToast('UPI ID copied!')).catch(() => showToast('Failed to copy', 'error'));
}

// ===== SOCIAL MEDIA =====
function openTelegram() { window.open('https://t.me/apexday', '_blank'); }
function openWhatsApp() { window.open('https://chat.whatsapp.com/D73ihC5eDL44OkCqpXLdoH?mode=gi_t', '_blank'); }

// ===== TOAST =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('i');
    const messageEl = document.getElementById('toastMessage');
    messageEl.textContent = message;
    icon.className = type === 'error' ? 'fas fa-times-circle' : 'fas fa-check-circle';
    toast.style.background = type === 'error' ? '#f72585' : '#4cc9f0';
    toast.style.display = 'flex';
    setTimeout(() => { toast.style.display = 'none'; }, 2500);
}

// ===== QR CLICK HANDLER =====
function handleQRClick(color, element) {
    if (element && element.style.display !== 'none') {
        const payLink = document.getElementById(color === 'blue' ? 'bluePayLink' : 'yellowPayLink');
        if (payLink) window.location.href = payLink.href;
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    startCountdown();
    setInterval(startCountdown, 1000);
    
    const blueQR = document.getElementById('blueQRImage');
    const yellowQR = document.getElementById('yellowQRImage');
    const bluePayLink = document.getElementById('bluePayLink');
    const yellowPayLink = document.getElementById('yellowPayLink');
    
    // BLUE QR CLICK
    if (blueQR) {
        blueQR.addEventListener('click', function(e) {
            if (blueQR.style.display !== 'none' && bluePayLink) {
                window.location.href = bluePayLink.href;
            }
        });
    }
    
    // YELLOW QR CLICK
    if (yellowQR) {
        yellowQR.addEventListener('click', function(e) {
            if (yellowQR.style.display !== 'none' && yellowPayLink) {
                window.location.href = yellowPayLink.href;
            }
        });
    }
    
    // PLACEHOLDER CLICK HANDLER
    setTimeout(function() {
        // BLUE PLACEHOLDER
        document.querySelectorAll('.blue-box .qr-placeholder').forEach(function(el) {
            el.addEventListener('click', function() { 
                showQrPopup('blue'); 
            });
        });
        
        // YELLOW PLACEHOLDER
        document.querySelectorAll('.yellow-box .qr-placeholder').forEach(function(el) {
            el.addEventListener('click', function() { 
                showQrPopup('yellow'); 
            });
        });
    }, 500);
});

// ===== MODAL CLOSE HANDLERS =====
window.onclick = function(event) {
    const qrModal = document.getElementById('qrModal');
    if (event.target === qrModal) closeModal('qrModal');
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') closeModal('qrModal');
});