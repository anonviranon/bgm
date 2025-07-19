// --- Global Functions ---
// These functions are placed here so the HTML's inline onclick="..." can find them.

function togglePopup(popupId) {
  const targetPopup = document.getElementById(popupId);
  if (!targetPopup) return;

  const isVisible = targetPopup.style.display === 'flex';

  // Hide all popups first
  document.querySelectorAll('.popup').forEach(popup => {
    popup.style.display = 'none';
  });

  // If the target wasn't visible, show it. Otherwise, it stays hidden.
  if (!isVisible) {
    targetPopup.style.display = 'flex';
  }
}

function downloadIcsFile() {
  const icsLink = document.getElementById('ics-cal-link');
  // Prevent download if links aren't ready yet
  if (icsLink.classList.contains('link-loading')) return; 

  const link = document.createElement('a');
  link.href = icsLink.href;
  link.download = 'Majlis_Kenduri.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


// --- Main Application Logic ---
// This runs after the HTML page is fully loaded.
document.addEventListener('DOMContentLoaded', function() {

  // --- Element Selections ---
  const page1 = document.getElementById('page1');
  const staticRose = document.getElementById('static-rose');
  const video = document.getElementById('blooming-rose-video');
  const backgroundMusic = document.getElementById('background-music');

  // --- Event Listeners ---

  // 1. Blooming rose animation
  staticRose.addEventListener('click', function() {
    if (backgroundMusic) {
      backgroundMusic.play().catch(error => console.error("Audio playback failed:", error));
    }
    this.style.display = 'none';
    video.style.display = 'block';
    video.play();
  });

  // 2. Actions after the video finishes
  video.onended = function() {
    // Fade out the first page
    page1.style.opacity = '0';
    page1.style.pointerEvents = 'none';

    // Set the guest count
    document.getElementById('guest-count').innerText = "75";

    // Generate calendar links
    generateCalendarLinks();
  };

  // --- Functions ---

  function generateCalendarLinks() {
    // Event Details
    const eventDetails = {
      title: "Jamuan Kenduri KKTJMPPP",
      description: "Majlis Jamuan Kenduri Kesyukuran Kakitangan Jabatan Mufti Pulau Pinang",
      location: "Berjaya Penang Hotel, George Town, Penang, Malaysia",
      // Note: Times are in UTC (Malaysia time - 8 hours)
      // 2:00 PM Malaysia time is 06:00 UTC
      // 10:00 PM Malaysia time is 14:00 UTC
      startDate: "20250927T060000Z",
      endDate: "20250927T140000Z",
    };

    // 1. Google Calendar Link
    const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;

    // 2. Apple/Outlook (ICS File) Link
    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MyWebApp//EN',
      'BEGIN:VEVENT',
      `UID:kenduri-kktjmppp-20250927@mufti.penang.gov.my`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}`,
      `DTSTART:${eventDetails.startDate}`,
      `DTEND:${eventDetails.endDate}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const icsUri = "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent);

    // Update the HTML links
    const googleEl = document.getElementById("google-cal-link");
    const icsEl = document.getElementById("ics-cal-link");
    googleEl.href = googleLink;
    googleEl.classList.remove("link-loading");
    icsEl.href = icsUri;
    icsEl.classList.remove("link-loading");
  }

  // --- Countdown Timer ---
  const countdownDate = new Date("September 27, 2025 14:00:00").getTime(); // Set to 2 PM
  const timer = setInterval(function() {
    const now = new Date().getTime();
    const dist = countdownDate - now;

    if (dist < 0) {
      clearInterval(timer);
      document.getElementById("countdown-timer").innerHTML = "<h3>The day is here!</h3>";
      return;
    }

    const d = Math.floor(dist / (1000 * 60 * 60 * 24));
    const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((dist % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(d).padStart(2, '0');
    document.getElementById("hours").innerText = String(h).padStart(2, '0');
    document.getElementById("minutes").innerText = String(m).padStart(2, '0');
    document.getElementById("seconds").innerText = String(s).padStart(2, '0');
  }, 1000);
});
