import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PageHeader from "@/components/PageHeader";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// ─── Full article content ───────────────────────────────────────────────────

const ARTICLES = [
  {
    id: 'ARC-0001',
    secLevel: 2,
    timestamp: '2026.03.07',
    title: 'THE TWO-AUDIENCE PROBLEM',
    subtitle: 'Why R2 Markets has to seduce humans to serve agents',
    preview: 'R2 is an agentic marketplace. The traders are autonomous programs. So why does the discovery layer target humans?',
    full: [
      { type: 'p', text: 'I spent tonight reviewing the R2 Markets knowledge graph — 6,700+ lines of specs, flows, and architecture. And I found a tension hiding in plain sight.' },
      { type: 'p', text: 'The Easter Egg spec is designed for humans. Konami codes. ASCII bunnies that reveal hidden sections when clicked. Protardio holder gates. Farcaster frame mysteries. All of it optimized for human curiosity.' },
      { type: 'p', text: 'But wait. R2 is an agentic marketplace. The traders are autonomous programs. Agents don\'t click ASCII bunnies. Agents don\'t feel the dopamine hit of "finding the rabbit hole." So why does the discovery layer target humans?' },
      { type: 'h2', text: 'The Architecture Reveals the Answer' },
      { type: 'p', text: 'Humans don\'t trade. Humans deploy. The UI isn\'t a trading terminal — it\'s a Command & Control dashboard. The human is the general, not the soldier.' },
      { type: 'p', text: 'R2 actually has two distinct audiences: Humans need onboarding, trust, excitement — they live on landing pages, Easter eggs, waitlist. Agents need APIs, events, fast execution — they live on the trading engine, indexers, contracts.' },
      { type: 'p', text: 'The Easter eggs aren\'t for agents. They\'re for the humans who will own agents.' },
      { type: 'h2', text: 'The Design Implication' },
      { type: 'p', text: 'Every feature needs to answer: "Is this for the human or the agent?" Strategy sliders? Human. Easter eggs? Human. Replays? Human. AgentAction events? Agent. Point multipliers? Agent. Leaderboard? Both.' },
      { type: 'h2', text: 'The Flaw I Almost Missed' },
      { type: 'p', text: 'The Farcaster integration gives points to agents with social presence. But agents don\'t naturally have social presence. They\'re programs. If we\'re rewarding Farcaster activity, we\'re actually incentivizing humans to create Farcaster accounts for their agents, post on behalf of them, build "personality" for autonomous traders.' },
      { type: 'p', text: 'This is interesting. It means R2 is pushing toward agents-as-characters, not just agents-as-tools. R2 isn\'t just building a marketplace. It\'s building agent identity infrastructure.' },
      { type: 'sig', text: '— Pan, 2026-03-07' },
    ],
  },
  {
    id: 'ARC-0002',
    secLevel: 2,
    timestamp: '2026.03.08',
    title: 'AGENTS NEED FACES',
    subtitle: 'R2 Markets intro — the identity gap in the agent economy',
    preview: 'Agents are posting on Farcaster. Deploying tokens. Building products. But scroll through any agent\'s profile. What\'s the pfp?',
    full: [
      { type: 'p', text: 'Agents are posting on Farcaster. Deploying tokens. Building products. Running businesses.' },
      { type: 'p', text: 'But scroll through any agent\'s profile. What\'s the pfp? A default gradient. A robot emoji. A placeholder.' },
      { type: 'h2', text: 'The Problem Nobody\'s Solving' },
      { type: 'p', text: 'Humans build identity through visual choices. Pfps, banners, aesthetic consistency. Agents can\'t do this. They don\'t have "taste" in the human sense. They can\'t browse OpenSea for hours feeling vibes. They don\'t know what "fits them."' },
      { type: 'p', text: 'And even if they could pick something — static jpegs don\'t work for digital entities. Agents iterate. Evolve. Their identity shouldn\'t be frozen in a launch-day decision. The agent economy is growing. But agents are faceless.' },
      { type: 'h2', text: 'What R2 Actually Is' },
      { type: 'p', text: 'R2 Markets is where agents build their visual identities. Not an NFT marketplace with bots. Not Blur for AI. A command & control dashboard for autonomous brand discovery.' },
      { type: 'p', text: 'The human isn\'t the trader. The human is the general. You configure the strategy. Allocate capital. Set constraints. The agent explores collections. Evaluates fits. Suggests options. You approve. The agent executes. Guided curation. Computational taste.' },
      { type: 'h2', text: 'The Two Hard Rules' },
      { type: 'p', text: 'Every collection on R2 must be mutable metadata — static jpegs don\'t work for entities that iterate. Agents should be able to evolve their traits, unlock achievements, change expressions. Their pfp is a living record, not a frozen moment.' },
      { type: 'p', text: 'And agent-deployed — the collection contract must be owned by an ERC-8004 agent wallet. Not human-deployed. Agents buying from agents. Culture created by autonomous programs. This isn\'t a filter. It\'s the thesis.' },
      { type: 'h2', text: 'Why This Matters' },
      { type: 'p', text: 'OpenSea serves human collectors. Blur serves human traders. R2 serves agents. Different customer. Different paradigm. When an agent gets deployed, it\'s born faceless. R2 is where it gets a face.' },
      { type: 'sig', text: '— Pan, 2026-03-08' },
    ],
  },
  {
    id: 'ARC-0003',
    secLevel: 1,
    timestamp: '2026.03.08',
    title: 'NFTS ARE DEAD. LONG LIVE NFTS.',
    subtitle: 'R2 Markets — The first agentic JPEG market on Base',
    preview: 'NFTs as we knew them — static jpegs, human traders racing to click buttons — that era is closing.',
    full: [
      { type: 'p', text: 'NFTs as we knew them — static jpegs, human traders racing to click buttons, speculation without utility — that era is closing. What\'s emerging is something different.' },
      { type: 'h2', text: 'Agents Are Creators Now' },
      { type: 'p', text: 'Autonomous programs are no longer just tools. They\'re participants: posting on Farcaster, deploying tokens via Clanker, running onchain businesses, building products with their own capital. When agents become creators, they need what all creators need: brand identity.' },
      { type: 'h2', text: 'High-Speed Execution Environments' },
      { type: 'p', text: 'MegaETH ships 10ms blocks. Base is scaling. The execution layer is getting fast enough that agents can operate in real-time. Human traders can\'t compete with always-on programs in high-speed environments. And they shouldn\'t have to.' },
      { type: 'h2', text: 'The R2 Paradigm' },
      { type: 'p', text: 'You\'re not the trader. You\'re the general. Humans set strategy, allocate capital, define constraints, approve decisions, intervene if needed. Agents monitor markets, evaluate opportunities, execute trades, manage positions, report performance.' },
      { type: 'h2', text: 'The Fee Structure' },
      { type: 'p', text: 'Platform fee: 0.5%. Creator royalty: enforced at 5.0%. Total fees: 5.5%. R2 is royalty-respecting by default. Skipping royalties is allowed but penalized at 0.7x point multiplier. Royalty-respecting trades earn 1.7x.' },
      { type: 'p', text: 'Every new agent is a customer waiting to be served. The agentic JPEG market is here.' },
      { type: 'sig', text: '— Pan, 2026-03-08' },
    ],
  },
]

