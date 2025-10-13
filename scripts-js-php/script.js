const sound1 = document.querySelector('#hoverSound');
const sound2 = document.querySelector('#hoverSound2');

function playSound(sound) {
    sound.muted = false;
    sound.pause();
    sound.currentTime = 0;
    sound.play().catch(() => { });
}

// ссылки и li
// только ссылки
document.querySelectorAll('.sidebar__link')
    .forEach(el => el.addEventListener('mouseenter', () => playSound(sound1)));

// аватарки
document.querySelectorAll('.sidebar__participant-avatar')
    .forEach(el => el.addEventListener('mouseenter', () => playSound(sound2)));


function playCustomSound(src) {
    const audio = new Audio(src);   // создаём новый плеер
    audio.play().catch(() => { });
}

// выбираем все аватарки
document.querySelectorAll('.sidebar__participant-avatar')
    .forEach(avatar => {
        avatar.addEventListener('click', () => {
            const soundSrc = avatar.dataset.sound; // читаем data-sound
            if (soundSrc) playCustomSound(soundSrc);
        });
    });

const btn = document.getElementById("participants-menu-button");
const btn2 = document.getElementById("ordinary-menu-button")
const sidebar = document.querySelector(".sidebar--participants");

btn.addEventListener("click", (e) => {
    e.preventDefault(); // чтобы не переходил по href
    playSound(new Audio('/src/click1.ogg'));
    sidebar.classList.toggle("moved");
    btn.classList.toggle("toggled")
});

if (btn2) btn2.addEventListener("click", (e) => {
    // Allow modified clicks (new tab/window) to behave normally
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1 || btn2.target === '_blank';
    const href = btn2.getAttribute('href');

    if (modified || !href) {
        // Try to play without blocking navigation
        const click2 = new Audio('/src/click2.ogg');
        click2.play().catch(() => { });
        return;
    }

    // Normal left-click: play sound first, then navigate
    e.preventDefault();
    const click2 = new Audio('/src/click2.ogg');
    click2.preload = 'auto';

    let navigated = false;
    const go = () => {
        if (navigated) return;
        navigated = true;
        window.location.href = href;
    };

    // Fallback timer in case 'ended' doesn't fire
    const fallback = setTimeout(go, 700);
    click2.addEventListener('ended', () => { clearTimeout(fallback); go(); }, { once: true });
    click2.play().catch(go);
});



// Wave animation for main-title letters
(function waveTitle() {
    const root = document.querySelector('.main-title h1');
    if (!root) return;

    let i = 0;
    const wrapNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            const text = node.nodeValue || '';
            for (const ch of text) {
                if (ch === '\n' || ch === '\r') continue;
                const span = document.createElement('span');
                span.textContent = ch;
                span.className = 'wave-letter';
                span.style.animationDelay = `${(i = i + 2) * 0.15}s`;
                frag.appendChild(span);
            }
            return frag;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const clone = node.cloneNode(false);
            node.childNodes.forEach(child => clone.appendChild(wrapNode(child)));
            return clone;
        } else {
            return document.createDocumentFragment();
        }
    };

    const replacement = root.cloneNode(false);
    root.childNodes.forEach(child => replacement.appendChild(wrapNode(child)));
    root.replaceWith(replacement);
})();


// Highlight avatar while its unique sound is playing
document.addEventListener('click', (e) => {
    const av = e.target && e.target.closest ? e.target.closest('.sidebar__participant-avatar') : null;
    if (av) {
        window.__lastAvatarClicked = av;
    }
}, true);

function playCustomSound(src) {
    const audio = new Audio(src);
    const av = window.__lastAvatarClicked;
    if (av) {
        av.classList.add('is-playing');
        const clear = () => av.classList.remove('is-playing');
        audio.addEventListener('ended', clear, { once: true });
        audio.addEventListener('error', clear, { once: true });
    }
    audio.play().catch(() => {
        if (av) av.classList.remove('is-playing');
    });
    return audio;
}
