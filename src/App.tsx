import { createContext, useContext, useEffect, useState } from "react";
import martialLawLogo from "./assets/martial-law-logo.png";

type Page = "home" | "about" | "team" | "play" | "patch-notes";
type Status = "online" | "offline" | "maintenance";

// Edit these values to connect your server and add your final site background.
const siteConfig = {
  server: {
    joinCode: "m44y6ba",
    capacityFallback: 200,
    version: "2.4.1",
  },
  background: {
    type: "none" as "none" | "image" | "video",
    src: "",
    poster: "",
  },
};

type ServerInfo = {
  status: Status;
  players: number;
  capacity: number;
  name: string;
};

const ServerContext = createContext<ServerInfo>({
  status: "online",
  players: 0,
  capacity: siteConfig.server.capacityFallback,
  name: "Martial Law",
});

const navItems: { label: string; page?: Page; href?: string }[] = [
  { label: "About", page: "about" },
  { label: "Team", page: "team" },
  { label: "Play", page: "play" },
  { label: "Patch Notes", page: "patch-notes" },
];

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d={diagonal ? "M5 15 15 5M7 5h8v8" : "M4 10h12M11 5l5 5-5 5"} />
    </svg>
  );
}

function Logo() {
  return (
    <div className="logo" aria-label="Martial Law Roleplay">
      <img className="logo-image" src={martialLawLogo} alt="" />
      <span className="logo-copy"><strong>MARTIAL LAW</strong><small>ROLEPLAY</small></span>
    </div>
  );
}

function Button({ children, secondary = false, onClick, href }: {
  children: React.ReactNode; secondary?: boolean; onClick?: () => void; href?: string;
}) {
  const content = <>{children}<ArrowIcon diagonal={secondary} /></>;
  const className = `button ${secondary ? "button-secondary" : ""}`;
  return href
    ? <a className={className} href={href} onClick={onClick}>{content}</a>
    : <button className={className} onClick={onClick}>{content}</button>;
}

function StatusBadge({ status, compact = false }: { status?: Status; compact?: boolean }) {
  const server = useContext(ServerContext);
  const currentStatus = status ?? server.status;
  const labels = { online: "Server online", offline: "Server offline", maintenance: "Maintenance" };
  return (
    <div className={`status-badge status-${currentStatus} ${compact ? "compact" : ""}`}>
      <span className="status-dot"><i /></span>
      <div><span>{labels[currentStatus]}</span>{!compact && <strong>{currentStatus === "online" ? `${server.players} / ${server.capacity} players` : "Check Discord"}</strong>}</div>
    </div>
  );
}

function SiteBackground() {
  const { type, src, poster } = siteConfig.background;
  if (!src || type === "none") return null;
  if (type === "video") {
    return <video className="site-background" src={src} poster={poster || undefined} autoPlay muted loop playsInline aria-hidden="true" />;
  }
  return <img className="site-background" src={src} alt="" aria-hidden="true" />;
}

