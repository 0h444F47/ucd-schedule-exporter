# UCD Schedule Builder Exporter
Exports your current saved schedule on myucdavis schedule builder into an `.ics` file. 

### What this do?
The exported `.ics` file lets you import your lectures, discussions, and final exam times as calendar events into any sane and well-developed calendar app. Perfect for those that prefer all-in-one visibility.

### How this work?
Modular scripting with three components, scrape information from existing global javascript variables `CourseDetails` and `schedule`, convert into `.ics` appropriate format, and export the file via Blob. Uses `esbuild` to assemble all components into one script. Ran into some complications along the way that turned `src/ical-generator.js` into an unmanageable mess. Will perhaps yap more about functionality and design choices later.

### How use this?
Login to [UCD Schedule Builder](https://my.ucdavis.edu/schedulebuilder/index.cfm), open web console, and paste in the script content from `bookmarklet.js`.

Another sustainable option is to create a bookmarklet where you can easily export your schedule by clicking a bookmark.
1. Create a new bookmark (right click the [bookmark bar](https://support.google.com/chrome/answer/188842?hl=en&co=GENIE.Platform%3DDesktop)) and click `Add Page...`.
2. Give your bookmark a recognizable name and paste the following into the address section:
```js
javascript: <copy over the content from "bookmarklet.js">
```
3. Login to [UCD Schedule Builder](https://my.ucdavis.edu/schedulebuilder/index.cfm) and click the bookmark you just created to export calendar.
