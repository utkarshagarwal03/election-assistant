import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertCircle, PieChart } from 'lucide-react';
import './simulator.css';

const TOTAL_SEATS = 543;
const MAJORITY_MARK = 272;

export default function PredictionSimulator() {
  const [seats, setSeats] = useState({
    bjp: 240,
    inc: 99,
    aap: 3,
    bsp: 0,
    cpim: 4,
    other: 197
  });

  const totalAllocated = Object.values(seats).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_SEATS - totalAllocated;

  const handleSeatChange = (party: keyof typeof seats, value: string) => {
    let numValue = parseInt(value) || 0;
    
    // Prevent allocating more than what's available
    const othersAllocated = totalAllocated - seats[party];
    const maxAllowed = TOTAL_SEATS - othersAllocated;
    
    if (numValue > maxAllowed) numValue = maxAllowed;
    if (numValue < 0) numValue = 0;

    setSeats(prev => ({ ...prev, [party]: numValue }));
  };

  const getWinner = () => {
    let maxSeats = 0;
    let winner = null;
    
    for (const [party, count] of Object.entries(seats)) {
      if (count > maxSeats) {
        maxSeats = count;
        winner = party;
      }
    }
    
    return maxSeats >= MAJORITY_MARK ? winner : null;
  };

  const winner = getWinner();

  const partiesConfig = [
    { id: 'bjp', name: 'Bharatiya Janata Party (BJP)', color: '#FF9933' },
    { id: 'inc', name: 'Indian National Congress (INC)', color: '#19AAED' },
    { id: 'aap', name: 'Aam Aadmi Party (AAP)', color: '#0066A4' },
    { id: 'cpim', name: 'CPI(M)', color: '#DE2024' },
    { id: 'bsp', name: 'Bahujan Samaj Party (BSP)', color: '#22409A' },
    { id: 'other', name: 'Other Parties / Independents', color: '#888888' }
  ];

  return (
    <section className="simulator-section">
      <div className="simulator-header">
        <h2 className="simulator-title">Election Scenario Builder</h2>
        <p className="simulator-subtitle">
          Test different political outcomes. Allocate all 543 Lok Sabha seats to see who hits the magic 272 majority mark!
        </p>
      </div>

      <div className="simulator-container">
        <div className="simulator-controls">
          <div className="seats-status">
            <div className="status-item">
              <span className="status-label">Total Seats</span>
              <span className="status-val">{TOTAL_SEATS}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Majority Mark</span>
              <span className="status-val highlight">{MAJORITY_MARK}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Unallocated</span>
              <span className={`status-val ${remaining > 0 ? 'warning' : 'success'}`}>
                {remaining}
              </span>
            </div>
          </div>

          <div className="sliders-container">
            {partiesConfig.map(party => (
              <div key={party.id} className="seat-slider-group">
                <div className="slider-header">
                  <span className="party-name" style={{ borderLeft: `3px solid ${party.color}` }}>
                    {party.name}
                  </span>
                  <input 
                    type="number" 
                    className="seat-input"
                    value={seats[party.id as keyof typeof seats]}
                    onChange={(e) => handleSeatChange(party.id as keyof typeof seats, e.target.value)}
                    max={TOTAL_SEATS}
                    min={0}
                  />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={TOTAL_SEATS}
                  value={seats[party.id as keyof typeof seats]}
                  onChange={(e) => handleSeatChange(party.id as keyof typeof seats, e.target.value)}
                  className="custom-range"
                  style={{ '--range-color': party.color } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="simulator-visuals">
          <div className="parliament-chart">
            <h3 className="chart-title"><PieChart size={18} /> Seat Distribution</h3>
            
            <div className="stacked-bar">
              {partiesConfig.map(party => {
                const count = seats[party.id as keyof typeof seats];
                const percentage = (count / TOTAL_SEATS) * 100;
                if (count === 0) return null;
                
                return (
                  <motion.div 
                    key={party.id}
                    className="bar-segment"
                    style={{ width: `${percentage}%`, backgroundColor: party.color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    title={`${party.name}: ${count} seats`}
                  />
                );
              })}
            </div>
            
            <div className="majority-line-container">
              <div className="majority-line"></div>
              <span className="majority-label">272 Seats (Majority)</span>
            </div>
          </div>

          <motion.div 
            className={`winner-card ${winner ? 'has-winner' : 'hung-assembly'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={winner || 'hung'}
          >
            {winner ? (
              <>
                <Trophy size={48} className="winner-icon" style={{ color: partiesConfig.find(p => p.id === winner)?.color }} />
                <h3>Majority Reached!</h3>
                <p><strong>{partiesConfig.find(p => p.id === winner)?.name}</strong> has secured enough seats to form the government.</p>
              </>
            ) : remaining === 0 ? (
              <>
                <AlertCircle size={48} className="winner-icon hung-icon" />
                <h3>Hung Parliament</h3>
                <p>No single party has reached the 272 majority mark. A coalition government will be required.</p>
              </>
            ) : (
              <>
                <PieChart size={48} className="winner-icon waiting-icon" />
                <h3>Allocate Remaining Seats</h3>
                <p>You have {remaining} seats left to allocate across the parties to see the final outcome.</p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
