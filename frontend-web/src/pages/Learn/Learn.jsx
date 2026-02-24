import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Learn.module.css';

const COURSES = [
  {
    id: 1,
    title: 'Sierra Leone Trading Basics',
    level: 'Beginner',
    duration: '2h 30m',
    lessons: [
      {
        title: 'What is Trading?',
        desc: 'Learn how trading works: buying and selling assets to make a profit.',
      },
      {
        title: 'Understanding the Leone (SLL)',
        desc: 'How the Sierra Leone Leone relates to global currencies like USD and EUR.',
      },
      {
        title: 'Types of Assets',
        desc: 'Crypto, Forex, Stocks — what they are and how to choose.',
      },
      {
        title: 'Your First Trade',
        desc: 'Step-by-step guide to placing your first buy order on LeoneAI.',
      },
    ],
    emoji: '🌱',
    color: '#1a56db',
  },
  {
    id: 2,
    title: 'Technical Analysis with SLL',
    level: 'Advanced',
    duration: '4h 15m',
    lessons: [
      {
        title: 'Reading Price Charts',
        desc: 'Understand candlestick charts and what price movements mean.',
      },
      { title: 'Support & Resistance', desc: 'The key price levels every trader needs to know.' },
      {
        title: 'RSI & MACD Indicators',
        desc: 'How to use momentum indicators to time your trades.',
      },
      {
        title: 'Chart Patterns',
        desc: 'Head & Shoulders, Double Top/Bottom, and Triangles explained simply.',
      },
    ],
    emoji: '📊',
    color: '#3b82f6',
  },
  {
    id: 3,
    title: 'SL Market Volatility',
    level: 'Intermediate',
    duration: '1h 45m',
    lessons: [
      {
        title: 'Why Prices Move',
        desc: 'Economic factors that drive currency and crypto price changes in Sierra Leone.',
      },
      { title: 'Import/Export Effects', desc: 'How SL trade balances affect the Leone value.' },
      {
        title: 'Managing Risk',
        desc: 'Stop-loss orders and position sizing to protect your funds.',
      },
    ],
    emoji: '🌊',
    color: '#0369a1',
  },
];

const GLOSSARY = [
  {
    term: 'Arbitrage',
    def: 'Buying in one market at a lower price and selling in another at a higher price.',
  },
  { term: 'Bull Market', def: 'When prices are rising or expected to rise over a period of time.' },
  {
    term: 'Bear Market',
    def: 'When prices are falling or expected to fall — a good time to be cautious.',
  },
  { term: 'SLL Pair', def: 'A currency pair involving the Sierra Leone Leone, e.g. USD/SLL.' },
  {
    term: 'Leverage',
    def: 'Using borrowed money to increase your trading size — increases both profit and risk.',
  },
  {
    term: 'Stop-Loss',
    def: 'An automatic sell order that limits your loss if the price falls too far.',
  },
  { term: 'Pip', def: 'The smallest price move in a currency pair, usually 0.0001.' },
  {
    term: 'Liquidity',
    def: 'How easily an asset can be bought or sold without affecting its price.',
  },
];

const FAQ = [
  {
    q: 'Is LeoneAI available for beginner traders?',
    a: 'Yes! LeoneAI is built with a local-first approach, guiding both new and experienced traders through the Sierra Leone market landscape with simple, jargon-free language.',
  },
  {
    q: 'How secure is the Mobile Money connection?',
    a: 'We use bank-grade encryption and comply with Sierra Leone financial regulations to ensure your funds and data are completely secure.',
  },
  {
    q: 'Can I trade with SLL directly?',
    a: 'Absolutely! All our trading pairs show prices in SLL, making it easy to understand your investment without currency conversion hassles.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We support Orange Money, Afrimoney, PayPal, Stripe, and Visa/Mastercard for deposits and withdrawals.',
  },
];

