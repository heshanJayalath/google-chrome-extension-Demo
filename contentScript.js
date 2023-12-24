(() => {
    // accessing youtube player and controls
    let youtubeLeftControls, youtubePlayer;

    let currentVideo = "";
    let currentVideoBookmarks = [];

    // listen to that background.js message
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        //    desctructure the values that are getting from the obj
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded(); // call function that handle new video loaded
        }
    });

    // get all bookmarks
    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
            })
        })
    }

    // function that handle new video loaded
    const newVideoLoaded = async () => {
        // grab the first element with that classname
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        console.log(bookmarkBtnExists);

        // fetch bookmarks
        currentVideoBookmarks = await fetchBookmarks();
        // check bookmarkBtnExists 
        if (!bookmarkBtnExists) {
            // create image element that we are going to click on
            const bookmarkBtn = document.createElement("img");

            // pull the image which we are using in the youtube video
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            // add a class to make a dynamic youtube button class
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            // on hover to make a title on the page
            bookmarkBtn.title = "Click to bookmark current timestamp";

            // grab the youtube video player buttons from youtube
            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            // grab the toutube player as well
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            // append the button to the end of the youtube player left controls
            youtubeLeftControls.append(bookmarkBtn);
            // create a click function on 'bookmarkBtn' as 'addNewBookmarkEventHandler'
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    // addNewBookmarkEventHandler handler
    const addNewBookmarkEventHandler = async () => {
        // grab the current time from the youtube player in seconds
        const currentTime = youtubePlayer.currentTime;
        // create an object as newBookmark 
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime), //parse to getTime function
        };
        console.log(newBookmark);

        currentVideoBookmarks = await fetchBookmarks();

        // sync chrome storage with each bookmark
        chrome.storage.sync.set({
            // you have to store in JSON format in chrome storage and sort bookMark by time
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

    newVideoLoaded();
})();

// turn the seconds into standard hrs, minutes and seconds
const getTime = t => {
    var date = new Date(0);
    date.setSeconds(1);

    return date.toISOString().substr(11, 0);
}
