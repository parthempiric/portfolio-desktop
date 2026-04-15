#!/usr/bin/env bash
set -euo pipefail

GUEST_USER="portfolio-guest"
GUEST_HOME="/home/${GUEST_USER}"

echo "=== Portfolio Guest User Setup ==="

# Must run as root
if [[ $EUID -ne 0 ]]; then
  echo "Error: This script must be run as root (sudo)."
  exit 1
fi

# Create system user with locked password
if id "$GUEST_USER" &>/dev/null; then
  echo "User '$GUEST_USER' already exists, updating..."
else
  echo "Creating user '$GUEST_USER'..."
  useradd --system --create-home --home-dir "$GUEST_HOME" --shell /bin/bash "$GUEST_USER"
  passwd -l "$GUEST_USER"
fi

# Set home directory permissions
chmod 750 "$GUEST_HOME"
chown "$GUEST_USER:$GUEST_USER" "$GUEST_HOME"

# Protect host user's home
HOST_HOME="/home/parth"
if [[ -d "$HOST_HOME" ]]; then
  chmod 750 "$HOST_HOME"
  echo "Set $HOST_HOME to 750"
fi

# Create content files
echo "Creating content files..."

cat > "$GUEST_HOME/about-me.txt" << 'CONTENT'
Hi, I'm Parth!

A passionate developer who loves building
creative and interactive web experiences.

I enjoy working with React, TypeScript,
and modern web technologies.

When I'm not coding, you'll find me
exploring new tech, gaming, or learning
something new.

Feel free to explore this terminal!
Type 'help' or 'portfolio' for more info.
CONTENT

cat > "$GUEST_HOME/skills.txt" << 'CONTENT'
=== My Skills ===

Frontend:
  - React / Next.js
  - TypeScript / JavaScript
  - Tailwind CSS
  - HTML5 / CSS3

Backend:
  - Node.js / Express
  - Python
  - REST APIs

Tools & Other:
  - Git / GitHub
  - VS Code
  - Linux
  - Figma
CONTENT

cat > "$GUEST_HOME/projects.txt" << 'CONTENT'
=== My Projects ===

1. Desktop Portfolio (this!)
   A desktop-style portfolio built with React, TypeScript,
   Tailwind CSS, and a real terminal via xterm.js + node-pty.

2. Open Source
   Various open source contributions and personal projects
   on GitHub.

Explore more at: github.com/parth
CONTENT

chown "$GUEST_USER:$GUEST_USER" "$GUEST_HOME"/*.txt

# Custom .bashrc
cat > "$GUEST_HOME/.bashrc" << 'BASHRC'
# Portfolio Guest Shell
export PS1='\[\e[38;5;117m\]\u\[\e[0m\]@\[\e[38;5;183m\]portfolio\[\e[0m\]:\[\e[38;5;114m\]\w\[\e[0m\]\$ '
export PATH="/usr/local/bin:/usr/bin:/bin"
export TERM="xterm-256color"

alias help='echo "
Available commands:
  help         - Show this help message
  portfolio    - Show portfolio info
  cat FILE     - Read a file (about-me.txt, skills.txt, projects.txt)
  ls           - List files
  pwd          - Show current directory
  clear        - Clear the screen
"'

alias portfolio='echo "
=================================
  Parth - Full-Stack Developer
=================================

  Welcome to my portfolio terminal!

  Try:  cat about-me.txt
        cat skills.txt
        cat projects.txt

================================="'

# Welcome message
echo ""
echo "  Welcome to Parth's Portfolio Terminal"
echo "  Type 'help' for available commands"
echo ""
BASHRC

chown "$GUEST_USER:$GUEST_USER" "$GUEST_HOME/.bashrc"

# Resource limits via limits.conf
LIMITS_FILE="/etc/security/limits.d/portfolio-guest.conf"
cat > "$LIMITS_FILE" << LIMITS
# Resource limits for portfolio-guest
${GUEST_USER}  hard  nproc    50
${GUEST_USER}  hard  nofile   256
${GUEST_USER}  hard  fsize    10240
${GUEST_USER}  hard  as       262144
LIMITS

echo ""
echo "=== Setup Complete ==="
echo "User: $GUEST_USER"
echo "Home: $GUEST_HOME"
echo "Files: about-me.txt, skills.txt, projects.txt"
echo "Limits: $LIMITS_FILE"
echo ""
echo "Test with: su - $GUEST_USER -c 'ls -la'"
