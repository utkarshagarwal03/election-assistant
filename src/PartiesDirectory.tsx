import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, User, Flag, Building2 } from 'lucide-react';
import './parties.css';

interface Party {
  id: string;
  name: string;
  abbreviation: string;
  leader: string;
  symbol: string;
  founded: string;
  color: string;
  description: string;
  promises?: string[];
}

const politicalParties: Party[] = [
  {
    id: 'bjp',
    name: 'Bharatiya Janata Party',
    abbreviation: 'BJP',
    leader: 'Jagat Prakash Nadda',
    symbol: 'Lotus',
    founded: '1980',
    color: '#FF9933', // Saffron
    description: 'The BJP is one of the two major political parties in India, along with the INC. As of 2024, it is the ruling political party.'
  },
  {
    id: 'inc',
    name: 'Indian National Congress',
    abbreviation: 'INC',
    leader: 'Mallikarjun Kharge',
    symbol: 'Hand',
    founded: '1885',
    color: '#19AAED', // Blue
    description: 'The INC is a broadly based political party in India. Founded in 1885, it was the first modern nationalist movement to emerge in the British Empire in Asia.'
  },
  {
    id: 'dmk',
    name: 'Dravida Munnetra Kazhagam',
    abbreviation: 'DMK',
    leader: 'M. K. Stalin',
    symbol: 'Rising Sun',
    founded: '1949',
    color: '#dd1100', // Red/Black theme
    description: 'The ruling state political party in Tamil Nadu. Their 2024 manifesto strongly emphasizes expanding welfare on a national level, federal state autonomy, and opposition to selected central policies.',
    promises: [
      'Implement ₹1,000 monthly financial assistance for women nationwide',
      'Establish a Supreme Court branch in Chennai',
      'Exempt Tamil Nadu completely from the NEET medical examinations',
      'Waive all student educational loans and farm loans',
      'Cap Petrol prices at ₹75/L, Diesel at ₹65/L, and LPG at ₹500'
    ]
  },
  {
    id: 'aiadmk',
    name: 'All India Anna Dravida Munnetra Kazhagam',
    abbreviation: 'AIADMK',
    leader: 'Edappadi K. Palaniswami',
    symbol: 'Two Leaves',
    founded: '1972',
    color: '#007221', // Green
    description: 'A massive regional political party in Tamil Nadu. The 2024 manifesto pushed significantly for decentralized federal governance, social welfare hikes, and youth employment schemes.',
    promises: [
      'Increase financial assistance for women heads of families to ₹3,000 per month',
      'Establish major infrastructure including an AIIMS, IIT, and IIM in Coimbatore/Madurai',
      'Scrap NEET in favor of Class 12 marks-based medical admissions',
      'Change Centrally-sponsored scheme cost-sharing ratio from 60:40 to 75:25',
      'Increase daily MGNREGS rural employment wages to ₹450'
    ]
  }

];

export default function PartiesDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredParties = politicalParties.filter(party => 
    party.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    party.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="parties-section">
      <div className="parties-header">
        <h2 className="parties-title">Political Parties Directory</h2>
        <p className="parties-subtitle">Explore information and key election promises about recognized national and regional state parties.</p>
        
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search parties or leaders..." 
            className="party-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="parties-grid">
        <AnimatePresence>
          {filteredParties.map(party => (
            <motion.div 
              key={party.id}
              className={`party-card ${expandedId === party.id ? 'expanded' : ''}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setExpandedId(expandedId === party.id ? null : party.id)}
              style={{ '--party-color': party.color } as React.CSSProperties}
            >
              <div className="party-card-header">
                <div className="party-logo-placeholder">
                  {party.abbreviation}
                </div>
                <div className="party-basic-info">
                  <h3>{party.name}</h3>
                  <span className="party-leader"><User size={14} /> {party.leader}</span>
                </div>
                <div className="expand-icon">
                  <motion.div animate={{ rotate: expandedId === party.id ? 180 : 0 }}>
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === party.id && (
                  <motion.div 
                    className="party-card-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="detail-badges">
                      <span className="detail-badge">
                        <Flag size={14} /> Symbol: <strong>{party.symbol}</strong>
                      </span>
                      <span className="detail-badge">
                        <Building2 size={14} /> Founded: <strong>{party.founded}</strong>
                      </span>
                    </div>
                    <p className="party-description">
                      {party.description}
                    </p>
                    
                    {party.promises && party.promises.length > 0 && (
                      <div className="party-promises">
                        <h4 className="promises-title">Featured Election Promises</h4>
                        <ul className="promises-list">
                          {party.promises.map((promise, idx) => (
                            <li key={idx} className="promise-item">
                              <span className="promise-bullet" style={{ backgroundColor: party.color }}></span>
                              {promise}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          {filteredParties.length === 0 && (
            <p className="no-results">No political parties matched your search.</p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
