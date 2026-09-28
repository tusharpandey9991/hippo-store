import LoginForm from "./LoginForm";
import './Navbar.css';
import logo from '../assets/logo.png';
import { useEffect, useState, useRef } from 'react';
import SignupForm from './SignupForm';
import ProfileModal from './ProfileModal';

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [forceShow, setForceShow] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showTrackInfo, setShowTrackInfo] = useState(false);
  const [trackIndex, setTrackIndex] = useState(null);





  // 🔊 Sound refs
  const hoverSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const musicTracks = [
    { name: "NEFFEX - Go!", url: "/sounds/NEFFEX - GO! .wav" },
    { name: "NEFFEX - Free Me", url: "/sounds/NEFFEX - FREE ME.wav" },
    { name: "ColdPlay: Hymn For The Weekend", url: "/sounds/Hymn For The Weekend.mp3" },
    { name: "Machine Gun Kelly ft. blackbear - my ex's best friend" , url:"/sounds/Machine Gun Kelly ft. blackbear - my ex's best friend.mp3"},
    { name: "NEFFEX - Never Gonna Stop", url: "/sounds/NEFFEX - Never gonna stop 2.0.wav" },
    { name: "NEFFEX - Back One Day", url: "/sounds/Back One Day (Final Master).mp3" },
    { name: "NEFFEX - Fight Back", url: "/sounds/Fight Back.mp3" },
    { name: "NEFFEX - Immortal", url: "/sounds/Immortal.wav" },
    { name: "NEFFEX - Life", url: "/sounds/Life.mp3" },
    { name: "NEFFEX - Villains and Hero", url: "/sounds/NEFFEX - Villains and Hero's (NEW M2).wav" },
    { name: "NEFFEX - Purpose M2", url: "/sounds/NEFFEX - Purpose M2 (1).wav" },
    { name: "NEFFEX - Grateful", url: "/sounds/NEFFEX - Grateful.mp3" },
    { name: "NEFFEX - Never Give Up", url: "/sounds/NEFFEX - Never Give Up.mp3" },
    { name: "NEFFEX - Careless", url: "/sounds/NEFFEX - Careless.mp3" }
  ];

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const musicRef = useRef(null);



  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrolledDown = currentScrollPos > prevScrollPos;

      if (currentScrollPos <= 0) {
        setHidden(false);
      } else if (!forceShow) {
        setHidden(scrolledDown);
      }

      setPrevScrollPos(currentScrollPos);
    };

    const handleMouseMove = (e) => {
      if (e.clientY <= 10) {
        setForceShow(true);
        setHidden(false);
      } else {
        setForceShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prevScrollPos, forceShow]);

  useEffect(() => {
    hoverSoundRef.current = new Audio('/sounds/hover.mp3');
    clickSoundRef.current = new Audio('/sounds/click.mp3');
    hoverSoundRef.current.volume = 0.5;
    clickSoundRef.current.volume = 0.6;
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      if (musicRef.current) {
        musicRef.current.pause();
      }
      setIsMusicPlaying(false);
      setShowTrackInfo(false);
    } else {
      const randomIndex = Math.floor(Math.random() * musicTracks.length);
      const selectedTrack = musicTracks[randomIndex];
      setCurrentTrack(selectedTrack);
      setIsMusicPlaying(true);
      setShowTrackInfo(true);

      // Create new audio instance
      const audio = new Audio(selectedTrack.url);
      audio.volume = 0.3;
      audio.play();
      musicRef.current = audio;

      // Auto-play next song when current ends
      audio.addEventListener("ended", () => {
        let nextIndex = Math.floor(Math.random() * musicTracks.length);
        while (nextIndex === randomIndex && musicTracks.length > 1) {
          nextIndex = Math.floor(Math.random() * musicTracks.length); // avoid repeat
        }

        const nextTrack = musicTracks[nextIndex];
        setCurrentTrack(nextTrack);
        const nextAudio = new Audio(nextTrack.url);
        nextAudio.volume = 0.3;
        nextAudio.play();
        musicRef.current = nextAudio;

        // Show new track info again
        setShowTrackInfo(true);
        setTimeout(() => setShowTrackInfo(false), 5000);

        // Attach the listener again
        nextAudio.addEventListener("ended", () => {
          toggleMusic(); // Recursively toggle to handle next
        });
      });

      // Fade out song info after 5s
      setTimeout(() => {
        setShowTrackInfo(false);
      }, 5000);
    }
  };




  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play();
    }
  };

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  const handleSignupSubmit = () => {
    setShowSignup(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleLoginSuccess = (userData) => {
    console.log("Setting user:", userData);
    setUser(userData);
    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
      setShowLoginForm(false);
    }, 2000);
  };

  return (
    <>
      <nav className={`navbar ${hidden ? 'navbar-hidden' : ''}`}>
        <div className="logo">
          <img src={logo} alt="Pregnant Hippo" className="logo-img" />
        </div>
        <ul className="nav-links">
          <li>
            <a href="#"
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a href="#"
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
              }}
            >
              Browse
            </a>
          </li>
          <li>
            <a href="#"
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                setShowLoginForm(true);
              }}
            >
              Login
            </a>
          </li>
          <li>
            <a href="#"
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                setShowSignup(true);
              }}
            >
              Sign Up
            </a>
          </li>
          <li>
            <a href="#"
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                setShowProfileModal(true);
              }}
            >
              Profile
            </a>
          </li>
          <li>
            <a href="#"
              onMouseEnter={playHoverSound}
              onClick={(e) => {
                e.preventDefault();
                playClickSound();
                toggleMusic();
              }}
              style={{ cursor: 'pointer' }}
            >
              {isMusicPlaying ? "🔊 Music On" : "🔇 Music Off"}
            </a>
          </li>

        </ul>
      </nav>
      {currentTrack && (
        <div className={`music-track-info enhanced-track-info ${showTrackInfo ? 'fade-in-animated' : 'fade-out-animated'}`}>
          <span className="music-icon">🎵</span>
          <span className="track-text">Now Playing:</span>{" "}
          <span className="track-name marquee">
            <span className="marquee-inner">{currentTrack.name}</span>
          </span>
        </div>
      )}




      {showSignup && (
        <SignupForm
          onClose={() => setShowSignup(false)}
          onSubmit={handleSignupSubmit}
        />
      )}

      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLogin={handleLoginSuccess}
        />
      )}

      {showNotification && (
        <div className="signup-notification">
          ✅ Signed up successfully!
        </div>
      )}

      {loginSuccess && (
        <div className="login-notification">
          ✅ Login Successfully
        </div>
      )}

      {showProfileModal && (
        <ProfileModal
          user={{
            username: "Hajime",
            email: "hajime@example.com",
            avatar: "/avatar.png",
            bio: "Lover of stealth games"
          }}
          wishlist={[
            { title: "Hitman 3" },
            { title: "Cyberpunk 2077" }
          ]}
          comments={[
            { text: "Awesome game!", rating: 5 },
            { text: "Loved the graphics.", rating: 4 }
          ]}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}

export default Navbar;
