/**
 * CRUNCHYROLL CUSTOM VIDEO PLAYER CONTROLLER
 * Full HTML5 engine with Skip Intro, Next Episode Autoplay, Sub/Dub, & Keyboard Controls
 */

import { StorageService } from './storage.js';
import { getAnimeById } from './data.js';

export class VideoPlayer {
  constructor() {
    this.container = document.getElementById("player-container");
    this.video = document.getElementById("cr-video");
    this.overlay = document.getElementById("player-overlay");
    this.wrapper = document.getElementById("player-wrapper");

    // Controls
    this.playBtn = document.getElementById("player-play-btn");
    this.skipIntroBtn = document.getElementById("skip-intro-btn");
    this.backBtn = document.getElementById("player-back-btn");
    this.nextBtn = document.getElementById("player-next-btn");
    this.seekBackwardBtn = document.getElementById("player-seek-back-btn");
    this.seekForwardBtn = document.getElementById("player-seek-fwd-btn");
    this.volumeBtn = document.getElementById("player-volume-btn");
    this.volumeSlider = document.getElementById("player-volume-slider");
    this.fullscreenBtn = document.getElementById("player-fullscreen-btn");
    this.theaterBtn = document.getElementById("player-theater-btn");
    this.shortcutsBtn = document.getElementById("player-shortcuts-btn");

    // Seekbar
    this.seekbarContainer = document.getElementById("player-seekbar-container");
    this.seekbarProgress = document.getElementById("player-seekbar-progress");
    this.seekbarBuffered = document.getElementById("player-seekbar-buffered");
    this.seekbarThumb = document.getElementById("player-seekbar-thumb");
    this.seekTooltip = document.getElementById("player-seek-tooltip");

    // Time & Headers
    this.currentTimeDisplay = document.getElementById("player-current-time");
    this.durationDisplay = document.getElementById("player-duration");
    this.animeTitleEl = document.getElementById("player-anime-name");
    this.episodeTitleEl = document.getElementById("player-episode-info");

    // Popups & Overlays
    this.nextEpOverlay = document.getElementById("next-episode-overlay");
    this.nextEpCountdownEl = document.getElementById("next-ep-countdown");
    this.nextEpPlayNowBtn = document.getElementById("next-ep-play-now");
    this.nextEpCancelBtn = document.getElementById("next-ep-cancel");

    // Speed & Audio menus
    this.speedBtn = document.getElementById("player-speed-btn");
    this.speedMenu = document.getElementById("player-speed-menu");
    this.audioBtn = document.getElementById("player-audio-btn");
    this.audioMenu = document.getElementById("player-audio-menu");

    this.currentAnime = null;
    this.currentEpisode = null;
    this.isDragging = false;
    this.countdownTimer = null;
    this.inactivityTimeout = null;
    this.lastSavedTime = 0;

    this.initEvents();
  }

