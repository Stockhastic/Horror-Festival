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
const sidebar = document.querySelector(".sidebar--participants");

btn.addEventListener("click", (e) => {
    e.preventDefault(); // чтобы не переходил по href
    sidebar.classList.toggle("moved");
    btn.classList.toggle("toggled")
});