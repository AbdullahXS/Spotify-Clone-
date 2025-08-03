
let songs;
let currFolder;
function formatTime(seconds) {
    // Calculate minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if necessary
    minutes = minutes < 10 ? "0" + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Return the formatted time
    return minutes + ":" + remainingSeconds;
}

let currentsong = new Audio();
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    return songs
}


const playmusic = (track, pause = false) => {
    currentsong.src = `/${currFolder}/` + track
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {



    songs = await getSongs("songs/Hollywood")
    playmusic(songs[0], true)

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
                            <img class="filter" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Aspex</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="filter" src="play.svg" alt="">
                            </div> 
 </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    });
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg"
        }
        else {
            currentsong.pause();
            play.src = "play.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        let songtime = Math.trunc(currentsong.currentTime)
        let songlength = Math.trunc(currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(songtime)}/${formatTime(songlength)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    document.querySelector(".menu").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%";
    })

    prev.addEventListener("click", () => {
        currentsong.pause()
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })

}

main()
