console.log("lets write javascript")

let currentSongs = new Audio();
let songs;
let currfolder;
function formatSeconds(seconds) {

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // Pad with leading zeros if necessary
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}


async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
        // show all the songs int the playlist 
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
         <div class="info">
          <div> ${song.replaceAll("%20", " ")}</div>
          <div>Mumtaj Khan</div>
         </div>
         <div class="playnow">
           <span>Play Now</span>
           <img class="invert" src="play.svg" alt="">
         </div> </li>`;
    }
    // attach an evenlisner to each song 
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    
    })
    return songs;
   
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/video83intvw/video84spotyfyPjt/songs/" +track)
    currentSongs.src = `/${currfolder}/` + track
    if (!pause) {
        currentSongs.play()
        play.src = "pause.svg"

    }
    // currentSongs.play()
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00 "
}
async function displayAkbums() {
      let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
   let anchors =  div.getElementsByTagName("a")
   let folder = []
  Array.from (anchors).forEach(async e=>{
   if(a.href.includes("/songs/")){
    let folder = e.href.split("/").slice(-2)[0]
    // Get the metadata of the folder
   
    let a = await fetchfetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
    let response = await  a.json();
    console.log(response)

   }
   })
    
}

async function main() {

    // get the list of all ongs
     await getSongs("songs/ncs")
    playMusic(songs[0], true)
// display all the album on the page


    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play()
            play.src = "pause.svg"
        }
        else {
            currentSongs.pause()
            play.src = "play.svg"
        }
    })
    // listen for timeupdate event
    currentSongs.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSongs.
            currentTime)}/${formatSeconds(currentSongs.duration)}`
        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.
            duration) * 100 + "%";

    })
    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.
            getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSongs.currentTime = ((currentSongs.duration) * percent) / 100
    })
    // add evenlistener for humburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add evenlistener for croxx 
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // add and evenlistener next and previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    // add and evenlistener next and previous
    next.addEventListener("click", () => {
        currentSongs.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add an even an volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/100")
      currentSongs.volume = parseInt(e.target.value)/100
    })
    // load the playlist whenever card is clicked
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
 })
  
   // add even listener mute the track
   document.querySelector(".volume>img").addEventListener("click", e=>{
  console.log(e.target)
  console.log("changing", e.target.src)
  if(e.target.src = ("volume.svg")){
    e.target.src = e.target.src.replace("volume.svg", "mute.svg")
    currentSongs.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
     e.target.src = e.target.src.replace("mute.svg", "volume.svg")
     currentSongs.volume = .10;
     document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

   })
   


}

main()