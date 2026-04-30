import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatAssistant from './ChatAssistant';
import PartiesDirectory from './PartiesDirectory';
import PredictionSimulator from './PredictionSimulator';
import BallotGame from './BallotGame';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Vote,
  FileBadge
} from 'lucide-react';
import './App.css';

interface TimelinePhase {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  color: string;
}

const timelineData: TimelinePhase[] = [
  {
    id: 'registration',
    title: 'Voter Registration',
    date: 'Oct 1 - Nov 1',
    description: 'Ensure you are eligible and registered to vote in your district.',
    icon: <FileBadge size={28} />,
    color: '#10b981', // Teal
    details: [
      'Check voter registration status online',
      'Update address if recently moved',
      'Provide valid state-issued ID'
    ]
  },
  {
    id: 'candidates',
    title: 'Candidate Review',
    date: 'Nov 2 - Nov 15',
    description: 'Research candidates, their platforms, and proposed policies.',
    icon: <Users size={28} />,
    color: '#f59e0b', // Orange
    details: [
      'Watch local and national debates',
      'Read official candidate manifestos',
      'Review historical voting records'
    ]
  },
  {
    id: 'polling-info',
    title: 'Polling Preparation',
    date: 'Nov 16 - Nov 20',
    description: 'Find your assigned polling location and check early voting options.',
    icon: <MapPin size={28} />,
    color: '#a855f7', // Purple
    details: [
      'Locate designated polling station',
      'Check early voting eligibility',
      'Organize transportation if needed'
    ]
  },
  {
    id: 'election-day',
    title: 'Election Day',
    date: 'November 21',
    description: 'Cast your vote in person or ensure your mail-in ballot is received.',
    icon: <Vote size={28} />,
    color: '#ec4899', // Pink
    details: [
      'Polls open 7:00 AM to 8:00 PM',
      'Bring required identification',
      'Follow instructions from poll workers'
    ]
  }
];

function App() {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState<boolean>(false);
  const [checklistItems, setChecklistItems] = useState([
    { id: '1', label: 'Verify voter registration status', checked: false },
    { id: '2', label: 'Research candidates and measures', checked: false },
    { id: '3', label: 'Locate designated polling station', checked: false },
    { id: '4', label: 'Prepare accepted identification', checked: false },
    { id: '5', label: 'Review sample ballot', checked: false },
  ]);

  const togglePhase = (id: string) => {
    setActivePhase(activePhase === id ? null : id);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="app-container">
      <header className="header" id="home">
        <motion.h1 
          className="header-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Election Assistant
        </motion.h1>
        <motion.p 
          className="header-subtitle"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your interactive guide to understanding the election process, important timelines, and the steps to make your voice heard.
        </motion.p>
      </header>

      <nav className="sticky-nav">
        <a href="#timeline">Timeline</a>
        <a href="#checklist">Checklist</a>
        <a href="#directory">Parties</a>
        <a href="#simulator">Simulator</a>
        <a href="#game">Minigame</a>
      </nav>

      <main>
      <div id="timeline" className="timeline-container">
        {timelineData.map((phase, index) => (
          <div 
            key={phase.id} 
            className={`timeline-item delay-${index + 1}`}
            onMouseEnter={() => togglePhase(phase.id)}
            onMouseLeave={() => togglePhase(phase.id)}
            style={{ perspective: '1000px' }}
          >
            <motion.div 
              className="timeline-icon-wrap"
              style={{ 
                borderColor: phase.color, 
                boxShadow: `0 0 20px ${phase.color}40`,
                background: `linear-gradient(135deg, var(--bg-secondary), #000)`
              }}
              whileHover={{ scale: 1.2, rotate: 360, boxShadow: `0 0 30px ${phase.color}80` }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div style={{ color: phase.color, display: 'flex' }}>{phase.icon}</div>
            </motion.div>
            
            <motion.div 
              className="timeline-content"
              whileHover={{ 
                scale: 1.05, 
                rotateY: index % 2 === 0 ? 5 : -5,
                borderColor: phase.color,
                boxShadow: `0 20px 40px ${phase.color}30`
              }}
              style={{ borderLeft: `4px solid ${phase.color}`, transformStyle: 'preserve-3d' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <div className="phase-title">
                {phase.title}
                <span className="phase-date" style={{ color: phase.color, background: `${phase.color}15` }}>{phase.date}</span>
              </div>
              <p className="phase-desc">{phase.description}</p>
              
              <motion.div 
                initial={false}
                animate={{ 
                  height: activePhase === phase.id ? 'auto' : 0,
                  opacity: activePhase === phase.id ? 1 : 0,
                  marginTop: activePhase === phase.id ? 16 : 0
                }}
                className="overflow-hidden"
              >
                <div className="border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                  <ul className="phase-features">
                    {phase.details.map((detail, idx) => (
                      <motion.li 
                        key={idx} 
                        className="feature-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <CheckCircle2 size={16} className="feature-icon" style={{ color: phase.color }} />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div 
        id="checklist"
        className="interactive-card delay-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Info size={20} className="info-tooltip" />
        <h3 className="interactive-title">Are you ready to vote?</h3>
        <p className="text-gray-400 mb-4">
          Complete a quick checklist to ensure you have everything needed for election day.
        </p>
        <button 
          aria-label="Start Voter Readiness Checklist"
          className="btn-primary flex items-center justify-center mx-auto gap-2"
          onClick={() => setShowChecklist(true)}
        >
          Start Checklist <ChevronRight size={20} />
        </button>
      </motion.div>

      {/* Checklist Modal */}
      {showChecklist && (
        <div className="modal-overlay" onClick={() => setShowChecklist(false)}>
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button aria-label="Close Checklist" className="modal-close" onClick={() => setShowChecklist(false)}>×</button>
            <h2 className="modal-title">Voter Readiness Checklist</h2>
            <div className="checklist-items">
              {checklistItems.map(item => (
                <label key={item.id} className="checklist-item">
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                  />
                  <span className={`checkmark ${item.checked ? 'checked' : ''}`}>
                    {item.checked && <CheckCircle2 size={16} />}
                  </span>
                  <span className={`checklist-text ${item.checked ? 'completed' : ''}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="modal-footer">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${(checklistItems.filter(i => i.checked).length / checklistItems.length) * 100}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {checklistItems.filter(i => i.checked).length} of {checklistItems.length} completed
              </p>
              {checklistItems.filter(i => i.checked).length === checklistItems.length && (
                <p className="success-message">🎉 You are ready to vote!</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Directory of Active National Political Parties */}
      <div id="directory" className="nav-section">
        <PartiesDirectory />
      </div>

      {/* Interactive Election Forecast Simulator */}
      <div id="simulator" className="nav-section">
        <PredictionSimulator />
      </div>

      {/* Ballot Catch Minigame */}
      <div id="game" className="nav-section">
        <BallotGame />
      </div>
      </main>

      {/* Embedded ECI AI Assistant */}
      <ChatAssistant />
    </div>
  );
}

export default App;
