class CalendarEventBuilder {
    #event_title;
    #start_time;
    #end_time;
    #location;
    #description;
    #days;

    static formatICalString(value) {
        const escaped = value
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n');

        const line = `${escaped}`;

        // Fold at 75 chars (as per RFC 5545)
        return line.match(/.{1,75}/g).map((chunk, i) => (i === 0 ? chunk : ' ' + chunk)).join('\r\n');
    }

    static utcToLocalISOString(utcISOString) {
        const date = new Date(utcISOString);

        const pad = (num) => String(num).padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);   // months are 0-based
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    static findFirstMatchingWeekday(date, targetDays) {
        const dayMap = { 'MO': 1, 'TU': 2, 'WE': 3, 'TH': 4, 'FR': 5 };
        const targetDayNumbers = targetDays.map(day => dayMap[day]);

        let startDate = date;
        while (!targetDayNumbers.includes(startDate.getDay())) {
            startDate.setDate(startDate.getDate() + 1);
        }

        return startDate;
    }


    setTitle(title) {
        if (!title || typeof title !== 'string') {
            throw new Error('CalendarEventBuilder.setTitle: title must be a non-empty string');
        }
        this.#event_title = CalendarEventBuilder.formatICalString(title);
        return this;
    }

    setStartTime(startTime) {
        if (!(startTime instanceof Date) || isNaN(startTime)) {
            throw new Error('CalendarEventBuilder.setStartTime: startTime must be a valid Date object');
        }
        this.#start_time = startTime;
        return this;
    }

    setEndTime(endTime) {
        if (!(endTime instanceof Date) || isNaN(endTime)) {
            throw new Error('CalendarEventBuilder.setEndTime: endTime must be a valid Date object');
        }
        this.#end_time = endTime;
        return this;
    }

    setLocation(location) {
        if (!location || typeof location !== 'string') {
            throw new Error('CalendarEventBuilder.setLocation: location must be a non-empty string');
        }
        this.#location = CalendarEventBuilder.formatICalString(location);
        return this;
    }

    setDescription(description) {
        if (!description || typeof description !== 'string') {
            throw new Error('CalendarEventBuilder.setDescription: description must be a non-empty string');
        }
        this.#description = CalendarEventBuilder.formatICalString(description);
        return this;
    }

    setDays(days) {
        if (!Array.isArray(days) || days.some(day => typeof day !== 'string' || day.length !== 1)) {
            throw new Error('CalendarEventBuilder.setDays: days must be an array of single-character strings');
        }

        // translate to ical day
        this.#days = days.map(day => {
            switch (day) {
                case 'M': return 'MO';
                case 'T': return 'TU';
                case 'W': return 'WE';
                case 'R': return 'TH';
                case 'F': return 'FR';
                // y would you have classes on weekends
                default: throw new Error(`CalendarEventBuilder.setDays: invalid or non-supported day character '${day}'`);
            }
        })
        return this;
    }

    build() {
        // Adjust start time
        if (this.#days){
            this.#start_time = CalendarEventBuilder.findFirstMatchingWeekday(this.#start_time, this.#days);
        }
        const relative_end_time = new Date(this.#start_time);
        const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;
        relative_end_time.setHours(this.#end_time.getHours(), this.#end_time.getMinutes(), this.#end_time.getSeconds());
        return [
            'BEGIN:VEVENT',
            `SUMMARY:${this.#event_title}`,
            `DTSTAMP:${(new Date()).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            `UID:${crypto.randomUUID()}`,
            `DTSTART;TZID=${tzid}:${CalendarEventBuilder.utcToLocalISOString(this.#start_time.toISOString()).replace(/[-:]/g, '').split('.')[0]}`,
            `DTEND;TZID=${tzid}:${CalendarEventBuilder.utcToLocalISOString(relative_end_time.toISOString()).replace(/[-:]/g, '').split('.')[0]}`,
            `${this.#location ? `LOCATION:${this.#location}` : ''}`,
            `DESCRIPTION:${this.#description}`,
            `${this.#days ? `RRULE:FREQ=WEEKLY;BYDAY=${this.#days.join(',')};UNTIL=${CalendarEventBuilder.utcToLocalISOString(this.#end_time.toISOString()).replace(/[-:]/g, '').split('.')[0]}` : ''}`,
            'END:VEVENT'
        ].filter(line => line !== '')
            .join('\r\n');
    }
}

class CalendarBuilder {
    #events = [];
    addEvent(event) {
        event = event.trim();
        console.log(event);
        if (typeof event !== 'string' || !event.startsWith('BEGIN:VEVENT') || !event.endsWith('END:VEVENT')) {
            throw new Error('CalendarBuilder.addEvent: event must be a valid VEVENT string');
        }
        this.#events.push(event);
        return this;
    }

    build() {
        return [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'CALSCALE:GREGORIAN',
            ...this.#events,
            'END:VCALENDAR',
        ].filter(line => line !== '')
            .join('\r\n');
    }


}

module.exports = { CalendarEventBuilder, CalendarBuilder };