<script>
  function togglePopup(id) {
    document.querySelectorAll('.popup').forEach(popup => {
        if (popup.id !== id && popup.style.display === 'flex') {
            popup.style.display = 'none';
        }
    });
    const popup = document.getElementById(id);
    if (popup.style.display === 'flex') {
      popup.style.display = 'none';
    } else {
      popup.style.display = 'flex';
    }
  }

  function downloadIcsFile() {
    const icsLink = document.getElementById('ics-cal-link');
    if (icsLink.classList.contains('link-loading')) return;
    const link = document.createElement('a');
    link.href = icsLink.href;
    link.download = 'event.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  document.addEventListener('DOMContentLoaded', function() {
    const page1 = document.getElementById('page1');
    const staticRose = document.getElementById('static-rose');
    const video = document.getElementById('blooming-rose-video');
    const backgroundMusic = document.getElementById('background-music'); // Get the audio element

    video.onended = function() {
      page1.style.opacity = '0';
      page1.style.pointerEvents = 'none';

      google.script.run.withSuccessHandler(function(count) {
        document.getElementById('guest-count').innerText = count;
      }).getAttendanceCount();

      google.script.run.withSuccessHandler(function(links) {
        const googleLink = document.getElementById('google-cal-link');
        const icsLink = document.getElementById('ics-cal-link');
        if (googleLink) {
          googleLink.href = links.google;
          googleLink.classList.remove('link-loading');
        }
        if (icsLink) {
          icsLink.href = links.ics;
          icsLink.classList.remove('link-loading');
        }
      }).getCalendarLinks();
    };

    // UPDATED: This now also plays the music
    staticRose.addEventListener('click', function() {
      // Start playing the music
      if (backgroundMusic) {
        backgroundMusic.play().catch(error => console.error("Audio playback failed:", error));
      }
      
      // Show the blooming rose video
      this.style.display = 'none';
      video.style.display = 'block';
      video.play();
    });

    const countdownDate = new Date("Sep 27, 2025 00:00:00").getTime();
    const countdownInterval = setInterval(function() {
      const now = new Date().getTime();
      const distance = countdownDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById("days").innerText = days < 10 ? '0' + days : days;
      document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
      document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
      document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
      if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown-timer").innerHTML = "<h3>The day is here!</h3>";
      }
    }, 1000);
  });
</script>
