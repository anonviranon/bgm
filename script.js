// This function runs when the entire HTML page has loaded and is ready.
document.addEventListener('DOMContentLoaded', function() {

    // --- Element Selections ---
    const page1 = document.getElementById('page1');
    const staticRose = document.getElementById('static-rose');
    const video = document.getElementById('blooming-rose-video');
    const backgroundMusic = document.getElementById('background-music');

    // --- Main Event Listeners ---

    // 1. Handles the initial click on the rose to start the experience.
    staticRose.addEventListener('click', function() {
        // Play background music. The .catch handles errors on browsers that block autoplay.
        if (backgroundMusic) {
            backgroundMusic.play().catch(error => console.error("Audio playback failed:", error));
        }
        // Hide the static image and show the blooming rose video.
        this.style.display = 'none';
        video.style.display = 'block';
        video.play();
    });

    // 2. This runs only after the blooming rose video has finished playing.
    video.onended = function() {
        // Fade out the first page to reveal the main invitation.
        page1.style.opacity = '0';
        // After fading, set display to none so it doesn't block clicks on page2.
        setTimeout(() => {
            page1.style.display = 'none';
        }, 1500); // This time must match the CSS transition duration for #page1.

        // Set a simulated guest count.
        document.getElementById('guest-count').innerText = "75";

        // Now that page2 is visible, generate the calendar links.
        generateCalendarLinks();
    };

    // --- Countdown Timer Logic ---
    setupCountdownTimer();
});


// --- GLOBAL FUNCTIONS ---
// These are placed outside the main listener so the inline 'onclick' attributes in the HTML can access them.

/**
 * Toggles the visibility of a popup.
 * It also ensures all other popups are closed before opening a new one.
 * @param {string} popupId The ID of the popup element to toggle.
 */
function togglePopup(popupId) {
    const targetPopup = document.getElementById(popupId);
    if (!targetPopup) return; // Exit if the popup doesn't exist.

    const isVisible = targetPopup.classList.contains('active');

    // Hide all popups first.
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.remove('active');
    });

    // If the target popup was not visible, show it.
    if (!isVisible) {
        targetPopup.classList.add('active');
    }
    // If it was already visible, the loop above has already hidden it.
}

/**
 * Creates and triggers a download for an .ics calendar file.
 */
function downloadIcsFile() {
    const icsLink = document.getElementById('ics-cal-link');
    // Prevent download if the link hasn't been generated yet.
    if (icsLink.classList.contains('link-loading')) {
        event.preventDefault(); // Stop the link from trying to navigate.
        return;
    }

    // This part is for dynamically creating a downloadable link.
    // However, the link is already set in generateCalendarLinks.
    // A simple click is enough if the href is already a data URI.
    // The onclick attribute in the HTML handles this.
}


// --- HELPER FUNCTIONS ---

/**
 * Generates the dynamic links for Google Calendar and the ICS file.
 */
function generateCalendarLinks() {
    const eventDetails = {
        title: "Jamuan Kenduri KKTJMPPP",
        description: "Majlis Jamuan Kenduri Kesyukuran Kakitangan Jabatan Mufti Pulau Pinang",
        location: "Berjaya Penang Hotel, George Town, Penang, Malaysia",
        // UTC times. Example: 2:00 PM Malaysia Time (UTC+8) is 06:00 UTC.
        startDate: "20250927T060000Z",
        endDate: "20250927T140000Z",
    };

    // 1. Google Calendar Link
    const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;

    // 2. Apple/Outlook (ICS File) Link
    const icsContent = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MyWebApp//EN',
        'BEGIN:VEVENT',
        `UID:kenduri-kktjmppp-${new Date().getTime()}@example.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}`,
        `DTSTART:${eventDetails.startDate}`,
        `DTEND:${eventDetails.endDate}`,
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description}`,
        `LOCATION:${eventDetails.location}`,
        'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const icsUri = "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent);

    // Update the links in the HTML and remove the 'loading' state.
    const googleEl = document.getElementById("google-cal-link");
    const icsEl = document.getElementById("ics-cal-link");
    googleEl.href = googleLink;
    googleEl.classList.remove("link-loading");
    
    // For the ICS link, we set the href directly.
    // The downloadIcsFile function is now simpler.
    icsEl.href = icsUri;
    icsEl.setAttribute('download', 'Majlis_Kenduri.ics'); // Add download attribute
    icsEl.classList.remove("link-loading");
    // Remove the onclick from the ICS link as it's no longer needed.
    icsEl.removeAttribute('onclick');
}

/**
 * Sets up the interval to update the countdown timer every second.
 */
function setupCountdownTimer() {
    const countdownDate = new Date("September 27, 2025 14:00:00").getTime();
    
    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById("countdown-timer").innerHTML = "<h3>The day is here!</h3>";
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(d).padStart(2, '0');
        document.getElementById("hours").innerText = String(h).padStart(2, '0');
        document.getElementById("minutes").innerText = String(m).padStart(2, '0');
        document.getElementById("seconds").innerText = String(s).padStart(2, '0');
    }, 1000);
}
