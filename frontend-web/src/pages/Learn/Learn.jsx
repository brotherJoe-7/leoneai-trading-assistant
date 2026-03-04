import React, { useState } from 'react';
import styles from './Learn.module.css';

const COURSES = [
  {
    id: 1,
    emoji: '🌱',
    level: 'Beginner',
    color: '#22c55e',
    duration: '2h 30m',
    progress: 0,
    title: 'Sierra Leone Trading Basics',
    desc: 'Complete beginner guide — from zero to your first trade, in plain English (and a bit of Krio).',
    lessons: [
      {
        title: 'What is Trading?',
        desc: 'How buying and selling assets creates profit. Simple examples using Freetown market prices.',
      },
      {
        title: 'Understanding the Leone (SLL)',
        desc: 'How the Sierra Leone Leone relates to USD, EUR, and major currencies.',
      },
      {
        title: 'Types of Assets: Crypto, Forex, Stocks',
        desc: 'What they are, how they work, which is best for you right now.',
      },
      {
        title: 'Your First Trade on LeoneAI',
        desc: 'Step-by-step: deposit with Orange Money, pick a signal, place your first order.',
      },
      {
        title: 'Reading Profit & Loss',
        desc: 'How to know if you made money, how to calculate your return in SLL.',
      },
    ],
  },
  {
    id: 2,
    emoji: '📊',
    level: 'Intermediate',
    color: '#d4a832',
    duration: '3h 45m',
    progress: 0,
    title: 'Reading Charts & Technical Analysis',
    desc: 'Learn to read price charts, spot patterns, and understand market trends like a professional.',
    lessons: [
      {
        title: 'Candlestick Charts Explained',
        desc: 'What each candle means: open, close, high, low — in 10 minutes.',
      },
      {
        title: 'Support & Resistance Levels',
        desc: 'How to identify key price zones where the market tends to react.',
      },
      {
        title: 'Moving Averages (EMA & SMA)',
        desc: 'How traders use EMA-20, EMA-50, EMA-200 to spot trends.',
      },
      {
        title: 'RSI — Relative Strength Index',
        desc: 'How to identify oversold and overbought conditions for entry/exit.',
      },
      {
        title: 'MACD — Momentum Indicator',
        desc: 'How to spot trend changes and momentum shifts using MACD crossovers.',
      },
      {
        title: 'Best Timeframes for SLL Markets',
        desc: 'Which chart timeframes (1H, 4H, 1D) work best for Sierra Leone traders.',
      },
    ],
  },
  {
    id: 3,
    emoji: '🤖',
    level: 'Intermediate',
    color: '#8b5cf6',
    duration: '2h 15m',
    progress: 0,
    title: 'Trading with LeoneAI Signals',
    desc: 'Learn how to read, evaluate, and act on AI-generated signals effectively and safely.',
    lessons: [
      {
        title: 'How AI Signals Are Generated',
        desc: 'What data our AI engine analyzes and how it arrives at BUY/SELL/HOLD decisions.',
      },
      {
        title: 'Understanding Confidence Scores',
        desc: 'What 87% confidence means vs. 61% — and when to act on them.',
      },
      {
        title: 'Entry, Target, and Stop-Loss',
        desc: 'How to use the prices provided in each signal to manage risk.',
      },
      {
        title: 'Sizing Your Position in SLL',
        desc: 'How much to invest per signal based on your balance and risk tolerance.',
      },
      {
        title: 'When NOT to Follow a Signal',
        desc: 'Red flags, market conditions, and timing that should make you wait.',
      },
    ],
  },
  {
    id: 4,
    emoji: '⛓',
    level: 'Beginner',
    color: '#0ea5e9',
    duration: '1h 20m',
    progress: 0,
    title: 'Crypto & Blockchain for Sierra Leoneans',
    desc: 'What is Bitcoin? How does blockchain work? How to safely buy, store, and send crypto.',
    lessons: [
      {
        title: 'What is Bitcoin?',
        desc: 'The history, purpose, and why it has value — explained simply.',
      },
      {
        title: 'How Blockchain Works',
        desc: 'The technology behind crypto in 5 minutes — no jargon.',
      },
      {
        title: 'Wallets: Custodial vs. Self-Custody',
        desc: 'Which type you need and how to keep your crypto safe.',
      },
      {
        title: 'Depositing Crypto on LeoneAI',
        desc: 'Step-by-step guide to sending BTC, ETH, or USDT to your account.',
      },
      {
        title: 'Gas Fees & Network Selection',
        desc: 'Why you must choose the right network (ERC-20 vs TRC-20) to avoid losing funds.',
      },
    ],
  },
  {
    id: 5,
    emoji: '🛡',
    level: 'Advanced',
    color: '#ef4444',
    duration: '4h 00m',
    progress: 0,
    title: 'Risk Management & Trading Psychology',
    desc: 'The most important skills: how to protect your capital and stay disciplined under pressure.',
    lessons: [
      {
        title: 'The 1% Rule — Never Blow Your Account',
        desc: 'Why professional traders never risk more than 1-2% per trade.',
      },
      {
        title: 'Position Sizing in SLL',
        desc: 'Calculate your exact position size for every trade automatically.',
      },
      {
        title: 'The Psychology of Losing Trades',
        desc: 'How to handle losses emotionally and not make panic decisions.',
      },
      {
        title: 'Revenge Trading & How to Avoid It',
        desc: 'The most dangerous pattern new traders fall into — and how to stop.',
      },
      {
        title: 'Building a Consistent Trading Routine',
        desc: 'Daily habits of profitable traders — analysis, journaling, review.',
      },
    ],
  },
  {
    id: 6,
    emoji: '🚀',
    level: 'Advanced',
    color: '#f59e0b',
    duration: '5h 30m',
    progress: 0,
    title: 'Pro Trading Strategies',
    desc: 'Advanced techniques: scalping, swing trading, and algorithmic strategies used by professionals.',
    lessons: [
      {
        title: 'Scalping: Small Gains, High Frequency',
        desc: 'How to make multiple small profits per day using 5m and 15m charts.',
      },
      {
        title: 'Swing Trading with 4H Charts',
        desc: 'Hold positions for 2-5 days to catch major market moves.',
      },
      {
        title: 'Fibonacci Retracement Strategy',
        desc: 'How to enter trades at golden ratio levels with high precision.',
      },
      {
        title: 'Breakout Trading',
        desc: 'How to identify and trade breakouts from key consolidation zones.',
      },
      {
        title: 'Building Your Trading System',
        desc: 'Combine all tools into a personal, repeatable trading strategy.',
      },
    ],
  },
];