function Nav({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (p: Page) => { navigate(p); setOpen(false); };

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <button className="logo-button" onClick={() => go("home")}><Logo /></button>
      <nav className="desktop-links" aria-label="Main navigation">
        {navItems.map((item) => item.page
          ? <button key={item.label} className={page === item.page ? "active" : ""} onClick={() => go(item.page!)}>{item.label}</button>
          : <a key={item.label} href={item.href}>{item.label}</a>
        )}
      </nav>
      <div className="nav-actions">
        <button className="nav-play" onClick={() => go("play")}>Play now</button>
        <a className="nav-discord" href="https://discord.com/">Join Discord</a>
      </div>
      <button className={`menu-toggle ${open ? "open" : ""}`} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-menu-inner">
          {navItems.map((item, i) => item.page
            ? <button key={item.label} onClick={() => go(item.page!)}><span>0{i + 1}</span>{item.label}</button>
            : <a key={item.label} href={item.href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{item.label}</a>
          )}
          <a href="https://discord.com/" onClick={() => setOpen(false)}><span>05</span>Discord</a>
          <div className="mobile-status"><StatusBadge /></div>
        </div>
      </div>
    </header>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label">{children}</div>;
}

function PageHero({ label, title, description }: {
  label: string; title: string; description: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-content">
        <SectionLabel>{label}</SectionLabel>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function FeatureGrid({ items }: { items: { number: string; title: string; text: string }[] }) {
  return (
    <div className="feature-grid">
      {items.map((item) => (
        <article className="feature-item" key={item.title}>
          <span>{item.number}</span>
          <div className="feature-line" />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function Home({ navigate }: { navigate: (p: Page) => void }) {
  const server = useContext(ServerContext);
  return (
    <>
      <section className="home-hero">
        <div className="hero-gridline" />
        <div className="hero-content">
          <img className="hero-logo" src={martialLawLogo} alt="Martial Law" />
          <SectionLabel>FiveM roleplay</SectionLabel>
          <h1>Martial Law<br /><span>Roleplay</span></h1>
          <p>Step into a living roleplay community built around immersive stories, meaningful characters, and a city that never stops moving.</p>
          <div className="button-row">
            <Button onClick={() => navigate("play")}>Play now</Button>
            <Button secondary href="https://discord.com/">Join Discord</Button>
          </div>
        </div>
      </section>

      <section className="home-start">
        <div className="start-guide">
          <SectionLabel>Getting started</SectionLabel>
          <h2>Come prepared</h2>
          <p>A few essentials before you connect—keep the city clean and the stories strong.</p>
          <div className="start-list">
            {[
              "Read the server rules before you play.",
              "Respect other players and staff at all times.",
              "Use /report in-game if you need help.",
              "Stay connected on Discord for announcements.",
            ].map((item, i) => <div key={item}><span>0{i + 1}</span><p>{item}</p></div>)}
          </div>
        </div>
        <div className="home-status-panel">
          <SectionLabel>Server status</SectionLabel>
          <p>Live server information from FiveM.</p>
          <div className="status-rows">
            <div><span>Status</span><StatusBadge compact /></div>
            <div><span>Players</span><strong>{server.players} / {server.capacity}</strong></div>
            <div><span>Server</span><strong>{server.name}</strong></div>
            <div><span>Version</span><strong>{siteConfig.server.version}</strong></div>
          </div>
          <Button onClick={() => navigate("play")}>Join server</Button>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <PageHero label="About the community" title="Built for the next generation of roleplay" description="A quality-first roleplay community made for players who expect depth, consistency, and stories worth remembering." />
      <section className="section about-copy">
        <SectionLabel>01 — Our philosophy</SectionLabel>
        <div className="split-copy">
          <h2>Not just another<br />city on the <em>list.</em></h2>
          <div>
            <p className="lead">MARTIAL LAW is a persistent FiveM roleplay world built around character-led storytelling and thoughtful systems.</p>
            <p>We believe the best roleplay doesn't come from a script. It emerges when well-crafted systems, mature players, and a supportive team create room for unexpected stories. Our staff exists to protect that space—not control it.</p>
          </div>
        </div>
        <FeatureGrid items={[
          { number: "01", title: "Immersive roleplay", text: "Quality-first roleplay and meaningful, long-form stories." },
          { number: "02", title: "Active staff", text: "Responsive, fair support from a team invested in the city." },
          { number: "03", title: "Custom systems", text: "Unique systems designed specifically for our community." },
          { number: "04", title: "Growing community", text: "Events, organizations, businesses, and player-driven stories." },
        ]} />
      </section>
      <section className="section principles">
        <SectionLabel>02 — How we build</SectionLabel>
        <div className="principle-list">
          {[
            ["Community first", "Feedback drives our direction. We build with players, not simply for them."],
            ["Quality over noise", "Every system earns its place by making roleplay deeper, clearer, or more rewarding."],
            ["Always evolving", "Frequent releases keep the experience refined while respecting established stories."],
          ].map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
      <Community />
    </>
  );
}

function Team() {
  const team = [
    ["Founder", "Community direction and leadership"],
    ["Management", "Operations and player experience"],
    ["Development", "Systems, performance, and releases"],
    ["Staff Team", "Support, moderation, and community care"],
  ];
  return (
    <>
      <PageHero label="Behind the city" title="Meet the team" description="A focused group of staff and developers committed to fair support, consistent standards, and long-term roleplay." />
      <section className="section team-section">
        <SectionLabel>Martial Law staff</SectionLabel>
        <div className="team-grid">
          {team.map(([role, text], i) => <article key={role}><span>0{i + 1}</span><div className="team-avatar">ML</div><h2>{role}</h2><p>{text}</p></article>)}
        </div>
      </section>
      <Community />
    </>
  );
}

function Play() {
  const server = useContext(ServerContext);
  const steps = [
    ["Install FiveM", "Download and install the official FiveM client. You will need a legitimate copy of Grand Theft Auto V."],
    ["Launch FiveM", "Open the client and sign in with your Cfx.re account. Let any required updates complete."],
    ["Connect to the server", "Use the direct connect button below or search “MARTIAL LAW” in the server browser."],
    ["Join the community", "Enter our Discord for rules, announcements, character support, and community information."],
  ];
  return (
    <>
      <PageHero label="Your journey starts here" title="Jump into the city" description="Everything you need to start your story. Four steps, one city, endless possibilities." />
      <section className="section play-section">
        <SectionLabel>How to connect</SectionLabel>
        <h2>From download to<br />downtown.</h2>
        <div className="steps">
          {steps.map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p><i /></article>)}
        </div>
      </section>
      <section className="server-panel-wrap">
        <div className="server-panel">
          <div className="server-panel-top"><div><SectionLabel>Live server information</SectionLabel><h2>City status</h2></div><StatusBadge /></div>
          <div className="server-stats">
            <div><span>Players online</span><strong>{server.players}</strong><small>Current</small></div>
            <div><span>Server capacity</span><strong>{server.capacity}</strong><small>Maximum</small></div>
            <div><span>Server version</span><strong>{siteConfig.server.version}</strong><small>Current build</small></div>
            <div><span>Connection address</span><strong className="address">cfx.re/join/{siteConfig.server.joinCode || "YOUR_CODE"}</strong><small>Direct connect</small></div>
          </div>
        </div>
      </section>
      <section className="play-cta">
        <SectionLabel>The city is waiting</SectionLabel>
        <h2>Ready to start<br />your <em>story?</em></h2>
        <p>Choose who you want to become. We'll see you on the other side.</p>
        <div className="button-row"><Button href={`https://cfx.re/join/${siteConfig.server.joinCode || "YOUR_CODE"}`}>Connect to server</Button><Button secondary href="https://discord.com/">Join Discord</Button></div>
      </section>
    </>
  );
}

const updates = [
  { version: "v2.4.1", date: "MAY 24, 2025", category: "FEATURE", title: "A new chapter for player-owned businesses", intro: "Expanded business tools, deeper management, and more ways to build an empire.", details: ["Added customizable employee roles and permissions", "Introduced stock management and supplier contracts", "Added weekly business analytics and activity reports"] },
  { version: "v2.4.0", date: "MAY 10, 2025", category: "UPDATE", title: "Life in the city, refined", intro: "A broad quality-of-life update focused on daily interactions and performance.", details: ["Redesigned interaction prompts across all public locations", "Improved client performance in high-density areas", "Updated inventory transitions and feedback"] },
  { version: "v2.3.8", date: "APR 28, 2025", category: "FIX", title: "Stability and vehicle handling", intro: "Targeted fixes for vehicle synchronization, garages, and persistent state.", details: ["Resolved rare vehicle duplication after server restart", "Fixed garage access permissions for shared properties", "Improved network synchronization during pursuits"] },
  { version: "v2.3.5", date: "APR 12, 2025", category: "COMMUNITY", title: "Spring community season", intro: "New city events, creator initiatives, and community-led weekend experiences.", details: ["Added rotating community event locations", "Launched the verified creator program", "Published updated organization application guidelines"] },
];

function PatchNotes() {
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState(0);
  const filtered = updates.filter((u) => filter === "ALL" || (filter === "FEATURES" && u.category === "FEATURE") || (filter === "FIXES" && u.category === "FIX") || (filter === "UPDATES" && u.category === "UPDATE"));
  return (
    <>
      <PageHero label="Release notes" title="Server updates" description="Everything new in the city—from major systems and community events to the smallest quality-of-life fixes." />
      <section className="section patches">
        <div className="patch-toolbar">
          <SectionLabel>Latest releases</SectionLabel>
          <div className="filters">{["ALL", "FEATURES", "FIXES", "UPDATES"].map((f) => <button className={filter === f ? "active" : ""} key={f} onClick={() => setFilter(f)}>{f}</button>)}</div>
        </div>
        <div className="update-list">
          {filtered.map((update) => {
            const originalIndex = updates.indexOf(update);
            const isOpen = expanded === originalIndex;
            return <article className={`update ${isOpen ? "open" : ""}`} key={update.version}>
              <button className="update-head" onClick={() => setExpanded(isOpen ? -1 : originalIndex)}>
                <div className="update-meta"><strong>{update.version}</strong><span>{update.date}</span></div>
                <div className="update-main"><span className={`tag tag-${update.category.toLowerCase()}`}>{update.category}</span><h2>{update.title}</h2><p>{update.intro}</p></div>
                <span className="expand-icon"><i /><i /></span>
              </button>
              <div className="update-details"><div><span>Included in this release</span><ul>{update.details.map((d) => <li key={d}>{d}</li>)}</ul><small>Placeholder release content — ready to replace with your server's updates.</small></div></div>
            </article>;
          })}
        </div>
      </section>
      <Community />
    </>
  );
}

function Community() {
  return (
    <section className="community" id="discord">
      <div className="community-copy">
        <SectionLabel>Join the community</SectionLabel>
        <h2>The city doesn't stop<br />outside <em>Los Santos.</em></h2>
        <p>Stay updated, meet other players, get support, and become part of the story before you even enter the city.</p>
        <Button href="https://discord.com/">Join Discord</Button>
      </div>
      <div className="discord-card">
        <div className="discord-banner"><span><img src={martialLawLogo} alt="" /></span></div>
        <div className="discord-body">
          <div className="discord-title"><div><h3>MARTIAL LAW</h3><p><i /> 1,284 online</p></div><span className="verified">✓</span></div>
          <div className="member-count"><strong>24,781</strong><span>community members</span></div>
          <div className="activity"><span>Recent activity</span><div className="avatars"><i>AK</i><i>JD</i><i>MS</i><i>+</i></div><p>246 members active today</p></div>
        </div>
      </div>
    </section>
  );
}

function Footer({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <footer>
      <div className="footer-top"><Logo /><p>A serious roleplay community for stories that last.</p><StatusBadge compact /></div>
      <div className="footer-links">
        <div><span>Navigate</span><button onClick={() => navigate("home")}>Home</button><button onClick={() => navigate("about")}>About</button><button onClick={() => navigate("team")}>Team</button><button onClick={() => navigate("play")}>Play</button><button onClick={() => navigate("patch-notes")}>Patch notes</button></div>
        <div><span>Community</span><a href="https://discord.com/">Discord</a><a href="#rules">Rules</a><a href="#support">Support</a></div>
        <div><span>Social</span><a href="#x">X / Twitter</a><a href="#youtube">YouTube</a><a href="#tiktok">TikTok</a><a href="#instagram">Instagram</a></div>
      </div>
      <div className="footer-bottom"><span>© 2025 MARTIAL LAW</span><span>Not affiliated with Rockstar Games or Take-Two Interactive.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div>
    </footer>
  );
}

export default function App() {
  const getPage = (): Page => {
    const hash = window.location.hash.replace("#/", "") as Page;
    return ["home", "about", "team", "play", "patch-notes"].includes(hash) ? hash : "home";
  };
  const [page, setPage] = useState<Page>(getPage);
  const [server, setServer] = useState<ServerInfo>({
    status: "online",
    players: 0,
    capacity: siteConfig.server.capacityFallback,
    name: "Martial Law",
  });
  const navigate = (next: Page) => {
    window.location.hash = `/${next}`;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const sync = () => { setPage(getPage()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (!siteConfig.server.joinCode) return;

    const loadServer = async () => {
      try {
        const response = await fetch(`/api/fivem/servers/single/${siteConfig.server.joinCode}`);
        if (!response.ok) throw new Error("Server unavailable");
        const payload = await response.json();
        const data = payload.Data;
        setServer({
          status: "online",
          players: Number(data.clients ?? 0),
          capacity: Number(data.sv_maxclients ?? siteConfig.server.capacityFallback),
          name: data.vars?.sv_projectName || data.hostname || "Martial Law",
        });
      } catch {
        setServer((current) => ({ ...current, status: "offline", players: 0 }));
      }
    };

    loadServer();
    const interval = window.setInterval(loadServer, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <ServerContext.Provider value={server}>
      <div className="app">
        <SiteBackground />
        <Nav page={page} navigate={navigate} />
        <main>
          {page === "home" && <Home navigate={navigate} />}
          {page === "about" && <About />}
          {page === "team" && <Team />}
          {page === "play" && <Play />}
          {page === "patch-notes" && <PatchNotes />}
        </main>
        <Footer navigate={navigate} />
      </div>
    </ServerContext.Provider>
  );
}
