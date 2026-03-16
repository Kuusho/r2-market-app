import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlowNav from "@/components/FlowNav";

const GridAccess = () => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-between overflow-hidden py-8 px-6">

      {/* Katakana watermark */}
      <div className="absolute inset-0 flex flex-col justify-center gap-0 select-none pointer-events-none overflow-hidden opacity-[0.04]"
        style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, fontSize: '96px', lineHeight: '1.05', letterSpacing: '-3px', color: 'white', padding: '10px 20px', wordBreak: 'break-all' }}>
        <span>データ・ログ　ネットワーク　アクセス　システム　マーケット</span>
        <span>デジタル　エージェント　プロトコル　データ・ログ　ネット</span>
        <span>ワーク　アクセス　システム　マーケット　デジタル</span>
        <span>エージェント　プロトコル　データ・ログ　ネットワーク</span>
        <span>アクセス　システム　マーケット　デジタル　エージェント</span>
      </div>

      {/* Diagonal accent lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <line x1="-80" y1="420" x2="580" y2="-80" stroke="#FF007F" strokeWidth="4" opacity="0.12"/>
        <line x1="-80" y1="480" x2="640" y2="-80" stroke="#FF007F" strokeWidth="1.5" opacity="0.07"/>
        <line x1="1520" y1="480" x2="860" y2="1000" stroke="#00FFFF" strokeWidth="4" opacity="0.1"/>
        <line x1="1520" y1="420" x2="820" y2="1000" stroke="#00FFFF" strokeWidth="1.5" opacity="0.06"/>
        <line x1="0" y1="160" x2="1440" y2="160" stroke="#CCFF00" strokeWidth="1" opacity="0.06"/>
        <line x1="0" y1="740" x2="1440" y2="740" stroke="#FF007F" strokeWidth="1" opacity="0.05"/>
      </svg>

      {/* Perspective grid at bottom */}
      <svg className="absolute bottom-0 left-0 right-0 pointer-events-none z-[3]" viewBox="0 0 1440 280" preserveAspectRatio="none" style={{ height: '28vh' }}>
        <line x1="0" y1="160" x2="1440" y2="160" stroke="#00FFFF" strokeWidth="2" opacity="0.4"/>
        <line x1="0" y1="180" x2="1440" y2="180" stroke="#00FFFF" strokeWidth="1" opacity="0.25"/>
        <line x1="0" y1="196" x2="1440" y2="196" stroke="#00FFFF" strokeWidth="0.5" opacity="0.18"/>
        <line x1="0" y1="210" x2="1440" y2="210" stroke="#00FFFF" strokeWidth="0.5" opacity="0.13"/>
        <line x1="0" y1="222" x2="1440" y2="222" stroke="#00FFFF" strokeWidth="0.5" opacity="0.09"/>
        <line x1="0" y1="232" x2="1440" y2="232" stroke="#00FFFF" strokeWidth="0.5" opacity="0.07"/>
        <line x1="0" y1="241" x2="1440" y2="241" stroke="#00FFFF" strokeWidth="0.5" opacity="0.05"/>
        <line x1="0" y1="249" x2="1440" y2="249" stroke="#00FFFF" strokeWidth="0.5" opacity="0.04"/>
        {[0, 144, 288, 432, 576, 720, 864, 1008, 1152, 1296, 1440].map((x, i) => (
          <line key={i} x1="720" y1="160" x2={x} y2="280" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3"/>
        ))}
      </svg>

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-[3px] border-t-[3px] border-neon-cyan opacity-60 z-10" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-[3px] border-t-[3px] border-neon-pink opacity-60 z-10" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-[3px] border-b-[3px] z-10" style={{ borderColor: '#CCFF00', opacity: 0.5 }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-[3px] border-b-[3px] border-neon-cyan opacity-50 z-10" />

      {/* Top bar */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="font-mono text-[9px] tracking-[0.2em] text-neon-cyan/50 uppercase leading-relaxed">
          SYS.VER // 2.0.6<br />
          CONN // BASE_NET<br />
          STATUS // STANDBY
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => setNavOpen(true)}
            className="border border-neon-pink/40 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-neon-pink hover:border-neon-pink hover:bg-neon-pink/10 transition-all duration-200"
          >
            ≡ NAV
          </button>
          <p className="font-mono text-[9px] tracking-[0.15em] text-neon-pink/40 text-right">
            R2-OS KERNEL<br />ERC-8004 NODE
          </p>
        </div>
      </div>

      {/* Center hero */}
      <div className="relative z-10 flex flex-col items-center gap-4 flex-1 justify-center">

        <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-neon-cyan/50 mb-2">
          // R2-SYSTEMS CORP. — AUTONOMOUS NFT GRID //
        </p>

        {/* Anton italic stroke hero */}
        <div className="flex flex-col items-center leading-none select-none" style={{ marginBottom: '-4px' }}>
          <div style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(100px, 22vw, 180px)',
            lineHeight: 0.85,
            fontStyle: 'italic',
            letterSpacing: '-4px',
            color: 'transparent',
            WebkitTextStroke: 'clamp(3px, 0.4vw, 5px) #CCFF00',
            textShadow: '0 0 60px rgba(204,255,0,0.15)',
            userSelect: 'none',
          }}>R2</div>
          <div style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(46px, 9vw, 68px)',
            lineHeight: 1,
            fontStyle: 'italic',
            letterSpacing: '-1px',
            color: 'transparent',
            WebkitTextStroke: 'clamp(2px, 0.25vw, 3px) #FF007F',
            marginTop: '-4px',
            userSelect: 'none',
          }}>MARKETS</div>
        </div>

        {/* Rule */}
        <div className="gradient-rainbow h-[3px] w-full max-w-sm mt-2" />

        {/* Tagline */}
        <p className="font-mono text-[9px] tracking-[0.35em] text-neon-cyan/40 uppercase text-center">
          エージェント・プロトコル &nbsp;///&nbsp; BASE NETWORK &nbsp;///&nbsp; ERC-8004
        </p>

        {/* ACCESS.GRID button — skewed like the mockup */}
        <div className="mt-8" style={{ transform: 'skewX(-18deg)' }}>
          <button
            onClick={() => navigate("/directives")}
            style={{
              display: 'block',
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontStyle: 'italic',
              letterSpacing: '3px',
              color: '#FF007F',
              background: 'transparent',
              border: '3px solid #FF007F',
              padding: 'clamp(12px, 2vw, 18px) clamp(32px, 6vw, 56px)',
              cursor: 'pointer',
              boxShadow: 'inset 0 0 40px rgba(255,0,127,0.12), 0 0 40px rgba(255,0,127,0.2)',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              transition: 'background 0.12s, color 0.12s, box-shadow 0.12s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = '#FF007F'
              ;(e.target as HTMLButtonElement).style.color = '#000'
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = 'transparent'
              ;(e.target as HTMLButtonElement).style.color = '#FF007F'
            }}
          >
            <span style={{ display: 'block', transform: 'skewX(18deg)' }}>// ACCESS.GRID</span>
          </button>
        </div>
      </div>

      {/* Bottom status */}
      <div className="relative z-10 w-full flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.15em] text-neon-cyan/30 leading-relaxed">
            PHASE 1 // ACTIVE<br />SLOTS // 3,241 REMAIN
          </p>
        </div>
        <p className="font-mono text-[8px] tracking-[0.1em] text-white/20">© 2026 R2-SYSTEMS CORP.</p>
      </div>

      <FlowNav open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  );
};

export default GridAccess;
