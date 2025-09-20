// Source code snippet snatched from schedule.js
for (let crn in schedule.currSched.get()) {

    // loop through the meeting array and insert the info into the local meetings array
    for (let i = 0; i < CourseDetails[crn].MEETINGS.length; i++) {
        let currMeeting = CourseDetails[crn].MEETINGS[i];
        let currCRN = CourseDetails[crn].ID;
        let daysArray = currMeeting.WEEKDAYS.split(",");
        for (let j = 0; j < daysArray.length; j++) {
            if (
                typeof schedule.meetings[`${daysArray[j]}`] === 'undefined'
            ) {
                schedule.meetings[`${daysArray[j]}`] = {};
            }
            schedule.meetings[`${daysArray[j]}`][`${currCRN}`] = {
                'name': CourseDetails[crn].TITLE_SHORT,
                'startTime': currMeeting.STARTTIME,
                'endTime': currMeeting.ENDTIME
            };
        }
    }
}

/**
 * schedule.currSched.get() - weird crns
 * CourseDetails[0].MEETINGS - usually array with two objects, one lecture, one discussion
 * CourseDetails[0].DROP_DATE - last day to drop class, idk if i will include. maybe in description
 * CourseDetails[0].FINAL_EXAM_STARTDATE - final exam time, uh end time is probably +2 hours
 * CourseDetails[0].SUBJECT_CODE - the class subject, like ECS
 * CourseDetails[0].SECTION_NUMBER - trivial
 * CourseDetails[0].TITLE - title of the course
 * CourseDetails[0].COURSE_NUMBER - idk, more detailed subject code?
 * schedule.currSched.get()[crn].STORED_REGISTRATION_STATUS - I will only consider export for those with "Registered" status
 */

// MEETINGS object sample
const meeting_sample = {
    "TYPE": "Lecture", // Lecture or Discussion
    "TYPE_SHORT": "LEC", // LEC or DIS
    "LOCATION": "Teaching and Learning Complex 2010", // Location
    "BLDG_DESC": "Teaching and Learning Complex",
    "ROOM": "2010",
    "WEEKDAYS": "T,R", // Weekdays
    /* The dates is an interval for which this course is active.
    So like for this example, 09-24 to 12-05.

    That start and end "hours" represents daily class time, meaning
    for this class' lecture you meet on the specified weekdays
    from 19:10 to 21:30 (which I think is UTC?).
    */
    "STARTTIME": "YYYY-09-24T19:10:00.000Z",
    "ENDTIME": "YYYY-12-05T21:30:00.000Z"
};

// event title sample
const title_sample = `{CourseDetails[0].SUBJECT_CODE} {CourseDetails[0].COURSE_NUMBER} {CourseDetails[0].SECTION_NUMBER} - {CourseDetails[0].TITLE}`;

/* if ucd doesn't update the frontend logic, the script derived from this sample should continue to
work for the years to come.
*/