// graph.js

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const container = canvas.parentElement;

let width, height;
let nodes = [];
let edges = [];
let mouse = { x: -1000, y: -1000 };

// Define the nodes (Skills & Projects)
const nodeData = [
    { id: 'me', label: 'Pratik Patil', type: 'center', size: 8 },
    
    // Languages
    { id: 'python', label: 'Python', type: 'lang', size: 5 },
    { id: 'rust', label: 'Rust', type: 'lang', size: 5 },
    { id: 'go', label: 'Go', type: 'lang', size: 5 },
    { id: 'r', label: 'R', type: 'lang', size: 5 },
    
    // Domains
    { id: 'ml', label: 'Machine Learning', type: 'domain', size: 6 },
    { id: 'dl', label: 'Deep Learning', type: 'domain', size: 5 },
    { id: 'nlp', label: 'NLP', type: 'domain', size: 5 },
    { id: 'systems', label: 'Systems', type: 'domain', size: 6 },
    
    // Projects
    { id: 'dedupr', label: 'Dedupr', type: 'project', size: 4 },
    { id: 'cricket', label: 'Cricket Analytics', type: 'project', size: 4 },
    { id: 'rag', label: 'RAG Agents', type: 'project', size: 4 }
];

// Define the connections
const edgeData = [
    { source: 'me', target: 'ml' },
    { source: 'me', target: 'systems' },
    { source: 'me', target: 'python' },
    { source: 'me', target: 'rust' },
    { source: 'me', target: 'go' },
    { source: 'me', target: 'r' },
    
    { source: 'ml', target: 'dl' },
    { source: 'ml', target: 'nlp' },
    { source: 'ml', target: 'python' },
    { source: 'ml', target: 'r' },
    
    { source: 'dl', target: 'python' },
    
    { source: 'nlp', target: 'python' },
    { source: 'nlp', target: 'rag' },
    
    { source: 'systems', target: 'rust' },
    { source: 'systems', target: 'go' },
    
    { source: 'dedupr', target: 'rust' },
    { source: 'dedupr', target: 'systems' },
    
    { source: 'cricket', target: 'r' },
    { source: 'cricket', target: 'go' },
    
    { source: 'rag', target: 'ml' }
];

function resize() {
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function init() {
    resize();
    
    // Place nodes randomly
    nodes = nodeData.map(n => ({
        ...n,
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height - 100) + 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    }));

    edges = edgeData.map(e => ({
        source: nodes.find(n => n.id === e.source),
        target: nodes.find(n => n.id === e.target)
    }));

    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Physics: Basic drift and bounds
    nodes.forEach(n => {
        if (n.id !== 'me') {
            n.x += n.vx;
            n.y += n.vy;
            
            // Bounce off walls
            if (n.x < 30 || n.x > width - 30) n.vx *= -1;
            if (n.y < 30 || n.y > height - 30) n.vy *= -1;

            // Mouse interaction (repulsion)
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 80) {
                n.x += dx / dist * 2;
                n.y += dy / dist * 2;
            }
        }
    });

    // Keep center node in middle
    const me = nodes.find(n => n.id === 'me');
    me.x = width / 2;
    me.y = height / 2;

    // Draw Edges
    ctx.lineWidth = 1;
    edges.forEach(e => {
        ctx.beginPath();
        ctx.moveTo(e.source.x, e.source.y);
        ctx.lineTo(e.target.x, e.target.y);
        
        // Highlight edge if mouse is near
        const midX = (e.source.x + e.target.x) / 2;
        const midY = (e.source.y + e.target.y) / 2;
        const dist = Math.sqrt(Math.pow(midX - mouse.x, 2) + Math.pow(midY - mouse.y, 2));
        
        ctx.strokeStyle = dist < 100 ? 'rgba(26, 54, 93, 0.4)' : 'rgba(0, 0, 0, 0.08)';
        ctx.stroke();
    });

    // Draw Nodes
    nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        
        // Colors based on type
        if (n.type === 'center') ctx.fillStyle = '#111111';
        else if (n.type === 'lang') ctx.fillStyle = '#b08968'; // Gold
        else if (n.type === 'domain') ctx.fillStyle = '#1a365d'; // Cobalt
        else ctx.fillStyle = '#e5e5e5'; // Projects
        
        ctx.fill();
        
        if (n.type === 'project') {
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Labels
        if (n.type !== 'project' || mouse.x > 0) {
            ctx.font = n.type === 'center' ? '600 12px Inter' : '11px Inter';
            ctx.fillStyle = '#111';
            ctx.textAlign = 'center';
            ctx.fillText(n.label, n.x, n.y + n.size + 14);
        }
    });

    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', init);
container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Start
init();
