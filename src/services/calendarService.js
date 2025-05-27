export async function fetchWorkingCalendarHolidays(year) {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    // Convert the Unix timestamp to a Date object
    const url = `https://tavirekini.lv/noderigi/${year}-gada-darba-dienu-kalendars`;

    const response = await fetch(`${baseUrl}/proxy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targetUrl: url, // Use the dynamically formatted date URL
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tavirekini data");
    }

    const text = await response.text();

    let cleanedString = text.replace(/\\r\\n/g, ''); // Removes the \r\n
    cleanedString = cleanedString.replace(/\t/g, ''); // Removes the \t (tabs)
    cleanedString = cleanedString.replace(/\\"/g, '"'); // Removes the escaped quotes

    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedString, 'text/html');
    const calendarMonths = doc.querySelectorAll('.calCell');
    
    return calendarMonths;
}
