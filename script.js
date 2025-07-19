// This function runs when the entire HTML page has loaded
document.addEventListener('DOMContentLoaded', function() {

  // --- Page 1 to Page 2 Transition ---
  const staticRose = document.getElementById('static-rose');
  const bloomingRoseVideo = document.getElementById('blooming-rose-video');
  const page1 = document.getElementById('page1');
  const backgroundMusic = document.getElementById('background-music');

  staticRose.addEventListener('click', function() {
    // Hide the static image and show the video
    staticRose.style.display = 'none';
    bloomingRoseVideo.style.display = 'block';
    bloomingRoseVideo.play();
    
    // Play background music
    backgroundMusic.play();

    // After the rose video finishes, fade out page 1
    bloomingRoseVideo.onended = function() {
      page1.style.opacity = '0';
      // After the fade-out transition, hide page1 completely
      setTimeout(() => {
        page1.style.display = 'none';
      }, 1500); // This time should match the CSS transition duration
    };
  });


  // --- Countdown Timer ---
  // Set the date for the event
  const countdownDate = new Date("Sep 27, 2025 12:00:00").getTime();

  const timer = setInterval(function() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Calculations for days, hours, minutes, and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the results
    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

    // If the countdown is over, display some text
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById("countdown-timer").innerHTML = "The event has started!";
    }
  }, 1000);

});


// --- Popup Toggle Functionality ---
// This function is called by the onclick attribute in your HTML
function togglePopup(popupId) {
  const targetPopup = document.getElementById(popupId);
  if (!targetPopup) return; // Exit if the popup doesn't exist

  // Check if the target popup is already visible
  const isVisible = targetPopup.style.display === 'flex';

  // First, hide all popups
  const allPopups = document.querySelectorAll('.popup');
  allPopups.forEach(popup => {
    popup.style.display = 'none';
  });

  // If the target popup was not visible, show it
  if (!isVisible) {
    targetPopup.style.display = 'flex';
  }
  // If it was already visible, the code above has already hidden it.
}
