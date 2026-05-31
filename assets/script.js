// ========================= 1. ويدجت الآيات (السحب والتغيير) =========================
const verses = [
    { text: "وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا", surah: "الطور - 48" },
    { text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", surah: "البقرة - 286" },
    { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "الشرح - 5" },
    { text: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", surah: "الضحى - 5" },
    { text: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", surah: "الحديد - 4" }
];

const widget = document.getElementById('quran-widget');
const verseText = document.getElementById('verseText');
const verseSurah = document.getElementById('verseSurah');

// دالة لتغيير الآية عشوائياً
function changeVerse() {
    // تأثير اختفاء خفيف قبل التغيير
    widget.style.opacity = '0.5';
    setTimeout(() => {
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        verseText.textContent = randomVerse.text;
        verseSurah.textContent = randomVerse.surah;
        widget.style.opacity = '1';
    }, 200);
}

// تغيير الآية تلقائياً كل 15 ثانية
setInterval(changeVerse, 15000);

// -------- منطق السحب (Drag & Drop) للجوال والكمبيوتر --------
let isDragging = false;
let hasMoved = false;
let startX, startY, initialLeft, initialTop;

// تحديد نوع الحدث (لمس أو ماوس)
function getEventCoordinates(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function startDrag(e) {
    isDragging = true;
    hasMoved = false; // تصفير حالة الحركة لمعرفة إذا كان المستخدم يضغط للتغيير أم يسحب
    const coords = getEventCoordinates(e);
    startX = coords.x;
    startY = coords.y;
    
    // الحصول على الموضع الحالي للويدجت
    const rect = widget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    widget.style.transition = 'none'; // إزالة الانتقال الناعم أثناء السحب ليكون سريعاً
}

function drag(e) {
    if (!isDragging) return;
    
    const coords = getEventCoordinates(e);
    const dx = coords.x - startX;
    const dy = coords.y - startY;

    // إذا تحركت المسافة أكثر من 5 بكسل نعتبرها عملية سحب وليس مجرد نقرة
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
    }

    if (hasMoved) {
        e.preventDefault(); // منع تمرير الصفحة أثناء سحب العنصر
        
        // حساب الموضع الجديد مع التأكد من عدم خروجه من الشاشة
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // حدود الشاشة
        const maxLeft = window.innerWidth - widget.offsetWidth;
        const maxTop = window.innerHeight - widget.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        // تطبيق الموضع الجديد
        widget.style.left = `${newLeft}px`;
        widget.style.top = `${newTop}px`;
        widget.style.right = 'auto'; // إلغاء الـ right الافتراضي ليعمل السحب بشكل صحيح
    }
}

function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    widget.style.transition = 'opacity 0.3s ease'; // إعادة الانتقال للشفافية فقط

    // إذا لم يتحرك العنصر (أو تحرك بشكل طفيف جداً)، نعتبرها نقرة لتغيير الآية
    if (!hasMoved) {
        changeVerse();
    }
}

// إضافة مستمعي الأحداث للويدجت
widget.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag, { passive: false });
document.addEventListener('mouseup', stopDrag);

// أحداث اللمس للجوال
widget.addEventListener('touchstart', startDrag, { passive: false });
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('touchend', stopDrag);


// ========================= 2. النافذة السرية المبسطة =========================
// تظهر عند النقر 3 مرات سريعة على الصورة الشخصية
const avatar = document.querySelector('.avatar-img');
const secretOverlay = document.getElementById('secretOverlay');
const closeSecret = document.getElementById('closeSecret');
let clickCount = 0;
let clickTimer;

avatar.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    
    // تأثير نبض خفيف عند النقر
    avatar.parentElement.style.transform = 'scale(0.95)';
    setTimeout(() => avatar.parentElement.style.transform = 'scale(1)', 150);

    if (clickCount === 3) {
        secretOverlay.classList.add('show');
        clickCount = 0;
    }
    
    clickTimer = setTimeout(() => { clickCount = 0; }, 500); // المهلة نصف ثانية
});

closeSecret.addEventListener('click', () => {
    secretOverlay.classList.remove('show');
});

// إغلاق النافذة السرية عند النقر في الخلفية
secretOverlay.addEventListener('click', (e) => {
    if (e.target === secretOverlay) {
        secretOverlay.classList.remove('show');
    }
});