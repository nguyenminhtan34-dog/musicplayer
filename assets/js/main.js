const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const progress = $("#progress");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const volumeSlider = $(".volume-slider");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: " Ái nộ 1",
      Singer: "Masew",
      path: "./assets/music/aino.mp3",
      image: "/assets/image/aino.jpg",
    },
    {
      name: " Unstoppable",
      Singer: "Sia",
      path: "./assets/music/music0.mp3",
      image: "/assets/image/img0.jpg",
    },
    {
      name: "Đời người anh em",
      Singer: "Đinh Đại Vũ, Black Bi",
      path: "./assets/music/music1.mp3",
      image: "/assets/image/img1.jpg",
    },
    {
      name: "Xa em remix",
      Singer: "Du Thiên",
      path: "./assets/music/music2.mp3",
      image: "/assets/image/img2.jpg",
    },
    {
      name: "Hương Hoa Phai Tàn",
      Singer: "H2K",
      path: "./assets/music/music3.mp3",
      image: "/assets/image/img3.jpg",
    },
    {
      name: "Độ tộc 2",
      Singer: "Masew, Pháo, Phúc Du, Phùng Thanh Độ",
      path: "./assets/music/music4.mp3",
      image: "/assets/image/img4.jpg",
    },
    {
      name: "Cưới thôi",
      Singer: "Masew, Biray, Tap",
      path: "./assets/music/CuoiThoi.mp3",
      image: "/assets/image/cuoithoi.jpg",
    },
    {
      name: "Câu hứa chưa vẹn trọn",
      Singer: "Phát Huy T4",
      path: "./assets/music/CauHuaChuaVenTron.mp3",
      image: "/assets/image/cauhuachuatronven.jpg",
    },
    {
      name: "Thê lương",
      Singer: "Phúc Chinh",
      path: "./assets/music/TheLuong.mp3",
      image: "/assets/image/theluong.jpg",
    },
    {
      name: "Dịu dàng em đến",
      Singer: "ERIK, NinjaZ",
      path: "./assets/music/DiuDangEmDen.mp3",
      image: "/assets/image/diudangemden.jpg",
    },
  ],

  Render: function () {
    var html = this.songs.map((song, index) => {
      return `
                            <div class="song ${
                              index === this.currentIndex ? "active" : ""
                            }">
                                  <div class="thumb" style="background-image: url('${
                                    song.image
                                  }')">
                                  </div>
                                  <div class="body">
                                  <h3 class="title">${song.name}</h3>
                                  <p class="author">${song.Singer}</p>
                                  </div>
                                  <div class="option">
                                  <i class="fas fa-ellipsis-h"></i>
                                  </div>
                              </div>
                    `;
    });

    const playList = $(".playlist");
    playList.innerHTML = html.join("");
    this.random_bg_color();
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  random_bg_color: function () {
    let hex = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
    ];
    let a;

    function populate(a) {
      for (let i = 0; i < 6; i++) {
        let x = Math.round(Math.random() * 14);
        let y = hex[x];
        a += y;
      }
      return a;
    }
    let Color1 = populate("#");
    let Color2 = populate("#");
    var angle = "to right";

    let gradient =
      "linear-gradient(" + angle + "," + Color1 + ", " + Color2 + ")";
    document.body.style.background = gradient;
    document.querySelector(".dashboard").style.background = gradient;
    document.querySelector(".active").style.background = gradient;
    playBtn.style.background = gradient;
  },
  handleEvent: function () {
    const CdWidth = cd.offsetWidth;
    // xử lý thay đôi kích thước CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = CdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / CdWidth;
    };
    // handle circular the cd-thumb
    const cdAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdAnimate.pause();

    // xử lý play and pause
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdAnimate.play();
    };
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdAnimate.pause();
    };

    // handle when progress of song change
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // handle when seek song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // handle when click next button
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.randomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.Render();
    };

    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.randomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.Render();
    };

    // handle when in random mode

    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // handle when the song is end
    audio.onended = function () {
      if (app.isRandom) {
        app.randomSong();
      } else {
        app.nextSong();
      }
      audio.play();
    };

    // handle when in repeat mode

    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
  },

  loadCurrentSong: function () {
    heading.innerText = `${this.currentSong.name}`;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    app.currentIndex++;
    if (app.currentIndex >= this.songs.length) {
      app.currentIndex = 0;
    }
    app.loadCurrentSong();
  },
  prevSong: function () {
    app.currentIndex--;
    if (app.currentIndex < 0) {
      app.currentIndex = this.songs.length - 1;
    }
    app.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * app.songs.length);
    } while (newIndex === app.currentIndex);
    this.currentIndex = newIndex;
    app.loadCurrentSong();
  },

  start: function () {
    this.handleEvent();
    this.defineProperties();
    this.loadCurrentSong();
    this.Render();
    this.random_bg_color();
  },
};

app.start();
