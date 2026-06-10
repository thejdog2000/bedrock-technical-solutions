// ── TERMINAL TYPEWRITER ──────────────────────────────────────────────────────
const TERM_LINES = [
    { kind: 'cmd',    text: 'identify automation_opportunities' },
    { kind: 'output', text: 'high-ROI workflows found — ready to scope', hi: true },
    { kind: 'cmd',    text: 'cat services.txt' },
    { kind: 'output', text: 'Automation  ·  Consulting  ·  Coaching' },
    { kind: 'cmd',    text: './bedrock_solutions.sh --start' },
    { kind: 'output', text: 'Bedrock Technical Solutions  ·  ready.', hi: true },
];

const termOut = document.getElementById('term-out');
const cursor  = document.getElementById('cursor');

function makeLineEl(kind, hi) {
    const row = document.createElement('div');
    row.className = 'tline';
    if (kind === 'cmd') {
        const p = document.createElement('span'); p.className = 'prompt'; p.textContent = '$ ';
        const t = document.createElement('span'); t.className = 'tcmd';
        row.append(p, t);
        return { row, target: t };
    } else {
        const t = document.createElement('span'); t.className = hi ? 'tout hi' : 'tout';
        row.appendChild(t);
        return { row, target: t };
    }
}

function typeChars(text, el, cb) {
    let i = 0;
    (function tick() {
        if (i < text.length) { el.textContent += text[i++]; setTimeout(tick, 14 + Math.random() * 8); }
        else cb();
    })();
}

(function runLines(queue) {
    if (!queue.length) return;
    const line = queue.shift();
    const { row, target } = makeLineEl(line.kind, line.hi);
    termOut.insertBefore(row, cursor);
    typeChars(line.text, target, () => setTimeout(() => runLines(queue), line.kind === 'cmd' ? 260 : 520));
})(TERM_LINES.slice());


// ── MODAL ────────────────────────────────────────────────────────────────────
const overlay      = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const closeBtn     = document.getElementById('modal-close');

const GH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;
const LOCK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

function openModal(key) {
    const p = PROJECTS[key];
    if (!p) return;

    const tagsHtml    = p.tags.map(t => `<span class="tag ${t.cls}">${t.label}</span>`).join('');
    const resultsHtml = p.results.map(r => `<li>${r}</li>`).join('');

    let repoHtml = '';
    if (p.github) {
        repoHtml = `<a href="${p.github}" target="_blank" rel="noopener" class="modal-gh">${GH_ICON} View on GitHub ↗</a>`;
    } else if (p.private) {
        repoHtml = `<span class="modal-private">${LOCK_ICON} Private repo · available on request</span>`;
    }

    modalContent.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon">${p.icon}</div>
            <div>
                <div class="modal-title">${p.name}</div>
                <div class="modal-cat">${p.category}</div>
            </div>
        </div>
        <div class="modal-section">
            <div class="modal-section-label">The Challenge</div>
            <p>${p.problem}</p>
        </div>
        <div class="modal-section">
            <div class="modal-section-label">The Solution</div>
            <p>${p.solution}</p>
        </div>
        <div class="modal-section">
            <div class="modal-section-label">Key Results</div>
            <ul class="modal-results">${resultsHtml}</ul>
        </div>
        <div class="modal-divider"></div>
        <div class="modal-tech-label">Technical Details</div>
        <div class="modal-tags">${tagsHtml}</div>
        ${repoHtml}
    `;

    document.getElementById('modal-box').scrollTop = 0;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.project));
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── ACTIVE NAV ───────────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 90) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });
