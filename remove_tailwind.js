const fs = require('fs');
const path = require('path');

const tailwindPatterns = [
    /^flex(-.*)?$/, /^grid(-.*)?$/, /^items-.*$/, /^justify-.*$/, /^min-h-screen$/,
    /^h-\w+(\[\w+\])?$/, /^w-\w+(\[\w+\])?$/, /^bg-\w+(-\d+)?$/, /^text-\w+(-\d+)?$/, /^font-\w+$/,
    /^shadow(-.*)?$/, /^p[xytrbl]?-\d+(\.\d+)?$/, /^m[xytrbl]?-\d+(\.\d+)?$/, /^border(-.*)?$/,
    /^rounded(-.*)?$/, /^overflow-.*$/, /^hover:.*$/, /^focus:.*$/, /^sm:.*$/, /^md:.*$/,
    /^lg:.*$/, /^xl:.*$/, /^transition(-.*)?$/, /^duration-\d+$/, /^ease-.*$/, /^max-w-.*$/,
    /^gap-.*$/, /^relative$/, /^absolute$/, /^inset-.*$/, /^z-\d+$/, /^opacity-\d+$/,
    /^filter$/, /^backdrop-filter$/, /^blur(-.*)?$/, /^block$/, /^inline-block$/, /^inline-flex$/,
    /^ring(-.*)?$/, /^outline-none$/, /^space-[xy]-.*$/, /^object-cover$/, /^text-center$/,
    /^text-left$/, /^text-right$/, /^leading-.*$/, /^tracking-.*$/, /^bg-transparent$/,
    /^bg-opacity-\d+$/, /^text-opacity-\d+$/, /^border-opacity-\d+$/, /^transform$/,
    /^translate-[xy]-.*$/, /^scale-.*$/, /^rotate-.*$/, /^skew-[xy]-.*$/, /^origin-.*$/,
    /^cursor-.*$/, /^select-.*$/, /^resize-.*$/, /^appearance-none$/, /^pointer-events-.*$/,
    /^whitespace-.*$/, /^break-.*$/, /^truncate$/, /^uppercase$/, /^lowercase$/, /^capitalize$/,
    /^normal-case$/, /^italic$/, /^not-italic$/, /^antialiased$/, /^subpixel-antialiased$/,
    /^list-.*$/, /^table(-.*)?$/, /^container$/, /^mx-auto$/, /^invisible$/, /^visible$/,
    /^sr-only$/, /^not-sr-only$/
];

function isTailwind(cls) {
    if (!cls.trim()) return false;
    return tailwindPatterns.some(regex => regex.test(cls));
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace className="a b c"
    content = content.replace(/className="([^"]+)"/g, (match, classes) => {
        const filtered = classes.split(/\s+/).filter(c => !isTailwind(c)).join(' ');
        return `className="${filtered}"`;
    });

    // Replace className={`a b c ${var}`}
    // This is trickier, we can just replace words in the whole file if they match tailwind patterns AND are not part of other JS logic, 
    // but a safer approach is to replace words globally that strictly match tailwind patterns if they don't break anything.
    // However, global replacement might replace variables.
    // Let's replace inside className={...} by finding strings.
    
    // Simpler global replacement of known tailwind tokens in the file:
    // Actually, splitting by word boundaries is too risky.
    
    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    });
}

walkDir('./src');
console.log('Done.');
