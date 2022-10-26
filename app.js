const wrapper = document.querySelector('.wrapper'),
musicImg= wrapper.querySelector('.img-area img'),
musicName= wrapper.querySelector('.song-details .name'),
musicArtist=wrapper.querySelector('.song-details .artist'),
mainAudio=wrapper.querySelector('#main-audio'),
playPauseBtn=wrapper.querySelector('.play-pause'),
prevBtn=wrapper.querySelector('#prev'),
nextBtn=wrapper.querySelector('#next'),
progressArea=wrapper.querySelector('.progress-area'), 
progressBar=wrapper.querySelector('.progress-bar'),
musicList=wrapper.querySelector('.music-list')
showMoreBtn=wrapper.querySelector('#more-music'),
hideMusicBtn=musicList.querySelector('#close');



let musicIndex= 1;

window.addEventListener('load', () => {
    loadMusic(musicIndex); //calling load music function once window
    playingNow(); 
} )

// load music function
function loadMusic(indexNumb) {
    musicName.innerText=allMusic[indexNumb -1].name; 
    musicArtist.innerText=allMusic[indexNumb -1].artist;
    musicImg.src=`${allMusic[indexNumb-1].img}`;
    mainAudio.src = `${allMusic[indexNumb-1].src}`;
}

function playMusic() {
    wrapper.classList.add('paused'); 
    playPauseBtn.querySelector('i').innerText="pause"; 
    mainAudio.play(); 
}

function pauseMusic() {
    wrapper.classList.remove('paused'); 
    playPauseBtn.querySelector('i').innerText="play_arrow"; 
    mainAudio.pause(); 
}

function nextMusic() {
    musicIndex++; 
    musicIndex> allMusic.length ? musicIndex =1 : musicIndex = musicIndex; 
    loadMusic(musicIndex); 
    playMusic(); 
}

function prevMusic() {
    musicIndex--; 
    musicIndex < 1?  musicIndex =allMusic.length : musicIndex = musicIndex; 
    loadMusic(musicIndex); 
    playMusic(); 
}


playPauseBtn.addEventListener('click', () => {
    const isMusicPaused=wrapper.classList.contains('paused');
    isMusicPaused ? pauseMusic() : playMusic();
})

nextBtn.addEventListener('click', () => {
    nextMusic(); 
});

prevBtn.addEventListener('click', () => {
    prevMusic(); 
})

mainAudio.addEventListener('timeupdate', (e) => {
   const currentTime=e.target.currentTime;
   const duration=e.target.duration;
   let progressWidth= (currentTime/duration)*100;
   progressBar.style.width=`${progressWidth}%`;

   let musicCurrentTime=wrapper.querySelector('.current'),
   musicDuration=wrapper.querySelector('.duration');

   mainAudio.addEventListener('loadeddata', () => {
    
    
    let audioDuration=mainAudio.duration;
    let totalMin=Math.floor(audioDuration/60); 
    let totalSec=Math.floor(audioDuration%60);
    if(totalSec<10) {
        totalSec=`0${totalSec}`;
    } 
    musicDuration.innerText=`${totalMin}:${totalSec}`;
}); 
    
    let currentMin=Math.floor(currentTime/60); 
    let currentSec=Math.floor(currentTime%60);
    if(currentSec<10) {
        currentSec=`0${currentSec}`;
    } 
    musicCurrentTime.innerText=`${currentMin}:${currentSec}`;
  
}); 

progressArea.addEventListener('click', (e) => {
    let progressWidthval=progressArea.clientWidth;
    let clickedOffSetX=e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime=(clickedOffSetX/progressWidthval) * songDuration;
    playMusic(); 
}); 

const repeatBtn= wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
    let getText=repeatBtn.innerText;
    switch(getText) {
        case 'repeat':
            repeatBtn.innerText='repeat_one'; 
            repeatBtn.setAttribute('title', 'Song looped');
            break; 
        case 'repeat_one':
            repeatBtn.innerText='shuffle';
            repeatBtn.setAttribute('title', 'Playback shuffle'); 
            break; 
        case 'shuffle':
            repeatBtn.innerText='repeat';
            repeatBtn.setAttribute('title', 'Playlist looped');
            break; 
    }
});

mainAudio.addEventListener('ended', () => {
    let getText=repeatBtn.innerText;
    switch(getText) {
        case 'repeat':
            nextMusic(); 
            break; 
        case 'repeat_one':
           mainAudio.currentTime=0; 
           loadMusic(musicIndex); 
           playMusic(); 
            break; 
        case 'shuffle':
            let randIndex= Math.floor((Math.random() * allMusic.length)+1); 
            do {
                randIndex= Math.floor((Math.random() * allMusic.length)+1); 
            } while(musicIndex==randIndex);
            musicIndex=randIndex; 
            loadMusic(musicIndex); 
            playMusic(); 
            break; 
    }
});


showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show'); 
})

hideMusicBtn.addEventListener('click', () => {
   showMoreBtn.click(); 
})


const ulTag=wrapper.querySelector('ul'); 

for(let i=0; i <allMusic.length; i++) {
    let liTag=`<li li-index="${i}">
        <div class="row">
            <span>${allMusic[i].name}</span>
            <p>${allMusic[i].artist}</p>
        </div>
        <audio class="${allMusic[i].src}" id="${allMusic[i].src}" src="${allMusic[i].src}"> </audio>
        <span id="${allMusic[i].src}" class="audio-duration"></span>
        </li>`; 
    ulTag.insertAdjacentHTML("beforeend", liTag); 

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    console.log(ulTag, liAudioDuration, liAudioTag)

    liAudioTag.addEventListener('loadeddata', () => {
        let audioDuration=mainAudio.duration;
        let totalMin=Math.floor(audioDuration/60); 
        let totalSec=Math.floor(audioDuration%60);
        if(totalSec<10) {
            totalSec=`0${totalSec}`;
        } 
        liAudioDuration.innerText=`${totalMin}:${totalSec}`;
    })
}


const allliTags= ulTag.querySelector('li');
function playingNow () {
for(let j=0; j<allliTags.length; j++) {
   
    if(allliTags[j].getAttribute('li-index')== musicIndex) {
        allliTags[j].classList.add('playing')
    }
    allliTags[j].setAttribute('onclick', 'clicked(this)');
} }; 


function clicked(el) {
    let getLiIndex=el.getAttribute('li-index');
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic(); 
    playngNow(); 
}