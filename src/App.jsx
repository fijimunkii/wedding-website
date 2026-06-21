import { useEffect, useMemo, useState } from 'react';
import floralLeft from '../assets/floral-left.png';
import floralRight from '../assets/floral-right.png';
import flourishImage from '../assets/footer-flourish.png';
import venmoQr from '../assets/venmo-qr-display.png';
import zelleQr from '../assets/zelle-qr-display.jpg';
import { galleryPhotos } from './galleryPhotos';

const weddingDate = new Date('2026-07-18T14:00:00-04:00');
const venmoUrl = 'https://venmo.com/code?user_id=1409808972382208459';
const zelleUrl =
  'https://enroll.zellepay.com/qr-codes?data=ewogICJuYW1lIiA6ICJIQVJSSVNPTiIsCiAgInRva2VuIiA6ICJoYXJyaXNvbnBvd2Vyc0BnbWFpbC5jb20iLAogICJhY3Rpb24iIDogInBheW1lbnQiCn0=';
const venueMapUrl =
  'https://www.google.com/maps/search/?api=1&query=40.96199320,-72.18047680&query_place_id=ChIJ-Xbctfu66IkRRU1M7J8G3aU';
const heroImageCache = new Map();

function preloadHeroImage(src) {
  if (!src || typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (!heroImageCache.has(src)) {
    heroImageCache.set(
      src,
      new Promise((resolve) => {
        const image = new Image();
        const finish = () => {
          if (image.decode) {
            image.decode().then(resolve).catch(resolve);
            return;
          }

          resolve();
        };

        image.decoding = 'async';
        image.onload = finish;
        image.onerror = resolve;
        image.src = src;

        if (image.complete) {
          finish();
        }
      }),
    );
  }

  return heroImageCache.get(src);
}

function getHeroPhotoStyle(photo) {
  return {
    '--photo-focus-x': `${photo.desktopFocus.x}%`,
    '--photo-focus-y': `${photo.desktopFocus.y}%`,
    '--photo-mobile-focus-x': `${photo.mobileFocus.x}%`,
    '--photo-mobile-focus-y': `${photo.mobileFocus.y}%`,
  };
}

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Gallery', action: 'gallery' },
  { label: 'Registry', href: '#registry' },
  { label: 'FAQs', href: '#faqs' },
];

const paymentMethods = [
  {
    name: 'Venmo',
    detail: '@Harrison-Powers',
    qr: venmoQr,
    href: venmoUrl,
  },
  {
    name: 'Zelle',
    detail: 'harrisonpowers@gmail.com',
    qr: zelleQr,
    href: zelleUrl,
  },
];

const registryFunds = [
  {
    title: 'Contribute to our Honeymoon',
    memo: 'Honeymoon Fund',
    copy:
      'Your presence is the greatest gift. For those who want to celebrate with us a little more, we’d be so grateful for support toward our honeymoon fund as we begin this next chapter together.',
  },
  {
    title: 'Contribute to our Home Down Payment',
    memo: 'Home Down Payment Fund',
    copy:
      'Your support means so much to us. For anyone who’d like to help us toward our next big milestone, we’d be incredibly grateful for a gift toward our house down payment fund.',
  },
];

const schedule = [
  {
    day: 'Saturday, July 18, 2026',
    events: [
      {
        time: '2:00 PM',
        title: 'Guest Arrival',
        location: 'Woodhouse Park',
        detail: 'Please arrive with enough time to settle in before the ceremony begins.',
      },
      {
        time: '2:30 PM',
        title: 'Wedding Ceremony',
        location: 'Woodhouse Park, 56 Huntting Lane, East Hampton, NY 11937',
        detail: 'Ceremony on the grounds.',
      },
      {
        time: '3:00 PM',
        title: 'Cocktail Hour',
        location: 'Woodhouse Park',
        detail: 'Drinks and light bites following the ceremony.',
      },
      {
        time: '4:30 PM',
        title: 'Reception',
        location: 'Woodhouse Park',
        detail: 'Dinner and dancing.',
      },
    ],
  },
  {
    day: 'Sunday, July 19, 2026',
    events: [
      {
        time: '8:00 AM',
        title: 'Farewell Breakfast',
        location: 'Location to be announced',
        detail: 'A casual sendoff before everyone heads home.',
      },
    ],
  },
];