  initEvents() {
    if (!this.video) return;

    // Play / Pause
    this.playBtn?.addEventListener("click", () => this.togglePlay());
    this.video.addEventListener("click", () => this.togglePlay());

    // Video Time & Buffer Updates
    this.video.addEventListener("timeupdate", () => this.onTimeUpdate());
    this.video.addEventListener("progress", () => this.updateBuffer());
    this.video.addEventListener("loadedmetadata", () => this.onLoadedMetadata());
    this.video.addEventListener("ended", () => this.onVideoEnded());
    this.video.addEventListener("waiting", () => this.wrapper.classList.add("buffering"));
    this.video.addEventListener("playing", () => this.wrapper.classList.remove("buffering"));

    // Seekbar Interactions
    this.seekbarContainer?.addEventListener("click", (e) => this.seek(e));
    this.seekbarContainer?.addEventListener("mousemove", (e) => this.updateSeekTooltip(e));

    // Skip Intro
    this.skipIntroBtn?.addEventListener("click", () => {
      if (this.currentAnime && this.currentAnime.introEnd) {
        this.video.currentTime = this.currentAnime.introEnd;
        this.skipIntroBtn.classList.remove("visible");
      }
    });

    // 10s Skips
    this.seekBackwardBtn?.addEventListener("click", () => {
      this.video.currentTime = Math.max(0, this.video.currentTime - 10);
    });
    this.seekForwardBtn?.addEventListener("click", () => {
      this.video.currentTime = Math.min(this.video.duration || 0, this.video.currentTime + 10);
    });

    // Volume & Mute
    this.volumeBtn?.addEventListener("click", () => this.toggleMute());
    this.volumeSlider?.addEventListener("input", (e) => {
      this.video.volume = parseFloat(e.target.value);
      this.video.muted = false;
      this.updateVolumeIcon();
    });

    // Fullscreen & Theater
    this.fullscreenBtn?.addEventListener("click", () => this.toggleFullscreen());
    this.theaterBtn?.addEventListener("click", () => {
      document.body.classList.toggle("theater-mode");
    });

    // Back to view
    this.backBtn?.addEventListener("click", () => this.close());

    // Next Episode Buttons
    this.nextBtn?.addEventListener("click", () => this.playNextEpisode());
    this.nextEpPlayNowBtn?.addEventListener("click", () => {
      this.cancelCountdown();
      this.playNextEpisode();
    });
    this.nextEpCancelBtn?.addEventListener("click", () => this.cancelCountdown());

    // Inactivity hide controls
    this.wrapper?.addEventListener("mousemove", () => this.resetInactivityTimer());
    this.wrapper?.addEventListener("mouseleave", () => {
      if (!this.video.paused) {
        this.wrapper.classList.remove("user-active");
        this.wrapper.classList.add("cursor-hidden");
      }
    });

    // Speed selection
    this.speedBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.speedMenu?.classList.toggle("active");
      this.audioMenu?.classList.remove("active");
    });

    this.speedMenu?.querySelectorAll(".player-menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        const speed = parseFloat(e.target.dataset.speed || "1");
        this.video.playbackRate = speed;
        this.speedMenu.querySelectorAll(".player-menu-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        this.speedMenu.classList.remove("active");
      });
    });

    // Audio / Sub selection
    this.audioBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.audioMenu?.classList.toggle("active");
      this.speedMenu?.classList.remove("active");
    });

    this.audioMenu?.querySelectorAll(".player-menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        this.audioMenu.querySelectorAll(".player-menu-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        this.audioMenu.classList.remove("active");
      });
    });

    // Close menus on click outside
    document.addEventListener("click", () => {
      this.speedMenu?.classList.remove("active");
      this.audioMenu?.classList.remove("active");
    });

    // Global Keyboard Shortcuts
    document.addEventListener("keydown", (e) => this.handleKeypress(e));
  }

  loadEpisode(animeId, episodeId = 1) {
    const anime = getAnimeById(animeId);
    if (!anime) return;

    this.currentAnime = anime;
    const epNum = parseInt(episodeId, 10) || 1;
    const ep = anime.episodes.find(e => e.number === epNum) || anime.episodes[0];
    this.currentEpisode = ep;

    // Set UI labels
    if (this.animeTitleEl) this.animeTitleEl.textContent = anime.title;
    if (this.episodeTitleEl) {
      this.episodeTitleEl.textContent = `Episode ${ep.number}: ${ep.title}`;
    }

    // Set video source
    this.video.src = ep.videoUrl;
    this.container.classList.add("active");
    document.body.style.overflow = "hidden";

    // Resume from saved progress if available
    const saved = StorageService.getProgress(animeId, ep.id);
    if (saved && saved.currentTime > 5 && saved.currentTime < (saved.duration - 30)) {
      this.video.currentTime = saved.currentTime;
    } else {
      this.video.currentTime = 0;
    }

    this.cancelCountdown();
    this.video.play().catch(() => {});
    this.updatePlayState();
  }

  togglePlay() {
    if (this.video.paused || this.video.ended) {
      this.video.play();
    } else {
      this.video.pause();
    }
    this.updatePlayState();
  }

  updatePlayState() {
    const isPaused = this.video.paused;
    this.wrapper.classList.toggle("paused", isPaused);
    if (this.playBtn) {
      this.playBtn.innerHTML = isPaused ? 
        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>` : 
        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    }
  }

  onLoadedMetadata() {
    this.durationDisplay.textContent = this.formatTime(this.video.duration);
    this.updateSeekbar();
  }

  onTimeUpdate() {
    if (!this.video.duration) return;

    const cur = this.video.currentTime;
    const dur = this.video.duration;

    // Time text
    this.currentTimeDisplay.textContent = this.formatTime(cur);

    // Seekbar
    this.updateSeekbar();

    // Skip Intro button detection
    if (this.currentAnime && this.currentAnime.introStart && this.currentAnime.introEnd) {
      if (cur >= this.currentAnime.introStart && cur < this.currentAnime.introEnd) {
        this.skipIntroBtn?.classList.add("visible");
      } else {
        this.skipIntroBtn?.classList.remove("visible");
      }
    }

    // Save Progress every 5 seconds
    if (Math.abs(cur - this.lastSavedTime) > 5) {
      this.lastSavedTime = cur;
      if (this.currentAnime && this.currentEpisode) {
        StorageService.saveProgress(this.currentAnime.id, this.currentEpisode.id, this.currentEpisode.number, cur, dur);
      }
    }

    // End of episode countdown (10s before end)
    if (dur - cur <= 10 && dur > 30 && !this.countdownTimer && this.hasNextEpisode()) {
      this.startCountdown();
    }
  }

  updateSeekbar() {
    if (!this.video.duration) return;
    const percent = (this.video.currentTime / this.video.duration) * 100;
    if (this.seekbarProgress) this.seekbarProgress.style.width = `${percent}%`;
    if (this.seekbarThumb) this.seekbarThumb.style.left = `${percent}%`;
  }

  updateBuffer() {
    if (this.video.buffered.length > 0 && this.video.duration) {
      const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1);
      const percent = (bufferedEnd / this.video.duration) * 100;
      if (this.seekbarBuffered) this.seekbarBuffered.style.width = `${percent}%`;
    }
  }

  seek(e) {
    const rect = this.seekbarContainer.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.video.currentTime = pos * this.video.duration;
    this.updateSeekbar();
  }

  updateSeekTooltip(e) {
    const rect = this.seekbarContainer.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSec = pos * (this.video.duration || 0);
    this.seekTooltip.textContent = this.formatTime(targetSec);
    this.seekTooltip.style.left = `${pos * 100}%`;
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    this.updateVolumeIcon();
  }

  updateVolumeIcon() {
    const isMuted = this.video.muted || this.video.volume === 0;
    if (this.volumeBtn) {
      this.volumeBtn.innerHTML = isMuted ?
        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>` :
        `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.wrapper.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  hasNextEpisode() {
    if (!this.currentAnime || !this.currentEpisode) return false;
    return this.currentAnime.episodes.some(e => e.number === this.currentEpisode.number + 1);
  }

  playNextEpisode() {
    if (!this.hasNextEpisode()) return;
    const nextEp = this.currentAnime.episodes.find(e => e.number === this.currentEpisode.number + 1);
    if (nextEp) {
      this.loadEpisode(this.currentAnime.id, nextEp.number);
    }
  }

  startCountdown() {
    this.nextEpOverlay?.classList.add("visible");
    let secondsLeft = 5;
    if (this.nextEpCountdownEl) this.nextEpCountdownEl.textContent = secondsLeft;

    this.countdownTimer = setInterval(() => {
      secondsLeft--;
      if (this.nextEpCountdownEl) this.nextEpCountdownEl.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        this.cancelCountdown();
        this.playNextEpisode();
      }
    }, 1000);
  }

  cancelCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.nextEpOverlay?.classList.remove("visible");
  }

  onVideoEnded() {
    if (this.hasNextEpisode()) {
      this.playNextEpisode();
    }
  }

  resetInactivityTimer() {
    this.wrapper.classList.add("user-active");
    this.wrapper.classList.remove("cursor-hidden");
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      if (!this.video.paused) {
        this.wrapper.classList.remove("user-active");
        this.wrapper.classList.add("cursor-hidden");
      }
    }, 3500);
  }

  handleKeypress(e) {
    if (!this.container.classList.contains("active")) return;

    // Avoid triggering when user is typing in comments or input
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        this.togglePlay();
        break;
      case "ArrowLeft":
      case "j":
        e.preventDefault();
        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        break;
      case "ArrowRight":
      case "l":
        e.preventDefault();
        this.video.currentTime = Math.min(this.video.duration || 0, this.video.currentTime + 10);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.video.volume = Math.min(1, this.video.volume + 0.1);
        this.updateVolumeIcon();
        break;
      case "ArrowDown":
        e.preventDefault();
        this.video.volume = Math.max(0, this.video.volume - 0.1);
        this.updateVolumeIcon();
        break;
      case "f":
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case "m":
        e.preventDefault();
        this.toggleMute();
        break;
      case "s":
      case "i":
        if (this.skipIntroBtn?.classList.contains("visible")) {
          this.skipIntroBtn.click();
        }
        break;
      case "n":
        this.playNextEpisode();
        break;
      case "Escape":
        this.close();
        break;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  close() {
    this.video.pause();
    this.cancelCountdown();
    this.container.classList.remove("active");
    document.body.style.overflow = "";
  }
}
