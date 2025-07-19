// Copyright 2025 Google LLC.
// SPDX-License-Identifier: Apache-2.0

/**
 * Serves the main HTML page of the web app.
 * @param {object} e The event parameter.
 * @returns {HtmlOutput} The evaluated HTML template.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle("Jamuan Kenduri KKTJMPPP") // Sets the browser tab title
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/**
 * A utility function to include other HTML files (like CSS or JS) into the main page.
 * @param {string} filename The name of the file to include.
 * @returns {string} The content of the file.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Gets the current number of attendees from the Google Sheet.
 * @returns {number|string} The count of attendees or an "Error" string.
 */
function getAttendanceCount() {
  try {
    // --- PASTE YOUR SPREADSHEET ID HERE ---
    const SPREADSHEET_ID = "1xYaO0aEACDmGzQwwctN9aY7uOazOpLIeGsIrKNi5Ah0";
    // ------------------------------------

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Sheet1"); // Using getSheetByName is more robust
    
    if (!sheet) {
        Logger.log("Sheet not found!");
        return "Error: Sheet not found";
    }

    // The count is the total number of rows with data, minus the header row.
    const attendingCount = sheet.getLastRow() - 1;
    
    // Return the count, ensuring it's not a negative number.
    return Math.max(0, attendingCount);

  } catch (e) {
    Logger.log(e); // Log the actual error for debugging
    return "Error"; // Returns a generic "Error" message to the user
  }
}

/**
 * Generates links to add the event to Google Calendar and download an ICS file.
 * @returns {object} An object containing the Google Calendar link and the ICS data URI.
 */
function getCalendarLinks() {
  // --- Event Details (Raw Text) ---
  const rawTitle = "Jamuan Kenduri KKTJMPPP";
  const rawLocation = "Berjaya Penang Hotel, George Town, Penang, Malaysia";
  const rawDescription = "Majlis Jamuan Kenduri Kesyukuran Kakitangan Jabatan Mufti Pulau Pinang";

  // --- Event Time (Malaysia Time, UTC+8) ---
  // The times below are for Sept 27, 2025, from 2:00 PM to 10:00 PM Malaysia Time.
  // We convert them to the required UTC "Z" format for the calendar links.
  const startDate = "20250927T060000Z"; // Was 140000Z. Corrected from 2 PM UTC to 2 PM MYT (06:00 UTC)
  const endDate = "20250927T140000Z";   // Was 220000Z. Corrected from 10 PM UTC to 10 PM MYT (14:00 UTC)
  
  // --- Encode Details for Google Calendar URL ---
  const googleTitle = encodeURIComponent(rawTitle);
  const googleLocation = encodeURIComponent(rawLocation);
  const googleDescription = encodeURIComponent(rawDescription);
  
  const googleLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${googleTitle}&dates=${startDate}/${endDate}&details=${googleDescription}&location=${googleLocation}`;
  
  // --- Create ICS Content for Apple/Other Calendars ---
  const uniqueId = "kenduri-kktjmppp-20250927@mufti.penang.gov.my"; // A more descriptive unique ID
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '') + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KKTJMPPP//Jamuan Kenduri//EN',
    'BEGIN:VEVENT',
    `UID:${uniqueId}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${rawTitle}`,
    `DESCRIPTION:${rawDescription}`,
    `LOCATION:${rawLocation}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n'); // Use standard CRLF line endings for ICS files

  return {
    google: googleLink,
    ics: "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent)
  };
}
