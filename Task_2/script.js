const btn = document.querySelector('.j-btn-test');

const screenWidth = window.screen.width;
const screenHeight = window.screen.height;

btn.addEventListener('click', () => {
    window.location.reload();

    alert(`Ширина ${screenWidth}, высота ${screenHeight}.`);
});