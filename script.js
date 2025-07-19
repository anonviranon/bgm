document.addEventListener('DOMContentLoaded', function() {
  const page1 = document.getElementById('page1');
  const staticRose = document.getElementById('static-rose');
  const video = document.getElementById('blooming-rose-video');
  const backgroundMusic = document.getElementById('background-music');

  function togglePopup(id) {
    document.querySelectorAll('.popup').forEach(popup => {
      if (popup.id !== id && popup.style.display === 'flex') {
        popup.style.display = 'none';
      }
    });
    const popup = document.getElementById(id);
    popup.style.display = (popup.style.display === 'flex') ? 'none' : 'flex';
  }

  window.togglePopup = togglePopup; // Expose to global for HTML inline calls

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

  window.downloadIcsFile = downloadIcsFile;

  // Blooming rose animation
  staticRose.addEventListener('click', function() {
    if (backgroundMusic) {
      backgroundMusic.play().catch(error => console.error("Audio playback failed:", error));
    }
    this.style.display = 'none';
    video.style.display = 'block';
    video.play();
  });

  video.onended = function() {
    page1.style.opacity = '0';
    page1.style.pointerEvents = 'none';

    // Simulated attendance count
    document.getElementById('guest-count').innerText = "75"; // Example value

    // Generate calendar links
    const startDate = "20250927T060000Z";
    const endDate = "20250927T140000Z";
    const title = "Jamuan Kenduri KKTJMPPP";
    const location = "Berjaya Penang Hotel, George Town, Penang, Malaysia";
    const description = "Majlis Jamuan Kenduri Kesyukuran Kakitangan Jabatan Mufti Pulau Pinang";

    const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '') + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KKTJMPPP//Jamuan Kenduri//EN',
      'BEGIN:VEVENT',
      `UID:kenduri-kktjmppp-20250927@mufti.penang.gov.my`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const icsUri = "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent);

    const googleEl = document.getElementById("google-cal-link");
    const icsEl = document.getElementById("ics-cal-link");
    if (googleEl) {
      googleEl.href = googleLink;
      googleEl.classList.remove("link-loading");
    }
    if (icsEl) {
      icsEl.href = icsUri;
      icsEl.classList.remove("link-loading");
    }
  };

  // Countdown timer
  const countdownDate = new Date("Sep 27, 2025 00:00:00").getTime();
  const timer = setInterval(function() {
    const now = new Date().getTime();
    const dist = countdownDate - now;
    const d = Math.floor(dist / (1000 * 60 * 60 * 24));
    const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((dist % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d < 10 ? '0' + d : d;
    document.getElementById("hours").innerText = h < 10 ? '0' + h : h;
    document.getElementById("minutes").innerText = m < 10 ? '0' + m : m;
    document.getElementById("seconds").innerText = s < 10 ? '0' + s : s;

    if (dist < 0) {
      clearInterval(timer);
      document.getElementById("countdown-timer").innerHTML = "<h3>The day is here!</h3>";
    }
  }, 1000);
});
