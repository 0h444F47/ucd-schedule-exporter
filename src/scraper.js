if (!window?.location?.href || !window.location.href.startsWith("https://my.ucdavis.edu/schedulebuilder/")){
    alert("This bookmarklet only works on the UCD Schedule Builder page (https://my.ucdavis.edu/schedulebuilder/).");
    throw new Error("Not on UCD Schedule Builder page");
}

const courses = (() => {
    let course_list = [];
    let current_courses = schedule.currSched.get();
    let term = CourseDetails[[Object.keys(CourseDetails)[0]]].
        COURSE_MATERIALS_TERM;
    for (let crn in current_courses) {
        if (current_courses[crn].STORED_REGISTRATION_STATUS === "Registered") {
            let course_info = CourseDetails[crn];

            // grab the info i need and leave the rest
            course_list.push({
                'title': `${course_info.SUBJECT_CODE} ${course_info.COURSE_NUMBER} ${course_info.SECTION_NUMBER} - ${course_info.TITLE}`,
                'meetings': course_info.MEETINGS, // array of meeting objects
                'finalExamDate': course_info.FINAL_EXAM_STARTDATE,
                'dropDate': course_info.DROP_DATE,
                'allowedDropDesc': course_info.ALLOWED_DROP_DESC,
                'description': course_info.DESCRIPTION,
            })
        }
    }

    return {course_list, term};
})();

module.exports = { courses };