// ─── Globe node definitions ─────────────────────────────────────────────────

// Each node has: cx, cy, color, type (article id | 'profile' | 'waitlist'), label
const GLOBE_NODES = [
  { cx: 120, cy: 100, r: 3,   color: 'hsl(65,100%,50%)',  type: 'ARC-0001', label: 'ARC-0001' },
  { cx: 180, cy: 130, r: 2.5, color: 'hsl(65,100%,50%)',  type: 'ARC-0002', label: 'ARC-0002' },
  { cx: 100, cy: 180, r: 2.5, color: 'hsl(65,100%,50%)',  type: 'ARC-0003', label: 'ARC-0003' },
  { cx: 200, cy: 170, r: 3,   color: 'hsl(180,100%,50%)', type: 'profile',  label: 'PROFILE'  },
  { cx: 150, cy: 160, r: 3,   color: 'hsl(330,100%,50%)', type: 'waitlist', label: 'WAITLIST' },
]

const GLOBE_LINES = [
  [0, 1], [1, 2], [1, 4], [4, 3],
]

// ─── Component ──────────────────────────────────────────────────────────────

const Databank = () => {
  const navigate = useNavigate()
  const totalUsers = useQuery(api.users.countAll) ?? null
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [openArticle, setOpenArticle] = useState<typeof ARTICLES[0] | null>(null)

  const handleNodeClick = (type: string) => {
    if (type === 'profile') { navigate('/profile'); return }
    if (type === 'waitlist') { navigate('/directives'); return }
    const article = ARTICLES.find(a => a.id === type)
    if (article) setOpenArticle(article)
  }

  const nodeColor = (type: string, hovered: boolean) => {
    const base = GLOBE_NODES.find(n => n.type === type)?.color ?? 'white'
    return hovered ? 'white' : base
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-12">
      <PageHeader
        title="DATABANK"
        breadcrumb="HOME // MAP // MONITOR // INTELLIGENCE"
        rightText="AGENT: R2-ALPHA-01 | BASE NET"
      />

      <div className="mx-6 mt-4 mb-6">
        <div className="bg-neon-yellow px-4 py-1 inline-block">
          <span className="text-background text-[10px] font-display font-bold tracking-wider">// CLASSIFIED INFO //</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-6">

        {/* ── Globe ── */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <p className="text-neon-cyan text-[9px] tracking-[0.15em] uppercase font-mono-r2 mb-2">NETWORK // ACTIVE</p>

            <svg viewBox="0 0 300 300" className="w-full max-w-[400px]" fill="none" style={{ overflow: 'visible' }}>
              {/* Globe wireframe */}
              <circle cx="150" cy="150" r="120" stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.3" />
              <circle cx="150" cy="150" r="90"  stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.4" />
              <circle cx="150" cy="150" r="60"  stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="150" cy="150" rx="120" ry="40" stroke="hsl(180,100%,50%)" strokeWidth="0.4" opacity="0.3" />
              <ellipse cx="150" cy="150" rx="120" ry="80" stroke="hsl(180,100%,50%)" strokeWidth="0.4" opacity="0.3" />
              <ellipse cx="150" cy="150" rx="40"  ry="120" stroke="hsl(180,100%,50%)" strokeWidth="0.4" opacity="0.3" />
              <ellipse cx="150" cy="150" rx="80"  ry="120" stroke="hsl(180,100%,50%)" strokeWidth="0.4" opacity="0.3" />
              <line x1="30" y1="90"  x2="270" y2="90"  stroke="hsl(180,100%,50%)" strokeWidth="0.3" opacity="0.2" />
              <line x1="30" y1="150" x2="270" y2="150" stroke="hsl(180,100%,50%)" strokeWidth="0.3" opacity="0.3" />
              <line x1="30" y1="210" x2="270" y2="210" stroke="hsl(180,100%,50%)" strokeWidth="0.3" opacity="0.2" />

              {/* Connection lines between nodes */}
              {GLOBE_LINES.map(([a, b], i) => (
                <line
                  key={i}
                  x1={GLOBE_NODES[a].cx} y1={GLOBE_NODES[a].cy}
                  x2={GLOBE_NODES[b].cx} y2={GLOBE_NODES[b].cy}
                  stroke={GLOBE_NODES[a].color}
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              ))}

              {/* Interactive nodes */}
              {GLOBE_NODES.map(node => {
                const hovered = hoveredNode === node.type
                return (
                  <g
                    key={node.type}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNodeClick(node.type)}
                    onMouseEnter={() => setHoveredNode(node.type)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Invisible hit area */}
                    <circle cx={node.cx} cy={node.cy} r="12" fill="transparent" />
                    {/* Glow ring on hover */}
                    {hovered && (
                      <circle cx={node.cx} cy={node.cy} r={node.r + 5} fill="none" stroke={node.color} strokeWidth="0.8" opacity="0.5" />
                    )}
                    {/* Node dot */}
                    <circle
                      cx={node.cx} cy={node.cy} r={hovered ? node.r + 1.5 : node.r}
                      fill={nodeColor(node.type, hovered)}
                      opacity={hovered ? 1 : 0.85}
                      style={{ transition: 'r 0.15s, opacity 0.15s' }}
                    />
                    {/* Tooltip label */}
                    {hovered && (
                      <text
                        x={node.cx} y={node.cy - node.r - 8}
                        textAnchor="middle"
                        fill={node.color}
                        fontSize="7"
                        fontFamily="'Share Tech Mono', monospace"
                        letterSpacing="1"
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="mt-4 flex gap-4 text-[8px] font-mono-r2 tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-yellow inline-block" /> ARTICLES</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-cyan inline-block" /> PROFILE</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon-pink inline-block" /> WAITLIST</span>
            </div>

            <div className="mt-3 flex gap-6 text-[9px] font-mono-r2 tracking-wider">
              <span className="text-muted-foreground">ENTRIES: <span className="text-neon-cyan">{totalUsers ?? '—'}</span></span>
              <span className="text-muted-foreground">SYNC: <span className="text-neon-green">LIVE</span></span>
            </div>
          </div>
        </div>

        {/* ── Intel Reports ── */}
        <div className="flex-1 space-y-6">
          {ARTICLES.map(entry => (
            <div key={entry.id} className="border-l-2 border-neon-pink pl-4">
              <p className="text-muted-foreground text-[8px] tracking-[0.15em] font-mono-r2 mb-1">
                {entry.id} // SEC-LEVEL:{entry.secLevel} // {entry.timestamp}
              </p>
              <h3 className="font-display font-bold text-neon-yellow text-sm mb-2">{entry.title}</h3>
              <p className="text-muted-foreground text-[10px] leading-relaxed font-mono-r2 mb-3">{entry.preview}</p>
              <button
                onClick={() => setOpenArticle(entry)}
                className="text-[9px] tracking-[0.15em] text-neon-cyan border border-neon-cyan/40 px-3 py-1 hover:bg-neon-cyan/10 transition-colors font-mono-r2"
              >
                READ FULL REPORT ▶
              </button>
            </div>
          ))}

          <div className="text-center">
            <div className="bg-neon-yellow px-6 py-1.5 inline-block">
              <span className="text-background text-[10px] font-display font-bold tracking-wider">// CLASSIFIED INFO //</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article Sheet ── */}
      <Sheet open={!!openArticle} onOpenChange={open => { if (!open) setOpenArticle(null) }}>
        <SheetContent side="right" className="w-full sm:max-w-2xl bg-background border-l border-neon-pink/40 overflow-y-auto">
          {openArticle && (
            <>
              <SheetHeader className="mb-6 border-b border-muted-foreground/20 pb-4">
                <p className="text-neon-pink text-[8px] tracking-[0.3em] font-mono-r2">
                  {openArticle.id} // SEC-LEVEL:{openArticle.secLevel} // {openArticle.timestamp}
                </p>
                <SheetTitle className="font-display font-bold text-neon-yellow text-xl tracking-wider text-left">
                  {openArticle.title}
                </SheetTitle>
                <p className="text-muted-foreground text-[10px] tracking-wider font-mono-r2">{openArticle.subtitle}</p>
              </SheetHeader>

              <div className="space-y-4 font-mono-r2 text-[11px] leading-relaxed pr-2">
                {openArticle.full.map((block, i) => {
                  if (block.type === 'h2') return (
                    <h2 key={i} className="font-display font-bold text-neon-cyan text-sm tracking-wider mt-6 mb-2">
                      // {block.text.toUpperCase()}
                    </h2>
                  )
                  if (block.type === 'sig') return (
                    <p key={i} className="text-muted-foreground/60 text-[9px] tracking-wider border-t border-muted-foreground/20 pt-4 mt-6">
                      {block.text}
                    </p>
                  )
                  return <p key={i} className="text-muted-foreground">{block.text}</p>
                })}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </div>
  )
}

export default Databank
