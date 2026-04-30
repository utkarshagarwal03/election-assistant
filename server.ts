import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Find the last user message
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const lastMessage = userMessages.length > 0 
      ? userMessages[userMessages.length - 1].content.toLowerCase() 
      : "";
    
    let mockReply = "I am a simulated ECI assistant. According to ECI guidelines, ";
    
    if (lastMessage.includes("register") || lastMessage.includes("enroll")) {
      mockReply += "you need to fill out Form 6 to register as a new voter. You can do this online on the NVSP portal or at your local Electoral Registration Office. Make sure you are 18 years or older as of January 1st.";
    } else if (lastMessage.includes("id") || lastMessage.includes("epic") || lastMessage.includes("document")) {
      mockReply += "you must carry your EPIC (Voter ID). If you don't have an EPIC, you can use an approved photo ID like an Aadhaar card, PAN card, Driving License, or Passport to the polling booth to cast your vote.";
    } else if (lastMessage.includes("evm") || lastMessage.includes("vote")) {
      mockReply += "voting is done through Electronic Voting Machines (EVMs). Press the blue button next to your candidate's name. Wait for the beep sound to confirm your vote has been recorded, and you can verify your choice on the VVPAT slip printed alongside it.";
    } else if (lastMessage.includes("date") || lastMessage.includes("when")) {
      mockReply += "election dates differ by state and constituency. Please check the official ECI website for the schedule relevant to your state assembly or parliamentary constituency.";
    } else {
      mockReply += "please refer to the official Election Commission of India website (eci.gov.in) or call the toll-free voter helpline at 1950 for accurate guidance regarding your query.";
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // Simulate streaming to emulate AI feeling
    const words = mockReply.split(' ');
    for (let i = 0; i < words.length; i++) {
        res.write(words[i] + ' ');
        await new Promise(resolve => setTimeout(resolve, 80)); // Typewriter delay
    }
    
    res.end();
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process chat response' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
