// --- GLOBAL VARIABLES ---
let autoScrollInterval = null; // This will hold the interval for the auto-scroll.

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
    // The href and download attributes are now set dynamically in generateCalendarLinks.
    // This function is kept in case it's needed for other purposes, but the link click is now standard.
}


// --- MAIN APPLICATION LOGIC ---
// This function runs when the entire HTML page has loaded and is ready.
document.addEventListener('DOMContentLoaded', function() {

    // --- Element Selections ---
    const page1 = document.getElementById('page1');
    const staticRoseVideo = document.getElementById('static-rose'); // This is the first video
    const bloomingRoseVideo = document.getElementById('blooming-rose-video'); // This is the second video
    const backgroundMusic = document.getElementById('background-music');
    const scrollContainer = document.querySelector('.scroll-container');

    // --- Main Event Listeners ---

    // 1. Handles the initial click on the first rose video to start the experience.
    staticRoseVideo.addEventListener('click', function() {
        // Play background music. The .catch handles errors on browsers that block autoplay.
        if (backgroundMusic) {
            backgroundMusic.play().catch(error => console.error("Audio playback failed:", error));
        }
        // Hide the first video and show the second (blooming) video.
        this.style.display = 'none';
        bloomingRoseVideo.style.display = 'block';
        bloomingRoseVideo.play();
    });

    // 2. This runs only after the blooming rose video has finished playing.
    bloomingRoseVideo.onended = function() {
        // Fade out the first page to reveal the main invitation.
        page1.style.opacity = '0';
        // After fading, set display to none so it doesn't block clicks on page2.
        setTimeout(() => {
            page1.style.display = 'none';
        }, 1500); // This time must match the CSS transition duration for #page1.

        // Set a simulated guest count.
        document.getElementById('guest-count').innerText = "75";

        // Generate the calendar links.
        generateCalendarLinks();

        // ** NEW: Start the auto-scroll effect **
        startAutoScroll();
    };

    // --- Countdown Timer Logic ---
    setupCountdownTimer();


    // --- HELPER FUNCTIONS ---

    /**
     * ** NEW: Starts a slow, automatic scroll down the page. **
     */
    function startAutoScroll() {
        // Ensure we don't start multiple scroll intervals.
        if (autoScrollInterval) return;

        // Listen for user interaction to stop the scrolling.
        // The { once: true } option automatically removes the listener after it fires once.
        scrollContainer.addEventListener('wheel', stopAutoScroll, { once: true });
        scrollContainer.addEventListener('touchstart', stopAutoScroll, { once: true });
        scrollContainer.addEventListener('mousedown', stopAutoScroll, { once: true });

        autoScrollInterval = setInterval(() => {
            // Check if we've reached the bottom of the scrollable content.
            const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + 1;

            if (!isAtBottom) {
                scrollContainer.scrollTop += 1; // Scroll down by 1 pixel.
            } else {
                // If at the bottom, stop the scrolling.
                stopAutoScroll();
            }
        }, 25); // Interval in milliseconds. Lower numbers are faster. 25ms is smooth.
    }

    /**
     * ** NEW: Stops the automatic scrolling. **
     */
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    /**
     * Generates the dynamic links for Google Calendar and the ICS file.
     */
    function generateCalendarLinks() {
        const eventDetails = {
            title: "Jamuan Kenduri KKTJMPPP",
            description: "Majlis Jamuan Kenduri Kesyukuran Kakitangan Jabatan Mufti Pulau Pinang",
            location: "Berjaya Penang Hotel, George Town, Penang, Malaysia",
            startDate: "20250927T060000Z",
            endDate: "20250927T140000Z",
        };
        const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startDate}/${eventDetails.endDate}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
        const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MyWebApp//EN', 'BEGIN:VEVENT', `UID:kenduri-kktjmppp-${new Date().getTime()}@example.com`, `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}`, `DTSTART:${eventDetails.startDate}`, `DTEND:${eventDetails.endDate}`, `SUMMARY:${eventDetails.title}`, `DESCRIPTION:${eventDetails.description}`, `LOCATION:${eventDetails.location}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        const icsUri = "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent);
        const googleEl = document.getElementById("google-cal-link");
        const icsEl = document.getElementById("ics-cal-link");
        googleEl.href = googleLink;
        googleEl.classList.remove("link-loading");
        icsEl.href = icsUri;
        icsEl.setAttribute('download', 'Majlis_Kenduri.ics');
        icsEl.classList.remove("link-loading");
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
});
