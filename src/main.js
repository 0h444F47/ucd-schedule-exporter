const { courses: { course_list, term } } = require('./scraper.js');
const { CalendarBuilder, CalendarEventBuilder } = require('./ics-generator.js');

if (!window?.location?.href || !window.location.href.startsWith("https://my.ucdavis.edu/schedulebuilder/")) {
    alert("This bookmarklet only works on the UCD Schedule Builder page (https://my.ucdavis.edu/schedulebuilder/).");
    throw new Error("Not on UCD Schedule Builder page");
}

const ical = new CalendarBuilder();

for (let course of course_list) {
    // add course's events
    for (let meeting of course.meetings) {

        if (meeting.STARTTIME == null || meeting.ENDTIME == null) {
            console.warn(`Skipping meeting for course ${course.title} due to missing start or end time.`);
            continue;
        }

        ical.addEvent(
            new CalendarEventBuilder()
                .setTitle(course.title + ` (${meeting.TYPE})`)
                .setStartTime(meeting.STARTTIME)
                .setEndTime(meeting.ENDTIME)
                .setLocation(meeting.LOCATION)
                .setDescription(`Last date to drop: ${course.dropDate.toLocaleString().split(',')[0]}\n\n${course.description}`)
                .setDays(meeting.WEEKDAYS.split(','))
                .build()
        );
    }

    // add final exam
    if (course.finalExamDate != null) {
        ical.addEvent(
            new CalendarEventBuilder()
                .setTitle(course.title + ' (Final Exam)')
                .setStartTime(course.finalExamDate)
                .setEndTime(new Date(course.finalExamDate.getTime() + 2 * 60 * 60 * 1000)) // +2 hours
                .setDescription(`Final Exam for ${course.title}\n\n${course.description}`)
                .build()
        );
    }
}

// build calendar and export using Blob API
const icsContent = ical.build();
const blob = new Blob([icsContent], { type: 'text/calendar' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `ucd_schedule_${term.replace(' ', '_')}.ics`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);

console.log(`Exported ${course_list.length} courses for term ${term}`);
