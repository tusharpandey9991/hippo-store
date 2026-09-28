import React, { useState } from 'react';
import './GameList.css';
import GameCard from './GameCard';
import GameModal from './GameModal';
import GameTrailerModal from './GameTrailerModal';
import CountdownTimer from './CountdownTimer';


function GameList() {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 50;

  const [sharedGames, setSharedGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedGames, setLikedGames] = useState([]);
  const [comments, setComments] = useState({});
  const [cartGames, setCartGames] = useState([]);
  const [notification, setNotification] = useState('');
  const [sortOption, setSortOption] = useState("default");
  const [currency, setCurrency] = useState("USD");
  const [upiNotification, setUpiNotification] = useState(null);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [upiSuccess, setUpiSuccess] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const [selectedGame, setSelectedGame] = useState(null);
  const [flippedCards, setFlippedCards] = useState([]);
  const totalPages = 5; // Update this dynamically when you add more pages later
  const [mutedVideos, setMutedVideos] = useState({});
  const [stoppedPreview, setStoppedPreview] = useState({});



  const toggleVideoMute = (title) => {
    setMutedVideos((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };



  const getYouTubeId = (url) => {
    try {
      const videoMatch = url.match(/(?:v=|youtu\.be\/)([^"&?/\s]{11})/);
      const timeMatch = url.match(/[?&](?:t|start)=([0-9hms]+)/); // support ?t= and &start=

      let startTime = 0;
      if (timeMatch) {
        const val = timeMatch[1];
        if (/^\d+$/.test(val)) {
          startTime = parseInt(val);
        } else {
          const h = /(\d+)h/.exec(val);
          const m = /(\d+)m/.exec(val);
          const s = /(\d+)s/.exec(val);
          startTime =
            (h ? parseInt(h[1]) * 3600 : 0) +
            (m ? parseInt(m[1]) * 60 : 0) +
            (s ? parseInt(s[1]) : 0);
        }
      }

      return {
        id: videoMatch ? videoMatch[1] : null,
        start: startTime,
      };
    } catch (err) {
      console.error("Invalid YouTube URL:", url);
      return { id: null, start: 0 };
    }
  };



  const getPageButtons = () => {
    const buttons = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      if (currentPage > 3) {
        buttons.push("...");
      }

      if (currentPage > 2 && currentPage < totalPages - 1) {
        buttons.push(currentPage - 1, currentPage, currentPage + 1);
      } else if (currentPage <= 3) {
        buttons.push(2, 3);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(totalPages - 2, totalPages - 1);
      }

      if (currentPage < totalPages - 2) {
        buttons.push("...");
      }

      buttons.push(totalPages);
    }

    return buttons;
  };

  const toggleFlip = (title, forceBack = false) => {
    setFlippedCards((prev) => {
      const shouldRemove = forceBack || prev.includes(title);
      if (shouldRemove) {
        setStoppedPreview((prevStopped) => ({
          ...prevStopped,
          [title]: true,
        }));
        setTimeout(() => {
          setStoppedPreview((prevStopped) => ({
            ...prevStopped,
            [title]: false,
          }));
        }, 100); // Delay helps React unmount the component
      }
      return shouldRemove ? prev.filter((t) => t !== title) : [...prev, title];
    });
  };

  const UPI_ID = "8968396576@ptsbi"; // 🔁 Replace with your real UPI ID
  const STORE_NAME = "Pregnant Hippo Store";

  const handleUPIPayment = (game) => {
    const rawPrice = parseFloat(game.price.toString().replace('$', ''));
    const discount = game.discount || 0;
    const finalPrice = discount > 0 ? rawPrice * (1 - discount / 100) : rawPrice;
    const amountInINR = Math.round(finalPrice * 80); // Example conversion

    const upiLink = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(STORE_NAME)}&am=${amountInINR}&cu=INR`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiLink).then(() => {
        setUpiNotification(`✅ UPI link copied! Pay ₹${amountInINR} using any UPI app.`);
        setTimeout(() => setUpiNotification(null), 4000);
      }).catch(() => {
        setUpiNotification(`⚠️ Could not copy. Manually copy this:\n${upiLink}`);
        setTimeout(() => setUpiNotification(null), 6000);
      });
    } else {
      setUpiNotification(`⚠️ Manual copy required:\n${upiLink}`);
      setTimeout(() => setUpiNotification(null), 6000);
    }
  };

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    JPY: "¥",
    GBP: "£",
    IRR: "﷼",
    ILS: "₪",
    RUB: "₽"

  };

  const exchangeRates = {
    INR: 85.62,
    USD: 1.00,
    EUR: 0.92,
    JPY: 143.74,
    GBP: 0.73,
    IRR: 42125.00,
    ILS: 3.38,
    RUB: 78.50
  };


  const toggleCart = (title) => {
    if (cartGames.includes(title)) {
      setCartGames(cartGames.filter((game) => game !== title));
    } else {
      setCartGames([...cartGames, title]);
      setNotification(`${title} added to cart`);
      setTimeout(() => setNotification(''), 5000); // ✅ hide after 5 seconds
    }
  };



  const addComment = (gameTitle, entry) => {
    setComments((prev) => ({
      ...prev,
      [gameTitle]: [...(prev[gameTitle] || []), entry]
    }));
  };


  const toggleLike = (title) => {
    setLikedGames((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };



  const shareGame = (game) => {
    const shareText = `Check out this game: ${game.title}`;
    navigator.clipboard.writeText(shareText);
    if (!sharedGames.includes(game.title)) {
      setSharedGames((prev) => [...prev, game.title]);
    }
  };

  const openModal = (game) => setSelectedGame(game);
  const closeModal = () => setSelectedGame(null);


  const games = [

    {
      title: "Elden Ring",
      description: "An epic open-world action RPG.",
      longDescription: "Explore the vast Lands Between in Elden Ring, a dark fantasy world filled with mysteries, grotesque creatures, and powerful bosses. Designed by FromSoftware and George R. R. Martin, embark on a journey through deadly dungeons and expansive plains in a non-linear narrative that rewards curiosity and mastery.",
      price: "$59.99",
      discount: 68,
      genre: "RPG",
      rating: "4.9",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
      trailer: "https://www.youtube.com/watch?v=E3Huy2cdih0",
      previewVideo: "https://youtu.be/OT8if6DXOFQ?t=99"
    },
    {
      title: "Cyberpunk 2077",
      description: "A futuristic action-adventure game.",
      longDescription: "Step into Night City, a cybernetic dystopia where body mods, megacorporations, and underworld dealings define survival. Play as V, a mercenary seeking immortality, in a vibrant open world filled with high-tech weaponry, dense lore, and impactful choices.",
      price: "$59.99",
      discountPrice: "$39.99",
      discountEndTime: "2025-07-08T18:00:00Z",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      trailer: "https://youtu.be/8X2kIfS6fb8",
      previewVideo: "https://youtu.be/O1tIQIp2vf0"
    },
    {
      title: "God of War",
      description: "Mythological combat and storytelling.",
      longDescription: "Witness the emotional tale of Kratos and Atreus in the Norse realms. With cinematic combat, breathtaking landscapes, and heartfelt storytelling, God of War redefines action-adventure with a balance of brutality and beauty.",
      price: "$49.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
      trailer: "https://www.youtube.com/watch?v=K0u_kAWLJOA",
      previewVideo: "https://youtu.be/1rJBP0jz95M?t=252"
    },
    {
      title: "Hogwarts Legacy",
      description: "Wizarding World open-world adventure.",
      longDescription: "Become a young witch or wizard in the 1800s wizarding world. Customize your wand, attend classes, and explore magical secrets hidden within Hogwarts and beyond. Shape your destiny in a story-rich environment steeped in magic.",
      price: "$54.99",
      discount: 43,
      discountEndTime: "2025-07-08T18:00:00Z",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg",
      trailer: "https://www.youtube.com/watch?v=BtyBjOW8sGY",
      previewVideo: "https://youtu.be/WS4qPq20aVo?t=410"
    },
    {
      title: "GTA V",
      description: "Crime sandbox masterpiece.",
      longDescription: "Live the criminal life in Los Santos with three distinct protagonists. Drive, shoot, heist, and explore a vast open world with freedom to cause chaos or climb the ladder of crime. GTA V combines storytelling and satire with addictive gameplay.",
      price: "$29.99",
      genre: "Action",
      rating: "4.7",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
      trailer: "https://www.youtube.com/watch?v=QkkoHAzjnUs",
      previewVideo: "https://youtu.be/N-xHcvug3WI?t=7"
    },
    {
      title: "Red Dead Redemption 2",
      description: "Outlaw life in a stunning world.",
      longDescription: "Ride into the sunset as Arthur Morgan, a conflicted outlaw in a dying Wild West. With rich character arcs, cinematic landscapes, and unmatched immersion, RDR2 is both a dramatic narrative and a dynamic open-world masterpiece.",
      price: "$69.99",
      discount: 100,
      discountEndTime: "2025-07-08T18:00:00Z",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
      trailer: "https://www.youtube.com/watch?v=eaW0tYpxyp0",
      previewVideo: "https://youtu.be/srUjOl_wBmU?t=8"
    },
    {
      title: "Resident Evil 4",
      description: "Remake of the survival horror classic.",
      longDescription: "Return to the iconic village in Resident Evil 4’s terrifying remake. Experience a refined combat system, haunting atmosphere, and improved visuals as you uncover the truth behind a biological threat and rescue the president’s daughter.",
      price: "$59.99",
      discountEndTime: "2025-07-08T18:00:00Z",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg",
      trailer: "https://youtu.be/j5Ic2z3_xp0",
      previewVideo: "https://youtu.be/eksbCmAfe18"
    },
    {
      title: "The Witcher 3",
      description: "Fantasy epic with monsters and magic.",
      longDescription: "Embark on a legendary journey as Geralt of Rivia. Hunt monsters, make morally grey decisions, and explore war-torn lands in one of the most critically acclaimed RPGs ever made. The Witcher 3 offers endless quests and deep storytelling.",
      price: "$19.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
      trailer: "https://www.youtube.com/watch?v=ehjJ614QfeM",
      previewVideo: "https://youtu.be/xx8kQ4s5hCY?t=42"
    },
    {
      title: "Assassin's Creed Valhalla",
      description: "Viking era action-adventure.",
      longDescription: "Forge your destiny as Eivor, a fierce Viking raider, during the conquest of England. Sail rivers, raid fortresses, and shape your settlement’s future in a world of myth and bloodshed. Embrace the Creed or defy it — the saga is yours.",
      price: "$59.99",
      discount: 38,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2208920/header.jpg",
      trailer: "https://www.youtube.com/watch?v=ssrNcwxALS4",
      previewVideo: "https://youtu.be/HlxqFV2IL6Q?t=47"
    },
    {
      title: "FIFA 23",
      description: "Top-tier football simulation.",
      longDescription: "Experience the pitch like never before in FIFA 23. With advanced physics, realistic animations, and global clubs and players, immerse yourself in dynamic matches, tournaments, and manager mode. Perfect your strategy and become the champion.",
      price: "$49.99",
      discount: 82,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1811260/header.jpg",
      trailer: "https://www.youtube.com/watch?v=o3V-GvvzjE4",
      previewVideo: "https://youtu.be/cgDlmvU2sA4?t=129"
    },

    {
      title: "Call of Duty: Modern Warfare II",
      description: "Fast-paced FPS warfare reboot.",
      longDescription: "Experience a gripping campaign and fast-paced multiplayer action in this reboot of the iconic franchise. Engage in tactical operations across global hotspots and use advanced weapons and gear to dominate the battlefield.",
      price: "$69.99",
      discount: 71,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg",
      trailer: "https://youtu.be/ztjfwecrY8E",
      previewVideo: "https://youtu.be/KurHR-5VmIw?t=33"
    },
    {
      title: "Forza Horizon 5",
      description: "Massive open-world racing.",
      longDescription: "Drive through the vibrant and ever-evolving open world of Mexico in the ultimate Horizon adventure. Race across deserts, jungles, and historic cities in hundreds of cars on dynamic roads with changing seasons and weather.",
      price: "$59.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
      trailer: "https://www.youtube.com/watch?v=FYH9n37B7Yw",
      previewVideo: "https://youtu.be/3pGgPrbdKaU?t=1"
    },
    {
      title: "Valorant",
      description: "Tactical 5v5 shooter.",
      longDescription: "Valorant blends precise gunplay with unique agent abilities in competitive 5v5 matches. Choose your agent and master both tactical skills and weapons to dominate the battlefield with strategic gameplay and teamwork.",
      price: "Free",
      image: "https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-7d279548324d3a3cbef40e1dc7e84994?resize=1&w=480&h=270&quality=medium",
      trailer: "https://www.youtube.com/watch?v=e_E9W2vsRbQ",
      previewVideo: "https://youtu.be/GCWkjdE8TQw?t=1"
    },
    {
      title: "League of Legends",
      description: "MOBA with epic champions.",
      longDescription: "Battle as powerful champions with unique abilities in intense 5v5 MOBA matches. Destroy enemy turrets, control objectives, and work with your team in the world’s most-played competitive game.",
      price: "Free",
      image: "https://media.altchar.com/prod/images/gm_article_promo_image/3a8e86701262-saint-league-of-legends.jpeg",
      trailer: "https://youtu.be/aR-KAldshAE",
      previewVideo: "https://youtu.be/p4QG59y6FGE?t=38"
    },
    {
      title: "Minecraft",
      description: "Endless block-building adventure.",
      longDescription: "Explore infinite worlds and build everything from simple homes to grand castles. Play in Creative mode with unlimited resources or mine deep in Survival mode, crafting tools and fending off mobs.",
      price: "$26.95",
      image: "https://assets.nintendo.com/image/upload/q_auto/f_auto/ncom/software/switch/70010000000964/a28a81253e919298beab2295e39a56b7a5140ef15abdb56135655e5c221b2a3a",
      trailer: "https://www.youtube.com/watch?v=MmB9b5njVbA",
      previewVideo: "https://youtu.be/BvPwKtAAJ_M?t=54"
    },
    {
      title: "Apex Legends",
      description: "Battle royale FPS.",
      longDescription: "Apex Legends is a squad-based battle royale where legendary characters with powerful abilities team up to fight for glory, fame, and fortune on the fringes of the Frontier.",
      price: "Free",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
      trailer: "https://www.youtube.com/watch?v=UMJb_mkqynU",
      previewVideo: "https://youtu.be/UPtoIy-oPWQ?t=70"
    },
    {
      title: "PUBG: Battlegrounds",
      description: "The original battle royale shooter.",
      longDescription: "Drop into a sprawling battleground, scavenge for gear, and survive to be the last one standing in this intense, strategic shooter that started the battle royale craze.",
      price: "Free",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
      trailer: "https://www.youtube.com/watch?v=u1oqfdhXKTo",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/movie480.webm"
    },
    {
      title: "Counter-Strike 2",
      description: "The legendary competitive shooter.",
      longDescription: "A competitive FPS that pits teams of terrorists and counter-terrorists against each other in fast-paced, strategic matches. Counter-Strike 2 brings improved graphics and mechanics to this classic.",
      price: "Free",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
      trailer: "https://www.youtube.com/watch?v=iHj82otCi7U",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/movie480.webm"
    },
    {
      title: "DOTA 2",
      description: "The most competitive MOBA ever.",
      longDescription: "Step into the competitive world of DOTA 2, where two teams of five heroes battle to destroy each other’s Ancient. Master unique heroes and complex strategies in one of the most rewarding esports games.",
      price: "Free",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
      trailer: "https://www.youtube.com/watch?v=-cSFPIwMEq4",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/movie480.webm"
    },
    {
      title: "Fortnite",
      description: "Colorful battle royale with building.",
      longDescription: "Jump into Fortnite, a fast-paced battle royale that combines shooting, building, and constant surprises. Team up, build defenses, and outlast the competition in style.",
      price: "Free",
      image: "https://mobilefreetoplay.com/wp-content/uploads/2018/04/deconstructing-fortnite-a-deeper-look-at-the-battle-pass-uncategorised.jpg",
      trailer: "https://www.youtube.com/watch?v=2gUtfBmw86Y",
      previewVideo: "https://media.fortniteapi.io/videos/Fortnite_Chapter3.mp4"
    },

    {
      title: "Battlefield 2042",
      description: "All-out warfare FPS.",
      longDescription: "Step into the near-future with Battlefield 2042, where massive multiplayer warfare returns with dynamic weather systems, futuristic weapons, and all-out chaos. Fight in massive battles with up to 128 players.",
      price: "$49.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1517290/header.jpg",
      trailer: "https://www.youtube.com/watch?v=ASzOzrB-a9E",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1517290/movie480.webm"
    },
    {
      title: "Far Cry 6",
      description: "Revolution in a fictional Caribbean island.",
      longDescription: "Welcome to Yara, a tropical paradise frozen in time under a dictatorship. Play as Dani Rojas, a local guerrilla fighter aiming to liberate the nation using powerful weapons and explosive action.",
      price: "$59.99",
      discount: 15,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2369390/header.jpg",
      trailer: "https://www.youtube.com/watch?v=dr89pmKrqkI",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/2369390/movie480.webm"
    },
    {
      title: "Watch Dogs: Legion",
      description: "Hack your way through London.",
      longDescription: "Build a resistance from anyone you see as you fight to reclaim London in a near-future dystopia. With advanced hacking, drone warfare, and stealth mechanics, your revolution is in your hands.",
      price: "$59.99",
      discount: 23,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2239550/header.jpg",
      trailer: "https://www.youtube.com/watch?v=rNZwK7JlqgI",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/2239550/movie480.webm"
    },
    {
      title: "Tomb Raider",
      description: "Lara Croft’s origin story.",
      longDescription: "Witness the rise of Lara Croft as she becomes the legendary Tomb Raider. Survive deadly jungles, ancient tombs, and ruthless enemies in this gritty origin story packed with action and discovery.",
      price: "$19.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/203160/header.jpg",
      trailer: "https://www.youtube.com/watch?v=5kH0KAFmFZs",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/203160/movie480.webm"
    },
    {
      title: "Hitman 3",
      description: "Stealth assassination sandbox.",
      longDescription: "Become Agent 47 in the dramatic conclusion to the World of Assassination trilogy. Plan and execute the perfect hit using disguises, gadgets, and your environment in intricate, replayable missions.",
      price: "$59.99",
      discount: 60,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/header.jpg",
      trailer: "https://www.youtube.com/watch?v=3VbhkXL0iNQ",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/movie480.webm"
    },
    {
      title: "NBA 2K24",
      description: "Basketball redefined.",
      longDescription: "Experience realistic basketball simulation with improved MyCareer, online play, and the return of MyTeam. NBA 2K24 offers an authentic experience for fans and newcomers alike.",
      price: "$69.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2445430/header.jpg",
      trailer: "https://www.youtube.com/watch?v=kmkpsKnBAhQ",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/2445430/movie480.webm"
    },
    {
      title: "WWE 2K23",
      description: "Wrestling at its best.",
      longDescription: "Step into the ring with WWE 2K23, featuring enhanced gameplay, new match types, and updated rosters. Showcase your favorite wrestlers or rise through the ranks with your custom superstar.",
      price: "$59.99",
      discount: 39,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1942660/header.jpg",
      trailer: "https://www.youtube.com/watch?v=aGr0H5a6Zqk",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1942660/movie480.webm"
    },
    {
      title: "Stray",
      description: "Cyberpunk cat adventure.",
      longDescription: "Roam a decaying cybercity as a lost cat, solving puzzles and uncovering secrets with your robotic companion. Stray is a unique adventure told through the eyes of a feline outsider.",
      price: "$29.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/header.jpg",
      trailer: "https://www.youtube.com/watch?v=4uO-2X1pB9c",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/movie480.webm"
    },
    {
      title: "Hades",
      description: "Rogue-like dungeon crawler.",
      longDescription: "Battle your way out of the Underworld as Zagreus, the son of Hades. This rogue-like features fast-paced combat, rich storytelling, and a dynamic progression system with every escape attempt.",
      price: "$24.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
      trailer: "https://www.youtube.com/watch?v=91sfrSlx4Co",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/movie480.webm"
    },

    {
      title: "Stardew Valley",
      description: "Farming meets friendship.",
      longDescription: "Escape to the countryside in Stardew Valley. Restore your grandfather's old farm, befriend townsfolk, raise animals, grow crops, explore mysterious caves, and build the life you dream of — all at your pace.",
      price: "$14.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
      trailer: "https://www.youtube.com/watch?v=ot7uXNQskhs",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/movie480.webm"
    },
    {
      title: "Celeste",
      description: "Challenging pixel platformer.",
      longDescription: "Help Madeline survive her journey to the top of Celeste Mountain in this precise and heartfelt platformer. Discover deep emotional storytelling and tight controls that reward mastery.",
      price: "$19.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg",
      trailer: "https://www.youtube.com/watch?v=ioalHpGbw5Y",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/movie480.webm"
    },
    {
      title: "Hollow Knight",
      description: "Haunting underground metroidvania.",
      longDescription: "Descend into the vast, ruined kingdom of Hallownest. Battle corrupted creatures, discover hidden secrets, and forge your own path through a beautifully hand-drawn world filled with peril and wonder.",
      price: "$14.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
      trailer: "https://www.youtube.com/watch?v=UAO2urG23S4",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/movie480.webm"
    },
    {
      title: "Rocket League",
      description: "Soccer with cars.",
      longDescription: "Rocket League combines high-octane racing and competitive soccer. Choose your ride, customize it, and engage in thrilling matches with incredible aerials and team tactics.",
      price: "Free",
      image: "https://britishesports.org/wp-content/uploads/rocket-league-switch-hero.jpg",
      trailer: "https://www.youtube.com/watch?v=omc1bp8Pxz0",
      previewVideo: "https://cdn.akamai.steamstatic.com/steam/apps/252950/movie480.webm"
    },
    {
      title: "Terraria",
      description: "2D sandbox adventure.",
      longDescription: "Dig, build, fight, and explore in this action-packed 2D sandbox game. Create your own world, defeat mighty bosses, and discover treasures hidden underground in a pixel-perfect adventure.",
      price: "$9.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg",
      trailer: "https://www.youtube.com/watch?v=6mT6Rw1F9n4",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/movie480.webm"
    },
    {
      title: "Baldur's Gate 3",
      description: "RPG with rich narrative.",
      longDescription: "Forge your story in the Forgotten Realms. Choose your companions and shape your destiny in a cinematic, D&D-based RPG with deep characters, branching dialogue, and tactical combat.",
      price: "$59.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
      trailer: "https://www.youtube.com/watch?v=1O6Qstncpnc",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/movie480.webm"
    },
    {
      title: "The Sims 4",
      description: "Live your virtual life.",
      longDescription: "Create and control people in a virtual world where you can build homes, pursue careers, fall in love, raise families, and shape the lives of your Sims with endless customization.",
      price: "Free",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/header.jpg",
      trailer: "https://www.youtube.com/watch?v=RrgB2T_Y3NM",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/movie480.webm"
    },
    {
      title: "ARK: Survival Evolved",
      description: "Tame dinosaurs, survive.",
      longDescription: "Awaken on a mysterious island and survive against dinosaurs, natural hazards, and other players. Build, tame, and explore in this massive open-world survival adventure.",
      price: "Free",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/346110/header.jpg",
      trailer: "https://www.youtube.com/watch?v=aQM8yWoiy5s",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/346110/movie480.webm"
    },
    {
      title: "Sea of Thieves",
      description: "Pirate multiplayer adventure.",
      longDescription: "Become a pirate legend in this open-world multiplayer adventure. Sail with friends, seek treasure, and battle enemies on the high seas in an ever-evolving world of exploration.",
      price: "$39.99",
      discount: 82,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg",
      trailer: "https://www.youtube.com/watch?v=r5JIBaasuE8",
      previewVideo: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/movie480.webm"
    },
    {
      title: "Dead by Daylight",
      description: "Survival horror multiplayer.",
      longDescription: "A 4v1 horror experience where one player becomes the killer and the others must escape a terrifying, procedurally generated environment. Will you survive the night or become the next victim?",
      price: "$19.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg",
      trailer: "https://youtu.be/JGhIXLO3ul8",
      previewVideo: "https://youtu.be/UcOQqeKaBsk?t=14"
    },
    {
      title: "It Takes Two",
      description: "Co-op action adventure.",
      longDescription: "Embark on a fantastical co-op journey through the eyes of a couple navigating a fractured relationship. Solve puzzles, explore imaginative worlds, and experience storytelling like never before.",
      price: "$39.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg",
      trailer: "https://www.youtube.com/watch?v=ohClxMmNLQQ",
      previewVideo: "https://youtu.be/sW-lpUtSGdo?t=521"
    },

    {
      title: "Portal 2",
      description: "Puzzle masterpiece.",
      longDescription: "Return to the Aperture Science facility for a mind-bending co-op and single-player experience filled with witty writing, physics-based puzzles, and the iconic GLaDOS. Portal 2 expands the formula in every way.",
      price: "$9.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg",
      trailer: "https://www.youtube.com/watch?v=tax4e4hBBZc",
      previewVideo: "https://youtu.be/aySPmEBzlS4?t=1242"
    },
    {
      title: "Left 4 Dead 2",
      description: "Co-op zombie shooter.",
      longDescription: "Fight your way through the infected South with up to three friends in this action-packed co-op zombie FPS. Use melee weapons, guns, and teamwork to survive relentless hordes and special infected.",
      price: "$9.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/550/header.jpg",
      trailer: "https://www.youtube.com/watch?v=9XIle_kLHKU",
      previewVideo: "https://youtu.be/-7pYKsf-V5A?t=190"
    },
    {
      title: "The Forest",
      description: "Survival horror in woods.",
      longDescription: "After a plane crash, survive in a mysterious forest inhabited by cannibalistic mutants. Build shelter, craft tools, and uncover dark secrets while searching for your missing son.",
      price: "$19.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/242760/header.jpg",
      trailer: "https://www.youtube.com/watch?v=4qTtVMM3uqQ",
      previewVideo: "https://youtu.be/cLN6QOX6gTY?t=522"
    },
    {
      title: "Don't Starve",
      description: "Survival with a twist.",
      longDescription: "Play as Wilson, a gentleman scientist trapped in a strange world. Gather resources, battle nightmarish creatures, and maintain your sanity in a stylish, hand-drawn world where death is permanent.",
      price: "$9.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/219740/header.jpg",
      trailer: "https://youtu.be/fXP4_2qRHng",
      previewVideo: "https://youtu.be/m9-Wjz_Gn-8?t=60"
    },
    {
      title: "Rust",
      description: "Survive against all odds.",
      longDescription: "In a brutal open-world survival MMO, start naked with a rock and build your way to dominance. Craft gear, build bases, raid others, and stay alive against players and nature.",
      price: "$39.99",
      discount: 54,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",
      trailer: "https://youtu.be/LGcECozNXEw",
      previewVideo: "https://youtu.be/02G130X3b3s?t=1"
    },
    {
      title: "Phasmophobia",
      description: "Ghost hunting horror co-op.",
      longDescription: "A chilling co-op experience where you and your team investigate haunted locations. Use ghost-hunting equipment, track paranormal activity, and survive terrifying encounters from beyond the grave.",
      price: "$13.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg",
      trailer: "https://youtu.be/sRa9oeo5KiY",
      previewVideo: "https://youtu.be/bz4MuYw8FBA?t=51"
    },
    {
      title: "Metro Exodus",
      description: "Post-apocalyptic FPS survival.",
      longDescription: "Travel across post-nuclear Russia aboard the Aurora. In this narrative-driven shooter, combine stealth, combat, and exploration across seasons while battling mutants and human threats alike.",
      price: "$39.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/412020/header.jpg",
      trailer: "https://youtu.be/fbbqlvuovQ0",
      previewVideo: "https://youtu.be/L_LpGTtCzbw"
    },
    {
      title: "Control",
      description: "Supernatural action thriller.",
      longDescription: "Play as Jesse Faden, the new Director of the Federal Bureau of Control. Harness supernatural powers and a shape-shifting weapon to uncover secrets in a mind-bending, mysterious skyscraper.",
      price: "$39.99",
      discount: 100,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg",
      trailer: "https://youtu.be/PT5yMfC9LQM",
      previewVideo: "https://youtu.be/PB6AhqOOOoU"
    },
    {
      title: "Dishonored 2",
      description: "Stealth powers and revenge.",
      longDescription: "Choose your path as Emily or Corvo in this stealth-action game. Use supernatural abilities to eliminate targets or sneak past them in a world steeped in magic and betrayal.",
      price: "$29.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/403640/header.jpg",
      trailer: "https://youtu.be/32LDc_66r5U",
      previewVideo: "https://youtu.be/366P5JjdO0g?t=1"
    },
    {
      title: "Little Nightmares II",
      description: "Dark whimsical horror puzzle.",
      longDescription: "Step into the shoes of Mono, a boy trapped in a distorted world. Team up with Six to uncover dark secrets and survive terrifying, oversized foes in this eerie adventure.",
      price: "$29.99",
      discount: 30,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/860510/header.jpg",
      trailer: "https://youtu.be/AI9zBBTyX-E",
      previewVideo: "https://youtu.be/cgdClImuxI4?t=185"
    },
    {
      title: "Sekiro: Shadows Die Twice",
      description: "Stealth-action adventure.",
      longDescription: "In Sekiro: Shadows Die Twice you are the 'one-armed wolf', a disgraced and disfigured warrior rescued from the brink of death. Explore late 1500s Sengoku Japan as you face off against larger than life foes.",
      price: "$59.99",
      discount: 50,
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg",
      trailer: "https://www.youtube.com/watch?v=rXMX4YJ7Lks",
      previewVideo: "https://youtu.be/a2TjEl0l_FU?t=39"
    },
    {
      title: "Ghost of Tsushima",
      description: "Samurai open-world adventure.",
      longDescription: "In the late 13th century, a Mongol empire invades Tsushima. As one of the last surviving samurai, Jin Sakai must set aside traditions to wage an unconventional war for the freedom of Japan.",
      price: "$59.99",
      discount: 30,
      image: "https://helios-i.mashable.com/imagery/articles/00iMVz5oU69RK9UEoPsZTMW/hero-image.fill.size_1248x702.v1623390188.jpg",
      trailer: "https://www.youtube.com/watch?v=iqysmS4lxwQ",
      previewVideo: "https://youtu.be/nVhXp6FX7Y4?t=66"
    },
    {
      title: "Marvel's Spider-Man Remastered",
      description: "Superhero open-world adventure.",
      longDescription: "In Marvel’s Spider-Man Remastered, the worlds of Peter Parker and Spider-Man collide in an original action-packed story.",
      price: "$59.99",
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg",
      trailer: "https://www.youtube.com/watch?v=mrT5q5xXb7Y",
      previewVideo: "https://youtu.be/fAnIUbnOekA?t=35"
    }

  ];
  const filteredGames = games
    .filter((game) =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((game) => {
      const priceStr = game.price?.toString().toLowerCase();
      const isDefaultFree = priceStr === "free" && (!game.discount || game.discount === 0);
      const isDiscountedFree = game.discount === 100;

      if (sortOption === "highestRated" || sortOption === "lowestRated") {
        const entries = comments[game.title] || [];
        return entries.some((e) => e.rating);
      }

      if (sortOption === "free") {
        return isDefaultFree || isDiscountedFree;
      }

      if (sortOption === "lowToHigh" || sortOption === "highToLow") {
        return !isDefaultFree; // exclude default free games
      }

      if (sortOption === "discount") {
        return typeof game.discount === "number" && game.discount > 0;
      }

      return true;
    })
    .sort((a, b) => {
      const getPrice = (g) => {
        const price = g.price?.toLowerCase?.() === "free" ? 0 : parseFloat(g.price.replace('$', ''));
        const discount = g.discount || 0;
        return price * (1 - discount / 100);
      };

      const getAverageRating = (title) => {
        const entries = comments[title] || [];
        const rated = entries.filter((e) => e.rating);
        if (!rated.length) return 0;
        const total = rated.reduce((sum, e) => sum + Number(e.rating), 0);
        return total / rated.length;
      };

      if (sortOption === "az") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "za") {
        return b.title.localeCompare(a.title);
      } else if (sortOption === "lowToHigh") {
        return getPrice(a) - getPrice(b);
      } else if (sortOption === "highToLow") {
        return getPrice(b) - getPrice(a);
      } else if (sortOption === "discount") {
        return (b.discount || 0) - (a.discount || 0);
      } else if (sortOption === "highestRated") {
        return getAverageRating(b.title) - getAverageRating(a.title);
      } else if (sortOption === "lowestRated") {
        return getAverageRating(a.title) - getAverageRating(b.title);
      }

      return 0;
    });


  return (
    <div className="page-wrapper">
      {/* Background */}
      <div className="background-slider">
        <img className="bg-image" src="/images/b1.jpg" alt="bg1" />
        <img className="bg-image" src="/images/b2.png" alt="bg2" />
        <img className="bg-image" src="/images/b3.jpg" alt="bg3" />
        <img className="bg-image" src="/images/b4.png" alt="bg4" />
        <img className="bg-image" src="/images/b5.png" alt="bg5" />
        <img className="bg-image" src="/images/b6.jpg" alt="bg6" />
        <img className="bg-image" src="/images/b7.jpg" alt="bg7" />
        <img className="bg-image" src="/images/b8.jpg" alt="bg8" />
        <img className="bg-image" src="/images/b9.jpg" alt="bg9" />
        <img className="bg-image" src="/images/b10.jpg" alt="bg10" />
        <img className="bg-image" src="/images/b1.jpg" alt="bg1" />
        <img className="bg-image" src="/images/b2.png" alt="bg2" />
      </div>

      <div className="content-wrapper">
        {notification && (
          <div className="notification-bar show">
            <span className="cart-icon">🛒</span> {notification}
          </div>
        )}

        <div className="toolbar-row">
          <div className="left-controls">
            <div className="sort-container">
              <div className="sort-wrapper">
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">Relevant</option>
                  <option value="highToLow">💰 Price: High to Low</option>
                  <option value="lowToHigh">💲 Price: Low to High</option>
                  <option value="discount">🔥 Discount %</option>
                  <option value="free">🆓 Free Games</option>
                  <option value="highestRated">🌟 Highest Rated</option>
                  <option value="lowestRated">⭐ Lowest Rated</option>
                  <option value="az">🔤 Title: A to Z</option>
                  <option value="za">🔡 Title: Z to A</option>
                </select>
              </div>
            </div>
          </div>
          <div className="center-controls">
            <div className="search-container toolbar-search beautified-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input beautified"
              />
              {/* Clear Button */}
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm("")} title="Clear search">
                  ❌
                </button>
              )}
              {/* Voice Assistant Button */}
              <button
                className="voice-btn"
                onClick={() => {
                  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                  recognition.lang = "en-US";
                  recognition.interimResults = false;
                  recognition.maxAlternatives = 1;

                  recognition.onresult = (event) => {
                    const spokenText = event.results[0][0].transcript;
                    setSearchTerm(spokenText);
                  };

                  recognition.onerror = (event) => {
                    console.error("Speech recognition error", event.error);
                  };

                  recognition.start();
                }}
                title="Search by Voice"
              >
                🎤
              </button>
            </div>
          </div>


          <div className="right-controls">
            <div className="currency-toggle-container fadeInDrop">
              <button
                className={`currency-toggle ${showCurrencyMenu ? "expanded" : ""}`}
                onClick={() => setShowCurrencyMenu((prev) => !prev)}
              >
                {currencySymbols[currency]} {showCurrencyMenu ? "▲" : "▼"}
              </button>

              {showCurrencyMenu && (
                <div className="currency-menu">
                  <button onClick={() => { setCurrency("INR"); setShowCurrencyMenu(false); }}>₹ INR</button>
                  <button onClick={() => { setCurrency("USD"); setShowCurrencyMenu(false); }}>$ USD</button>
                  <button onClick={() => { setCurrency("EUR"); setShowCurrencyMenu(false); }}>€ EUR</button>
                  <button onClick={() => { setCurrency("JPY"); setShowCurrencyMenu(false); }}>¥ JPY</button>
                  <button onClick={() => { setCurrency("GBP"); setShowCurrencyMenu(false); }}>£ GBP</button>
                  <button onClick={() => { setCurrency("IRR"); setShowCurrencyMenu(false); }}>﷼ IRR</button>
                  <button onClick={() => { setCurrency("ILS"); setShowCurrencyMenu(false); }}>₪ ILS</button>
                  <button onClick={() => { setCurrency("RUB"); setShowCurrencyMenu(false); }}>₽ RUB</button>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="game-list">
          {((sortOption === "highestRated" || sortOption === "lowestRated") && filteredGames.length === 0) ? (
            <div className="no-ratings-msg">
              <p>😅 Oops! No games have been rated yet.</p>
              <p>🌟 Be the first one to leave a rating and help others!</p>
            </div>
          ) : (
            (() => {
              const startIndex = (currentPage - 1) * gamesPerPage;
              const endIndex = startIndex + gamesPerPage;
              const gamesToShow = filteredGames.slice(startIndex, endIndex);

              if (gamesToShow.length === 0) {
                return (
                  <div className="no-ratings-msg">
                    <p>🎮 More games are not added yet.</p>
                    <p>🕹️ Stay tuned for upcoming releases!</p>
                  </div>
                );
              }

              return gamesToShow.map((game, index) => {
                const isFlipped = flippedCards.includes(game.title);

                return (
                  <div
                    key={index}
                    className={`game-card-wrapper ${isFlipped ? 'flipped' : ''}`}
                    onMouseLeave={() => {
                      if (isFlipped) {
                        setTimeout(() => toggleFlip(game.title, true), 1500);
                      }
                    }}
                  >
                    <div className="game-card-inner">
                      {/* FRONT SIDE */}
                      <div className="game-card front">
                        <div className="image-wrapper">
                          <img src={game.image} alt={game.title} />
                          <button
                            className="rate-comment-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(game);
                            }}
                            title="Rate the game"
                          >
                            ⭐
                          </button>
                        </div>
                        <h3>{game.title}</h3>

                        <p>{game.description}</p>

                        <p className="price">
                          {(() => {
                            const isFreeString = typeof game.price === "string" && game.price.toLowerCase() === "free";
                            const isDiscounted = typeof game.discount === "number" && game.discount > 0;
                            const rawPrice = parseFloat(game.price.toString().replace(/\$/g, ""));
                            const rate = exchangeRates[currency];
                            const symbol = currencySymbols[currency];

                            if (isDiscounted && game.discount === 100) {
                              return (
                                <>
                                  <span className="original-price">{symbol}{(rawPrice * rate).toFixed(2)}</span>{" "}
                                  <span className="discounted-price">Free 🎉</span>{" "}
                                  <span className="discount-tag">100% OFF</span>
                                </>
                              );
                            }
                            if (isFreeString && !isDiscounted) {
                              return <span className="discounted-price">Free 🎉</span>;
                            }
                            if (isDiscounted) {
                              const discounted = rawPrice * (1 - game.discount / 100);
                              return (
                                <>
                                  <span className="original-price">{symbol}{(rawPrice * rate).toFixed(2)}</span>{" "}
                                  <span className="discounted-price">{symbol}{(discounted * rate).toFixed(2)}</span>{" "}
                                  <span className="discount-tag">{game.discount}% OFF</span>
                                </>
                              );
                            }
                            return <span className="discounted-price">{symbol}{(rawPrice * rate).toFixed(2)}</span>;
                          })()}
                        </p>

                        {(game.discount === 100 || game.discount > 0) && game.discountEndTime && (
                          <CountdownTimer endTime={game.discountEndTime} />
                        )}

                        {comments[game.title] && comments[game.title].length > 0 && (
                          <div className="average-rating">
                            ⭐ {(
                              comments[game.title].reduce((sum, c) => sum + Number(c.rating), 0) /
                              comments[game.title].length
                            ).toFixed(1)}{" "}
                            / 5
                          </div>
                        )}

                        <div className="card-buttons">
                          <button
                            className={`like-btn ${likedGames.includes(game.title) ? 'liked' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(game.title);
                            }}
                            title={likedGames.includes(game.title) ? 'Liked' : 'Like'}
                          >
                            ❤️ {likedGames.includes(game.title) ? 'Liked' : 'Like'}
                          </button>

                          <button
                            className={`share-btn ${sharedGames.includes(game.title) ? 'shared' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              shareGame(game);
                            }}
                            title={sharedGames.includes(game.title) ? 'Shared' : 'Share'}
                          >
                            📤 {sharedGames.includes(game.title) ? 'Shared' : 'Share'}
                          </button>

                          <button
                            className={`cart-btn ${cartGames.includes(game.title) ? 'in-cart' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCart(game.title);
                            }}
                            title={cartGames.includes(game.title) ? 'In Cart' : 'Add to Cart'}
                          >
                            🛒 {cartGames.includes(game.title) ? 'In Cart' : 'Cart'}
                          </button>

                          <button
                            className={`pay-btn ${purchasedGames.includes(game.title) ? 'purchased' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!purchasedGames.includes(game.title)) {
                                setPurchasedGames([...purchasedGames, game.title]);
                                setUpiSuccess(`✅ Payment successful for ${game.title}`);
                                setTimeout(() => setUpiSuccess(''), 3000);
                              }
                            }}
                            title="Make Payment"
                          >
                            {purchasedGames.includes(game.title) ? '✔ Purchased' : '💳 Buy'}
                          </button>

                          <button
                            className="trailer-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTrailerUrl(game.trailer);
                              setShowTrailer(true);
                            }}
                          >
                            🎬 Watch Trailer
                          </button>

                          <button
                            className="flip-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlip(game.title);
                            }}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setTimeout(() => {
                                toggleFlip(game.title);
                              }, 300);
                            }}
                          >
                            🔄 More Details
                          </button>

                        </div>
                      </div>

                      {/* BACK SIDE */}
                      <div className="game-card back">
                        <h3>{game.title} - Details</h3>

                        {isFlipped && game.previewVideo && (
                          <>
                            {(() => {
                              const isYouTube = game.previewVideo.includes("youtube.com") || game.previewVideo.includes("youtu.be");
                              if (isYouTube) {
                                const match = game.previewVideo.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
                                const id = match ? match[1] : null;
                                const startMatch = game.previewVideo.match(/[?&](?:start|t)=([0-9hms]+)/i);
                                let start = 0;

                                if (startMatch && startMatch[1]) {
                                  const time = startMatch[1];
                                  const h = parseInt(time.match(/(\d+)h/)?.[1] || 0);
                                  const m = parseInt(time.match(/(\d+)m/)?.[1] || 0);
                                  const s = parseInt(time.match(/(\d+)s/)?.[1] || 0);
                                  start = h * 3600 + m * 60 + s;
                                }

                                const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&mute=1&controls=0&start=${start}`;

                                return (
                                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginBottom: "10px" }}>
                                    <iframe
                                      src={embedUrl}
                                      frameBorder="0"
                                      allow="autoplay; encrypted-media"
                                      allowFullScreen
                                      title="YouTube Preview"
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "8px",
                                      }}
                                    ></iframe>
                                  </div>
                                );
                              }

                              // Non-YouTube video (webm/mp4)
                              return (
                                <div style={{ position: "relative", marginBottom: "10px" }}>
                                  <video
                                    width="100%"
                                    height="180"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{ borderRadius: "8px", backgroundColor: "#000" }}
                                    key={`${game.title}-preview`}
                                  >
                                    <source src={game.previewVideo} type="video/webm" />
                                    <source src={game.previewVideo} type="video/mp4" />
                                    <source src={game.previewVideo} type="video/ogg" />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>
                              );
                            })()}
                          </>
                        )}

                        <p>{game.longDescription || "No additional description available."}</p>

                        <button
                          className="flip-back-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFlip(game.title, true);
                          }}
                        >
                          🔁 Back
                        </button>
                      </div>


                    </div>
                  </div>
                );
              });
            })()
          )}
        </div>

        <div className="pagination-buttons">
          <button
            className="page-button arrow"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>

          {getPageButtons().map((page, idx) => (
            <button
              key={idx}
              className={`page-button ${currentPage === page ? "active" : ""}`}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className="page-button arrow"
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>



        {upiNotification && (
          <div className="upi-toast">
            {upiNotification}
          </div>
        )}
        {upiSuccess && (
          <div className="upi-success">
            <span className="tick-icon"></span>
            {upiSuccess}
          </div>
        )}


        <GameModal
          game={selectedGame}
          onClose={closeModal}
          comments={comments[selectedGame?.title] || []}
          onAddComment={(entry) => addComment(selectedGame.title, entry)}
        />
        {showTrailer && (
          <GameTrailerModal
            trailerUrl={trailerUrl}
            onClose={() => {
              setShowTrailer(false);
              setTrailerUrl(null);
            }}
          />
        )}

        {upiNotification && (
          <div className="upi-toast">
            {upiNotification}
          </div>

        )}

      </div>
    </div>
  );
}

export default GameList;  