const LEVEL_COLORS = { Beginner: '#22c55e', Intermediate: '#d4a832', Advanced: '#ef4444' };

const Learn = () => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? COURSES : COURSES.filter(c => c.level === filter);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📚 Learn to Trade</h1>
          <p className={styles.subtitle}>
            6 courses · 30+ lessons · Free for all LeoneAI users · Designed for Sierra Leone
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {[
          { icon: '📖', val: '6', label: 'Courses' },
          { icon: '🎯', val: '30+', label: 'Lessons' },
          { icon: '🇸🇱', val: '100%', label: 'SLL Focused' },
          { icon: '🆓', val: 'Free', label: 'Always' },
        ].map((s, i) => (
          <div key={i} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <strong className={styles.statVal}>{s.val}</strong>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
            style={
              filter === f && f !== 'All'
                ? {
                    borderColor: LEVEL_COLORS[f],
                    color: LEVEL_COLORS[f],
                    background: `${LEVEL_COLORS[f]}15`,
                  }
                : {}
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className={styles.grid}>
        {filtered.map(course => (
          <div
            key={course.id}
            className={`${styles.courseCard} ${selected === course.id ? styles.courseExpanded : ''}`}
          >
            <div
              className={styles.cardTop}
              onClick={() => setSelected(selected === course.id ? null : course.id)}
            >
              <div
                className={styles.courseIcon}
                style={{ background: `${course.color}20`, color: course.color }}
              >
                {course.emoji}
              </div>
              <div className={styles.courseInfo}>
                <div className={styles.courseMeta}>
                  <span
                    className={styles.levelBadge}
                    style={{
                      color: LEVEL_COLORS[course.level],
                      background: `${LEVEL_COLORS[course.level]}18`,
                      borderColor: `${LEVEL_COLORS[course.level]}40`,
                    }}
                  >
                    {course.level}
                  </span>
                  <span className={styles.duration}>⏱ {course.duration}</span>
                  <span className={styles.lessonsCount}>{course.lessons.length} lessons</span>
                </div>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDesc}>{course.desc}</p>
              </div>
              <div className={styles.chevron} style={{ color: course.color }}>
                {selected === course.id ? '▲' : '▼'}
              </div>
            </div>

            {selected === course.id && (
              <div className={styles.lessonList}>
                {course.lessons.map((lesson, i) => (
                  <div key={i} className={styles.lessonItem}>
                    <div
                      className={styles.lessonNum}
                      style={{ background: `${course.color}20`, color: course.color }}
                    >
                      {i + 1}
                    </div>
                    <div className={styles.lessonContent}>
                      <div className={styles.lessonTitle}>{lesson.title}</div>
                      <div className={styles.lessonDesc}>{lesson.desc}</div>
                    </div>
                    <button
                      className={styles.startBtn}
                      style={{
                        background: `${course.color}20`,
                        color: course.color,
                        borderColor: `${course.color}40`,
                      }}
                    >
                      Start →
                    </button>
                  </div>
                ))}
                <div className={styles.courseActions}>
                  <button className={styles.startAllBtn} style={{ background: course.color }}>
                    Start Course — {course.duration}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