const CourseCard = ({ course }) => {
  const [open, setOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);

  return (
    <div className={styles.courseCard}>
      <div className={styles.courseHeader} onClick={() => setOpen(!open)}>
        <div className={styles.courseLeft}>
          <span className={styles.courseEmoji}>{course.emoji}</span>
          <div>
            <h3>{course.title}</h3>
            <div className={styles.courseMeta}>
              <span
                className={styles.courseLevel}
                style={{ borderColor: course.color, color: course.color }}
              >
                {course.level}
              </span>
              <span>⏱ {course.duration}</span>
              <span>📚 {course.lessons.length} lessons</span>
            </div>
          </div>
        </div>
        <span className={`${styles.chevron} ${open ? styles.open : ''}`}>▶</span>
      </div>

      {open && (
        <div className={styles.lessonList}>
          {course.lessons.map((lesson, i) => (
            <div
              key={i}
              className={`${styles.lessonItem} ${activeLesson === i ? styles.activeLesson : ''}`}
              onClick={() => setActiveLesson(activeLesson === i ? null : i)}
            >
              <div className={styles.lessonHeader}>
                <span className={styles.lessonNumber}>{i + 1}</span>
                <span className={styles.lessonTitle}>{lesson.title}</span>
                <span className={styles.lessonChevron}>{activeLesson === i ? '▲' : '▼'}</span>
              </div>
              {activeLesson === i && (
                <div className={styles.lessonContent}>
                  <p>{lesson.desc}</p>
                  <button className={styles.startLessonBtn}>▶ Start Lesson</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem} onClick={() => setOpen(!open)}>
      <div className={styles.faqHeader}>
        <h4>{q}</h4>
        <span>{open ? '▲' : '▼'}</span>
      </div>
      {open && <p className={styles.faqAnswer}>{a}</p>}
    </div>
  );
};

const Learn = () => {
  const navigate = useNavigate();
  const [glossarySearch, setGlossarySearch] = useState('');

  const filteredGlossary = GLOSSARY.filter(
    g =>
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className={styles.learn}>
      <header className={styles.header}>
        <h1>Learn Trading</h1>
        <p className={styles.subtitle}>Educational resources for Sierra Leonean traders</p>
      </header>

      {/* Featured Banner */}
      <div className={styles.featuredCourse}>
        <div className={styles.featuredBanner}>
          <div className={styles.flagPattern}></div>
        </div>
        <div className={styles.featuredContent}>
          <span className={styles.featuredBadge}>🌟 Featured</span>
          <h2>Sierra Leone Trading Basics</h2>
          <p>
            Master the fundamentals of trading with SLL. Learn how to navigate the markets
            specifically tailored for the Sierra Leonean context, including local banking and mobile
            money.
          </p>
          <div className={styles.featuredMeta}>
            <span>🌱 Beginner</span>
            <span>⏱ 2h 30m</span>
            <span>📚 4 lessons</span>
          </div>
          <button
            className={styles.btnPrimary}
            onClick={() =>
              document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' })
            }
          >
            Start Learning Now
          </button>
        </div>
      </div>

      {/* Video Tutorials — Accordion Courses */}
      <section className={styles.section} id="courses-section">
        <div className={styles.sectionHeader}>
          <h2>📹 Video Tutorials</h2>
          <span className={styles.courseCount}>{COURSES.length} courses</span>
        </div>
        <div className={styles.courseGrid}>
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Mobile Money Integration */}
      <div className={styles.mobileMoneyCard}>
        <div className={styles.mobileMoneyIcon}>📱</div>
        <div className={styles.mobileMoneyContent}>
          <h3>Local Mobile Money Integration</h3>
          <p>
            Learn how to seamlessly deposit and withdraw funds using Orange Money, Afrimoney, and
            other SLL-based mobile money platforms, as well as international options like PayPal and
            Visa.
          </p>
          <div className={styles.providers}>
            <span className={styles.provider}>🇸🇱 Orange Money</span>
            <span className={styles.provider}>🇸🇱 Afrimoney</span>
            <span className={styles.provider}>💳 PayPal</span>
            <span className={styles.provider}>💳 Visa / Mastercard</span>
          </div>
          <button className={styles.btnSecondary} onClick={() => navigate('/portfolio')}>
            Deposit Now
          </button>
        </div>
      </div>

      {/* Trading Glossary */}
      <section className={styles.section}>
        <h2>📖 Trading Glossary</h2>
        <input
          type="text"
          placeholder="Search terms..."
          className={styles.glossarySearch}
          value={glossarySearch}
          onChange={e => setGlossarySearch(e.target.value)}
        />
        <div className={styles.glossaryGrid}>
          {filteredGlossary.map((item, i) => (
            <div key={i} className={styles.glossaryItem}>
              <h4>{item.term}</h4>
              <p>{item.def}</p>
            </div>
          ))}
          {filteredGlossary.length === 0 && (
            <p className={styles.noGlossary}>No matching terms found.</p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2>❓ Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {FAQ.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Learning Progress */}
      <div className={styles.progressCard}>
        <h3>📈 Your Learning Progress</h3>
        <div className={styles.progressStats}>
          <div className={styles.progressStat}>
            <span className={styles.progressLabel}>Courses Available</span>
            <span className={styles.progressValue}>{COURSES.length}</span>
          </div>
          <div className={styles.progressStat}>
            <span className={styles.progressLabel}>Total Lessons</span>
            <span className={styles.progressValue}>
              {COURSES.reduce((t, c) => t + c.lessons.length, 0)}
            </span>
          </div>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '0%' }}></div>
        </div>
        <p className={styles.progressText}>Expand any course above to begin your first lesson!</p>
      </div>
    </div>
  );
};

export default Learn;
