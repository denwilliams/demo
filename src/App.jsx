import { useState } from 'react';

// Fictional content lives here so it is easy to swap for your next experiment.
const ideas = [
  { title: 'A tiny trip to the moon', category: 'Weekend adventures', color: 'peach', symbol: '☾' },
  { title: 'A garden above the clouds', category: 'Impossible places', color: 'mint', symbol: '✳' },
  { title: 'A café at the edge of Mars', category: 'Very remote working', color: 'lavender', symbol: '✧' },
];
const initialMessage = 'Ready when you are. Try a button below.';

function IdeaCard({ idea, position, saved, onToggleSave }) {
  return (
    <article className="card idea-card" aria-labelledby="idea-title">
      <div className={`idea-art ${idea.color}`} aria-hidden="true">
        <span className="orbit-ring" />
        <span className="planet">{idea.symbol}</span>
        <span className="art-label">POSTCARD FROM SOMEWHERE ELSE</span>
      </div>
      <div className="card-content">
        <div className="card-eyebrow"><span>THE NEXT BIG LITTLE IDEA</span><span>{String(position).padStart(2, '0')} / 03</span></div>
        <h2 id="idea-title">{idea.title}</h2>
        <p>A made-up escape by the fictional crew at Orbit. No tickets, no deadlines, just a little room to explore.</p>
        <div className="card-footer">
          <span className="tag">{idea.category}</span>
          <button className="button button-small button-outline" aria-pressed={saved} onClick={onToggleSave}>
            <span aria-hidden="true">{saved ? '♥' : '♡'}</span> {saved ? 'Saved' : 'Save idea'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [claps, setClaps] = useState(0);
  const [nickname, setNickname] = useState('Explorer');
  const [message, setMessage] = useState(initialMessage);
  const idea = ideas[ideaIndex];

  function reset() {
    setIdeaIndex(0);
    setSaved(false);
    setClaps(0);
    setNickname('Explorer');
    setMessage('Playground reset. A fresh start!');
  }

  function nextIdea() {
    setIdeaIndex((index) => (index + 1) % ideas.length);
    setSaved(false);
    setMessage('A fresh fictional idea, just for you.');
  }

  function toggleSave() {
    setSaved(!saved);
    setMessage(saved ? 'Idea removed from your local collection.' : 'Idea saved for this session.');
  }

  return (
    <div className="page-shell">
      <a className="skip-link" href="#playground">Skip to playground</a>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Orbit home"><span aria-hidden="true">✳</span> orbit<span className="wordmark-dot">.</span></a>
        <span className="demo-badge"><span aria-hidden="true" /> SMALL DEMO. BIG POSSIBILITIES.</span>
      </header>

      <main id="playground">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">YOUR NEXT EXPERIMENT STARTS HERE</p>
          <h1 id="page-title">Small clicks.<br /><span>Big possibilities.</span></h1>
          <p className="intro-copy">A tiny playground for big ideas. Push a button, change a detail, and see what happens. It’s all made up. Make it yours.</p>
          <div className="intro-meta"><span className="live-dot" aria-hidden="true" /> React playground <span aria-hidden="true">/</span> Local only <span aria-hidden="true">/</span> Zero stakes</div>
        </section>

        <div className="playground-grid">
          <IdeaCard idea={idea} position={ideaIndex + 1} saved={saved} onToggleSave={toggleSave} />
          <section className="card controls-card" aria-labelledby="controls-title">
            <div className="section-heading"><span className="eyebrow">THE CONTROL ROOM</span><span aria-hidden="true">↗</span></div>
            <h2 id="controls-title">Go on, give it a click.</h2>
            <p>Different buttons. Tiny interactions. Absolutely no consequences.</p>
            <div className="button-row">
              <button className="button button-primary" onClick={() => setMessage(`Demo launched! Welcome aboard, ${nickname.trim() || 'Explorer'}. Nothing left this page.`)}>Launch demo <span aria-hidden="true">↗</span></button>
              <button className="button button-outline" onClick={nextIdea}>Next idea <span aria-hidden="true">↻</span></button>
            </div>
            <div className="experiment-row">
              <div><h3>A little encouragement</h3><p>Applause is free around here.</p></div>
              <button className="button button-small button-soft" aria-label={`Clap, ${claps} claps`} onClick={() => setClaps((count) => count + 1)}><span aria-hidden="true">✦</span> Clap <span className="clap-count" aria-live="polite">{claps}</span></button>
            </div>
            <div className="name-experiment">
              <label htmlFor="nickname">Make yourself at home</label>
              <div className="input-row"><input id="nickname" value={nickname} maxLength={40} onChange={(event) => setNickname(event.target.value)} aria-describedby="nickname-hint" /><button className="button button-small button-disabled" disabled>Coming soon</button></div>
              <p id="nickname-hint">Your pretend callsign. Try “Launch demo” to use it.</p>
            </div>
            <div className="feedback" role="status"><span aria-hidden="true">ⓘ</span><span>{message}</span></div>
            <div className="reset-row"><span>Everything stays in this tab.</span><button className="text-button" onClick={reset}>Reset playground</button></div>
          </section>
        </div>

        <aside className="remix-note"><span className="remix-icon" aria-hidden="true">✧</span><div><h2>Built to be played with.</h2><p>Swap the colors. Rewrite the story. Break a button (then fix it). This is your blank canvas, with a head start.</p></div><span className="local-tag">100% FICTIONAL</span></aside>
      </main>
      <footer className="site-footer"><span>Orbit / A small space to try things.</span><span>No accounts. No APIs. Just possibilities.</span></footer>
    </div>
  );
}
