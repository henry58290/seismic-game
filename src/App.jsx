import React, { useState, useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('intro');
  const [player, setPlayer] = useState({
    x: 400,
    y: 300,
    angle: 0,
    speed: 0,
    money: 0
  });
  const [keys, setKeys] = useState({});
  const [currentSpot, setCurrentSpot] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [visited, setVisited] = useState([]);
  const [toast, setToast] = useState(null);
  const animRef = useRef();

  const spots = [
    {
      id: 'tea',
      x: 420,
      y: 280,
      name: 'Tea Corner',
      emoji: '☕',
      color: '#ff6b35',
      info: {
        title: 'Privacy 101! 🔐',
        text: 'Listen up! Traditional blockchain = everything is PUBLIC. Like posting your salary on social media!\n\nSeismic gives you PRIVACY:\n• Your transaction, YOUR choice\n• Show it or hide it - you decide\n• Zero-knowledge proofs - prove stuff without revealing data\n\nExample: Prove you have $10,000 without revealing your exact balance! Magic! 🪄',
        reward: 500
      }
    },
    {
      id: 'food',
      x: 180,
      y: 450,
      name: 'The Food Spot',
      emoji: '🍛',
      color: '#f7b731',
      info: {
        title: 'What is DeFi? 💰',
        text: 'Simple! DeFi = Bank without the Bank\n\nNormal way:\nBank controls your money\nBank decides interest\nNeed permission\n\nDeFi way:\nSmart Contract runs automatically\nYOU control it\nNo permission needed!\n\nSeismic DeFi + Privacy = KILLER COMBO! 🔥\n\nLending, borrowing, trading - all PRIVATE!',
        reward: 600
      }
    },
    {
      id: 'market',
      x: 650,
      y: 180,
      name: 'Market Plaza',
      emoji: '🥬',
      color: '#26de81',
      info: {
        title: 'Smart Contracts! 📝',
        text: 'Smart Contract = If-Then code on blockchain\n\nExample:\n"If I dont get home by 10pm, automatically send my friend $50"\n\nCode:\nif (time > 10pm && location != home) {\n  transfer(50, friend);\n}\n\nThis code lives on blockchain - nobody can change it!\n\nSeismic + privacy:\n• Location stays private\n• Amount stays private\n• Transaction happens silently 😎',
        reward: 700
      }
    },
    {
      id: 'garage',
      x: 820,
      y: 420,
      name: 'Fix-It Garage',
      emoji: '🔧',
      color: '#fd79a8',
      info: {
        title: 'Security First! 🛡️',
        text: 'In blockchain, security = EVERYTHING!\n\n3 golden rules:\n1. Private Keys = Your house keys\n   Lost = Everything GONE! 💸\n\n2. Test your Smart Contracts\n   Bug = Money disappears 🚨\n\n3. Privacy does NOT equal Security\n   You need BOTH!\n\nSeismic provides:\n✅ Military-grade encryption\n✅ Audited code\n✅ Privacy AND security\n\nPro tip: Use hardware wallets!',
        reward: 550
      }
    },
    {
      id: 'code',
      x: 320,
      y: 620,
      name: 'Code Lab',
      emoji: '💻',
      color: '#a29bfe',
      info: {
        title: 'Lets Code! 👨‍💻',
        text: 'Working with Seismic is super easy!\n\nSetup (5 minutes):\nnpm install seismic-sdk\nconst seismic = require("seismic-sdk");\n\nFirst Transaction:\nseismic.send({\n  to: "0xABC...",\n  amount: 100,\n  private: true\n});\n\nBoom! Private transaction done!\n\nTutorials: docs.seismic.network\nCommunity: Join Discord - 24/7 help! 🤝',
        reward: 800
      }
    },
    {
      id: 'vision',
      x: 580,
      y: 520,
      name: 'Vision Hub',
      emoji: '🚀',
      color: '#ffeaa7',
      info: {
        title: 'The Future! 🚀',
        text: 'Blockchain future = Privacy + Speed + Scale\n\nSeismic roadmap:\nQ1 2025: Cross-chain bridges\nQ2 2025: AI-powered compliance\nQ3 2025: Mobile SDK\nQ4 2025: 1 million TPS!\n\nReal use cases:\n💳 Private instant payments\n🏦 Bank accounts on blockchain\n💼 Encrypted payroll systems\n🏪 Retail payments (instant + private)\n\nThe revolution is HERE!\nPrivacy = Your RIGHT! 🌍',
        reward: 1000
      }
    }
  ];

  const addToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const checkNearSpot = () => {
    spots.forEach(spot => {
      const dx = player.x - spot.x;
      const dy = player.y - spot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 50 && !visited.includes(spot.id)) {
        if (currentSpot?.id !== spot.id) {
          setCurrentSpot(spot);
          addToast(`${spot.emoji} ${spot.name} - Press SPACE!`);
        }
      }
    });
  };

  const visitSpot = () => {
    if (currentSpot && !visited.includes(currentSpot.id)) {
      setShowPopup(true);
    }
  };

  const completeSpot = () => {
    if (currentSpot) {
      setPlayer(p => ({ ...p, money: p.money + currentSpot.info.reward }));
      setVisited([...visited, currentSpot.id]);
      addToast(`+$${currentSpot.info.reward} earned! 💰`);
      
      if (visited.length + 1 >= spots.length) {
        setTimeout(() => setGameState('win'), 1500);
      }
      
      setShowPopup(false);
      setCurrentSpot(null);
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const loop = () => {
      ctx.fillStyle = '#2d3436';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);

      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1000; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 800);
        ctx.stroke();
      }
      for (let y = 0; y < 800; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1000, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#34495e';
      ctx.lineWidth = 40;
      spots.forEach((spot, i) => {
        if (i < spots.length - 1) {
          const next = spots[i + 1];
          ctx.beginPath();
          ctx.moveTo(spot.x, spot.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      });

      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      spots.forEach((spot, i) => {
        if (i < spots.length - 1) {
          const next = spots[i + 1];
          ctx.beginPath();
          ctx.moveTo(spot.x, spot.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);

      spots.forEach(spot => {
        const done = visited.includes(spot.id);
        const active = currentSpot?.id === spot.id;
        
        ctx.fillStyle = done ? '#2ecc71' : active ? spot.color : '#95a5a6';
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, 35, 0, Math.PI * 2);
        ctx.fill();

        if (active && !done) {
          ctx.strokeStyle = spot.color;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(spot.x, spot.y, 40 + Math.sin(Date.now() / 300) * 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(spot.emoji, spot.x, spot.y);

        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(spot.name, spot.x, spot.y + 50);
        ctx.fillText(spot.name, spot.x, spot.y + 50);

        if (done) {
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#fff';
          ctx.fillText('✓', spot.x + 20, spot.y - 20);
        }
      });

      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      ctx.fillStyle = '#f39c12';
      ctx.fillRect(-15, -20, 30, 40);
      ctx.fillStyle = '#3498db';
      ctx.fillRect(-8, -12, 16, 8);
      
      if (Math.abs(player.speed) > 0.1) {
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(-10, 15, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, 15, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.speed = Math.min(player.speed + 0.3, 4);
      } else if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.speed = Math.max(player.speed - 0.3, -2);
      } else {
        player.speed *= 0.92;
      }

      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.angle -= 0.06;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.angle += 0.06;
      }

      player.x += Math.sin(player.angle) * player.speed;
      player.y -= Math.cos(player.angle) * player.speed;

      player.x = Math.max(50, Math.min(950, player.x));
      player.y = Math.max(50, Math.min(750, player.y));

      ctx.restore();

      ctx.fillStyle = 'rgba(46, 204, 113, 0.9)';
      ctx.fillRect(20, 20, 180, 70);
      ctx.strokeStyle = '#27ae60';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, 180, 70);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('💰 Cash', 30, 45);
      ctx.font = 'bold 26px Arial';
      ctx.fillStyle = '#f1c40f';
      ctx.fillText(`$${player.money}`, 30, 75);

      ctx.fillStyle = 'rgba(155, 89, 182, 0.9)';
      ctx.fillRect(canvas.width - 220, 20, 200, 60);
      ctx.strokeStyle = '#8e44ad';
      ctx.strokeRect(canvas.width - 220, 20, 200, 60);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`Spots: ${visited.length}/${spots.length}`, canvas.width - 30, 45);
      
      const progress = visited.length / spots.length;
      ctx.fillStyle = '#34495e';
      ctx.fillRect(canvas.width - 210, 55, 180, 12);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(canvas.width - 210, 55, 180 * progress, 12);

      if (visited.length === 0) {
        ctx.fillStyle = 'rgba(231, 76, 60, 0.95)';
        ctx.fillRect(canvas.width / 2 - 140, canvas.height - 90, 280, 65);
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width / 2 - 140, canvas.height - 90, 280, 65);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚗 WASD / Arrows = Drive', canvas.width / 2, canvas.height - 65);
        ctx.fillText('SPACE = Visit spot', canvas.width / 2, canvas.height - 42);
      }

      checkNearSpot();
      animRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, player, keys, currentSpot, visited]);

  useEffect(() => {
    const down = (e) => {
      setKeys(k => ({ ...k, [e.key]: true }));
      if (e.key === ' ' && currentSpot) {
        e.preventDefault();
        visitSpot();
      }
    };
    const up = (e) => setKeys(k => ({ ...k, [e.key]: false }));

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [currentSpot]);

  if (gameState === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '700px', textAlign: 'center' }}>
          <div style={{ fontSize: '100px', marginBottom: '20px' }}>🛺</div>
          <h1 style={{
            fontSize: '72px',
            fontWeight: '900',
            color: '#fff',
            textShadow: '4px 4px 0 #000',
            marginBottom: '10px'
          }}>
            SEISMIC STREET
          </h1>
          <p style={{
            fontSize: '28px',
            color: '#f1c40f',
            fontWeight: 'bold',
            textShadow: '2px 2px 0 #000',
            marginBottom: '40px'
          }}>
            Learn Blockchain, Street Style! 🔥
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            border: '4px solid #f39c12',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: '#f39c12', fontSize: '24px', marginBottom: '20px' }}>
              🎮 How to Play?
            </h2>
            <div style={{ textAlign: 'left', color: '#fff', fontSize: '18px', lineHeight: '1.8' }}>
              <p>🛺 Drive your auto rickshaw (WASD or Arrows)</p>
              <p>📍 Visit 6 street spots</p>
              <p>☕ Learn about Seismic at each location</p>
              <p>💰 Earn cash and level up!</p>
              <p>🏆 Complete all spots = WIN!</p>
            </div>
          </div>

          <button
            onClick={() => setGameState('playing')}
            style={{
              background: 'linear-gradient(45deg, #f39c12, #e67e22)',
              border: '5px solid #000',
              borderRadius: '15px',
              color: '#fff',
              fontSize: '36px',
              fontWeight: '900',
              padding: '20px 60px',
              cursor: 'pointer',
              textShadow: '2px 2px 0 #000',
              boxShadow: '0 8px 0 #c0392b'
            }}
          >
            LETS GO! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'win') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ maxWidth: '700px', textAlign: 'center' }}>
          <div style={{ fontSize: '120px', marginBottom: '20px' }}>🏆</div>
          <h1 style={{
            fontSize: '64px',
            fontWeight: '900',
            color: '#fff',
            textShadow: '4px 4px 0 #000',
            marginBottom: '20px'
          }}>
            BOSS LEVEL! 🔥
          </h1>
          <p style={{
            fontSize: '32px',
            color: '#f1c40f',
            fontWeight: 'bold',
            textShadow: '2px 2px 0 #000',
            marginBottom: '40px'
          }}>
            You are a Seismic Expert now! 🎓
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '20px',
            padding: '30px',
            border: '4px solid #2ecc71',
            marginBottom: '30px'
          }}>
            <h2 style={{ color: '#2ecc71', fontSize: '28px', marginBottom: '20px' }}>Your Score</h2>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f1c40f', marginBottom: '10px' }}>
              ${player.money}
            </div>
            <div style={{ color: '#fff', fontSize: '20px' }}>
              {visited.length}/{spots.length} spots completed! ✅
            </div>
          </div>

          <div style={{
            background: 'rgba(241, 196, 15, 0.2)',
            border: '3px solid #f39c12',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#f1c40f', marginBottom: '15px', fontSize: '22px' }}>🎓 Now You Know:</h3>
            <ul style={{ color: '#fff', fontSize: '18px', lineHeight: '2' }}>
              <li>✅ What privacy blockchain is</li>
              <li>✅ How DeFi actually works</li>
              <li>✅ Writing smart contracts</li>
              <li>✅ Security and compliance</li>
              <li>✅ The future of blockchain!</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setGameState('intro');
              setPlayer({ x: 400, y: 300, angle: 0, speed: 0, money: 0 });
              setVisited([]);
              setCurrentSpot(null);
            }}
            style={{
              background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
              border: '5px solid #000',
              borderRadius: '15px',
              color: '#fff',
              fontSize: '28px',
              fontWeight: '900',
              padding: '15px 40px',
              cursor: 'pointer',
              textShadow: '2px 2px 0 #000',
              boxShadow: '0 6px 0 #7f2c1f',
              marginBottom: '20px'
            }}
          >
            🔄 Play Again
          </button>

          <p style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
            Now go build something! 💻<br />
            <span style={{ color: '#f1c40f' }}>docs.seismic.network</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      {toast && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(231, 76, 60, 0.95)',
          border: '4px solid #000',
          borderRadius: '15px',
          padding: '20px 40px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '2px 2px 0 #000',
          zIndex: 100
        }}>
          {toast}
        </div>
      )}

      {showPopup && currentSpot && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            border: `6px solid ${currentSpot.color}`,
            borderRadius: '25px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'hidden'
          }}>
            <div style={{
              background: currentSpot.color,
              padding: '25px',
              borderBottom: '4px solid #000'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>
                    LEVEL {visited.length + 1}/{spots.length}
                  </div>
                  <h2 style={{
                    fontSize: '36px',
                    fontWeight: '900',
                    color: '#fff',
                    margin: 0,
                    textShadow: '3px 3px 0 #000'
                  }}>
                    {currentSpot.info.title}
                  </h2>
                </div>
                <div style={{ fontSize: '64px' }}>
                  {currentSpot.emoji}
                </div>
              </div>
            </div>

            <div style={{
              padding: '30px',
              maxHeight: '50vh',
              overflowY: 'auto',
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#ecf0f1',
              whiteSpace: 'pre-wrap'
            }}>
              {currentSpot.info.text}
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '20px 30px',
              borderTop: '3px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1c40f' }}>
                💰 +${currentSpot.info.reward}
              </div>
              <button
                onClick={completeSpot}
                style={{
                  background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                  border: '4px solid #000',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '24px',
                  fontWeight: '900',
                  padding: '12px 35px',
                  cursor: 'pointer',
                  textShadow: '2px 2px 0 #000',
                  boxShadow: '0 5px 0 #1e8449'
                }}
              >
                Got it! ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;