const faqs = [
  {
    question: 'What is the dress code?',
    answer:
      'Black tie. Please note that parts of the event are on grass, so we recommend block heels, wedges, or dressy flats for comfort.',
  },
  {
    question: 'Where should I park?',
    answer:
      'Parking details are TBD. We will share the exact location and instructions closer to the wedding date.',
  },
  {
    question: 'Is this an adults-only wedding?',
    answer:
      'Yes. We love your little ones, but our wedding events are adults-only. Thank you for understanding.',
  },
  {
    question: 'Can I bring a plus-one?',
    answer:
      'Due to venue capacity, our wedding is by invitation only. We are only able to accommodate guests listed on your invitation/RSVP.',
  },
];

function getCountdown() {
  const diff = weddingDate.getTime() - Date.now();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return {
    days,
    hours,
    minutes,
    seconds: seconds % 60,
  };
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeFund, setActiveFund] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [previousHeroIndex, setPreviousHeroIndex] = useState(null);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [countdown, setCountdown] = useState(() => getCountdown());

  const openGallery = (index = heroIndex) => {
    setActivePhoto(index);
    setGalleryOpen(true);
    setMenuOpen(false);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const showPreviousPhoto = () => {
    setActivePhoto((index) => (index === 0 ? galleryPhotos.length - 1 : index - 1));
  };

  const showNextPhoto = () => {
    setActivePhoto((index) => (index + 1) % galleryPhotos.length);
  };

  const toggleHeroPlayback = () => {
    setIsHeroPaused((paused) => !paused);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || isHeroPaused) {
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      const nextIndex = (heroIndex + 1) % galleryPhotos.length;

      preloadHeroImage(galleryPhotos[nextIndex].src).finally(() => {
        if (cancelled) {
          return;
        }

        setPreviousHeroIndex(heroIndex);
        setHeroIndex(nextIndex);
      });
    }, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [heroIndex, isHeroPaused]);

  useEffect(() => {
    if (previousHeroIndex === null) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPreviousHeroIndex(null);
    }, 1300);

    return () => window.clearTimeout(timer);
  }, [previousHeroIndex]);

  useEffect(() => {
    const nextPhoto = galleryPhotos[(heroIndex + 1) % galleryPhotos.length];
    preloadHeroImage(nextPhoto.src);
  }, [heroIndex]);

  useEffect(() => {
    const preloadRemainingImages = () => {
      galleryPhotos.forEach((photo, index) => {
        if (index !== heroIndex) {
          preloadHeroImage(photo.src);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadRemainingImages);
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = window.setTimeout(preloadRemainingImages, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!galleryOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeGallery();
      }

      if (event.key === 'ArrowLeft') {
        showPreviousPhoto();
      }

      if (event.key === 'ArrowRight') {
        showNextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [galleryOpen]);

  const countdownItems = useMemo(
    () => [
      ['Days', countdown.days],
      ['Hours', countdown.hours],
      ['Minutes', countdown.minutes],
      ['Seconds', countdown.seconds],
    ],
    [countdown],
  );

  const currentHeroPhoto = galleryPhotos[heroIndex];
  const previousHeroPhoto =
    previousHeroIndex === null || previousHeroIndex === heroIndex
      ? null
      : galleryPhotos[previousHeroIndex];

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
          Cassie & Harrison
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Primary navigation">
          {navItems.map((item) =>
            item.action === 'gallery' ? (
              <button key={item.label} type="button" onClick={() => openGallery()}>
                {item.label}
              </button>
            ) : (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
      </header>

      <main>
        <section id="home" className="hero" aria-label="Home">
          <div className="hero-slides" aria-hidden="true">
            {previousHeroPhoto ? (
              <img
                key={`previous-${previousHeroPhoto.src}`}
                src={previousHeroPhoto.src}
                alt=""
                className="hero-image exiting"
                style={getHeroPhotoStyle(previousHeroPhoto)}
              />
            ) : null}
            <img
              key={`current-${currentHeroPhoto.src}`}
              src={currentHeroPhoto.src}
              alt=""
              className={previousHeroPhoto ? 'hero-image active entering' : 'hero-image active'}
              style={getHeroPhotoStyle(currentHeroPhoto)}
              fetchPriority={heroIndex === 0 ? 'high' : undefined}
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">July 18, 2026 · East Hampton, New York</p>
            <h1>Cassie & Harrison</h1>
            <div className="hero-actions">
              <a className="hero-link" href="#schedule">
                View Schedule
              </a>
              <button className="hero-link" type="button" onClick={() => openGallery()}>
                View Gallery
              </button>
              <button
                className="hero-link hero-link-small"
                type="button"
                aria-pressed={isHeroPaused}
                onClick={toggleHeroPlayback}
              >
                {isHeroPaused ? 'Play' : 'Pause'}
              </button>
            </div>
          </div>
        </section>

        <section className="names-section" aria-label="Wedding details">
          <img className="floral floral-left" src={floralLeft} alt="" />
          <div className="names-card">
            <p className="eyebrow">Together with their families</p>
            <h2>
              Cassie 雅薇 Xia
              <span>and</span>
              Harrison Powers
            </h2>
            <div className="date-line">Saturday, July 18, 2026</div>
            <div className="place-line">Woodhouse Park · East Hampton, NY</div>
            <div className="countdown" aria-label="Countdown to the wedding">
              {countdownItems.map(([label, value]) => (
                <div key={label} className="countdown-item">
                  <strong>{String(value).padStart(2, '0')}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <img className="floral floral-right" src={floralRight} alt="" />
        </section>

        <section id="schedule" className="section schedule-section">
          <div className="section-heading">
            <h2>Schedule</h2>
          </div>
          <div className="location-card">
            <p className="eyebrow">Location</p>
            <h3>Woodhouse Park</h3>
            <p>56 Huntting Lane, East Hampton, NY 11937</p>
            <a href={venueMapUrl} target="_blank" rel="noreferrer">
              Open map
            </a>
          </div>
          <div className="schedule-list">
            {schedule.map((group) => (
              <article key={group.day} className="day-group">
                <h3>{group.day}</h3>
                {group.events.map((event) => (
                  <div key={`${group.day}-${event.time}-${event.title}`} className="event-row">
                    <time>{event.time}</time>
                    <div>
                      <h4>{event.title}</h4>
                      <p className="event-location">{event.location}</p>
                      <p>{event.detail}</p>
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section id="registry" className="registry-section">
          <div className="registry-intro">
            <h2>Registry</h2>
            <p>
              Celebrating with you is what matters most. For anyone who would like to contribute,
              these funds help us start this next chapter together.
            </p>
          </div>
          <div className="registry-funds">
            {registryFunds.map((fund, index) => {
              const selected = activeFund === index;

              return (
                <article key={fund.title} className={selected ? 'fund-card selected' : 'fund-card'}>
                  <div className="fund-copy">
                    <h3>{fund.title}</h3>
                    <p>{fund.copy}</p>
                    <p className="memo-line">Suggested memo: {fund.memo}</p>
                  </div>
                  <button
                    className="fund-select"
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveFund(index)}
                  >
                    {selected ? 'Selected' : 'Select fund'}
                  </button>
                  {selected ? (
                    <div className="fund-payment-area">
                      <div className="payment-area-header">
                        <p>Suggested memo: {fund.memo}</p>
                      </div>
                      <div className="payment-methods">
                        {paymentMethods.map((method) => (
                          <div key={`${fund.title}-${method.name}`} className="payment-method">
                            <div className="payment-method-heading">
                              <h4>{method.name}</h4>
                              <p>{method.detail}</p>
                            </div>
                            <img
                              src={method.qr}
                              alt={`${method.name} QR code for ${fund.title}`}
                              loading="lazy"
                            />
                            <a
                              className="payment-link"
                              href={method.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open {method.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section id="faqs" className="section faq-section">
          <div className="section-heading">
            <h2>FAQs</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => {
              const open = activeFaq === index;

              return (
                <div key={item.question} className="faq-item">
                  <button type="button" onClick={() => setActiveFaq(open ? -1 : index)}>
                    <span>{item.question}</span>
                    <span aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  <div className={open ? 'faq-answer open' : 'faq-answer'}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <img src={flourishImage} alt="" />
        <p>Cassie & Harrison · July 18, 2026</p>
      </footer>

      {galleryOpen ? (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label="Photo gallery">
          <button className="gallery-close" type="button" aria-label="Close gallery" onClick={closeGallery}>
            ×
          </button>
          <button
            className="gallery-arrow gallery-arrow-previous"
            type="button"
            aria-label="Previous photo"
            onClick={showPreviousPhoto}
          >
            ‹
          </button>
          <figure className="gallery-frame">
            <img src={galleryPhotos[activePhoto].src} alt={galleryPhotos[activePhoto].alt} />
            <figcaption>
              {activePhoto + 1} / {galleryPhotos.length}
            </figcaption>
          </figure>
          <button
            className="gallery-arrow gallery-arrow-next"
            type="button"
            aria-label="Next photo"
            onClick={showNextPhoto}
          >
            ›
          </button>
          <div className="gallery-thumbnails" aria-label="Gallery thumbnails">
            {galleryPhotos.map((photo, index) => (
              <button
                key={photo.thumb}
                type="button"
                className={index === activePhoto ? 'active' : ''}
                aria-label={`View photo ${index + 1}`}
                aria-current={index === activePhoto ? 'true' : undefined}
                onClick={() => setActivePhoto(index)}
              >
                <img src={photo.thumb} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
