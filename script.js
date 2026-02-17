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

// ===== QR MODAL =====
function showQRModal(color) {
    const title = color === 'blue' ? 'BLUE QR CODE' : 'YELLOW QR CODE';
    const qrSrc = color === 'blue' ? 'images/blue_qr.png' : 'images/yellow_qr.png';
    const upiId = color === 'blue' ? '7599181164@ybl' : '7599181164-2@ybl';
    const buttonColor = color === 'blue' ? 'blue-3d' : 'yellow-3d';
    const modalColor = color === 'blue' ? 'blue-modal' : 'yellow-modal';
    const colorUpper = color === 'blue' ? 'BLUE' : 'YELLOW';
    
    document.getElementById('modalTitle').textContent = title;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.classList.remove('blue-modal', 'yellow-modal');
    modalContent.classList.add(modalColor);
    
    document.getElementById('modalBody').innerHTML = `
        <div style="text-align: center;">
            <!-- FULL SIZE QR -->
            <div class="modal-qr-full">
                <img src="${qrSrc}" alt="${color} QR" id="modalQRImage" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div style=\'width:100%;aspect-ratio:1/1;background:linear-gradient(145deg,#f8f9fa,#e9ecef);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid ${color === 'blue' ? '#4361ee' : '#ffd166'}\'><i class=\'fas fa-qrcode\' style=\'font-size:5rem;color:${color === 'blue' ? '#4361ee' : '#f8961e'};margin-bottom:10px;\'></i><span style=\'font-weight:700;color:${color === 'blue' ? '#4361ee' : '#f8961e'}\'>${color === 'blue' ? 'BLUE' : 'YELLOW'} QR</span></div>');">
            </div>
            
            <!-- UPI ID MINI BAR -->
            <div class="upi-mini-bar">
                <span><strong>UPI ID :</strong> ${upiId}</span>
                <i class="far fa-copy" onclick="copyUPI('${color}')" style="cursor: pointer;"></i>
            </div>
            
            <!-- SINGLE BIG 3D BUTTON -->
            <button class="payment-3d-btn ${buttonColor}" onclick="startPaymentCountdown('${color}', this)">
                <i class="fas fa-bolt"></i>
                <div style="display: flex; flex-direction: column;">
                    <span class="btn-text-line1">PAY NOW</span>
                    <span class="btn-text-line2">Quick • Secure</span>
                </div>
                <span class="btn-countdown" id="countdownDisplay">5s</span>
            </button>
            
            <!-- STEP BY STEP INSTRUCTIONS -->
            <div class="step-instructions">
                <h4><i class="fas fa-info-circle"></i> How to Pay:</h4>
                
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-text">
                        <strong>Copy UPI ID</strong> from above
                        <div class="step-optional">(optional)</div>
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-text">
                        Click <strong>PAY NOW</strong> button
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-text">
                        Wait <strong>5 seconds</strong> for auto-redirect
                    </div>
                </div>
                
                <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-text">
                        Choose your UPI app (if multiple)
                    </div>
                </div>
                
                <div class="step-note">
                    <i class="fas fa-pen"></i>
                    <strong>Note:</strong> Add <span style="color: ${color === 'blue' ? '#4361ee' : '#f8961e'}; font-weight: 700;">${colorUpper}</span> in payment note
                </div>
            </div>
        </div>
    `;
    
    openModal('qrModal');
}

// ===== COUNTDOWN WITH DIRECT UPI =====
let countdownInterval;

function startPaymentCountdown(color, buttonElement) {
    // Stop previous countdown if running
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    let seconds = 5;
    const countdownDisplay = document.getElementById('countdownDisplay');
    
    // UPI link - DEFAULT UPI APP will open (Android will show chooser if multiple)
    const upiLink = color === 'blue' 
        ? 'upi://pay?pa=7599181164@ybl&pn=APEX%20DAY%20BLUE&cu=INR&am=10' 
        : 'upi://pay?pa=7599181164-2@ybl&pn=APEX%20DAY%20YELLOW&cu=INR&am=10';
    
    // Disable button during countdown
    buttonElement.style.pointerEvents = 'none';
    buttonElement.style.opacity = '0.8';
    
    countdownInterval = setInterval(() => {
        seconds--;
        
        if (countdownDisplay) {
            countdownDisplay.textContent = seconds + 's';
        }
        
        // Button press effect every second
        buttonElement.style.transform = 'translateY(4px)';
        buttonElement.style.boxShadow = '0 4px 0 rgba(0,0,0,0.2), 0 8px 15px rgba(0,0,0,0.1)';
        
        setTimeout(() => {
            buttonElement.style.transform = '';
            buttonElement.style.boxShadow = '';
        }, 100);
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            
            // Re-enable button
            buttonElement.style.pointerEvents = 'auto';
            buttonElement.style.opacity = '1';
            
            // Direct UPI app open - DEFAULT APP will open
            // If multiple UPI apps, Android will show chooser dialog
            window.location.href = upiLink;
            showToast('Opening UPI app...');
        }
    }, 1000);
}

// ===== FULL SCREEN POSTER =====
function openFullScreen(img) {
    document.getElementById('modalTitle').textContent = 'APEX DAY';
    
    const modalContent = document.getElementById('modalContent');
    modalContent.classList.remove('blue-modal', 'yellow-modal');
    
    document.getElementById('modalBody').innerHTML = `<div style="text-align: center;"><img src="${img.src}" alt="Poster" style="width: 100%; border-radius: 12px; border: 2px solid #f0f0f0;"></div>`;
    openModal('qrModal');
}

// ===== COPY UPI =====
function copyUPI(color) {
    const upiId = color === 'blue' ? '7599181164@ybl' : '7599181164-2@ybl';
    navigator.clipboard.writeText(upiId).then(() => {
        showToast('UPI ID copied!');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// ===== SOCIAL MEDIA =====
function openTelegram() { 
    window.open('https://t.me/apexday', '_blank'); 
}

function openWhatsApp() { 
    window.open('https://chat.whatsapp.com/D73ihC5eDL44OkCqpXLdoH?mode=gi_t', '_blank'); 
}

// ===== TOAST =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('i');
    const messageEl = document.getElementById('toastMessage');
    
    messageEl.textContent = message;
    icon.className = type === 'error' ? 'fas fa-times-circle' : 'fas fa-check-circle';
    toast.style.background = type === 'error' ? '#f72585' : '#4cc9f0';
    toast.style.display = 'flex';
    
    setTimeout(() => { 
        toast.style.display = 'none'; 
    }, 2500);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    startCountdown();
    setInterval(startCountdown, 1000);
});

// ===== MODAL CLOSE HANDLERS =====
window.onclick = function(event) {
    const qrModal = document.getElementById('qrModal');
    
    if (event.target === qrModal) {
        closeModal('qrModal');
        // Clear countdown if running
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    }
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal('qrModal');
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    }
});