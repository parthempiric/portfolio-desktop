export interface DesktopItem {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
}

export const desktopItems: DesktopItem[] = [
  {
    id: "1",
    name: "about-me.txt",
    type: "file",
    content: `Hi, I'm Parth!

A passionate developer who loves building
creative and interactive web experiences.

I enjoy working with React, TypeScript,
and modern web technologies.

When I'm not coding, you'll find me
exploring new tech, gaming, or learning
something new.

Feel free to explore my desktop portfolio!`,
  },
  {
    id: "2",
    name: "skills.txt",
    type: "file",
    content: `=== My Skills ===

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
  - Figma`,
  },
  {
    id: "3",
    name: "Projects",
    type: "folder",
  },
  {
    id: "4",
    name: "resume.txt",
    type: "file",
    content: `=== Resume ===

Parth
Full-Stack Developer

Experience:
  Building modern web applications
  with React, TypeScript, and Node.js

Education:
  Self-taught Developer
  Continuous learner

Contact:
  GitHub: github.com/parth
  Email: parth@example.com`,
  },
];

export interface DockApp {
  id: string;
  name: string;
  icon: "terminal" | "browser" | "settings" | "info";
}

export const dockApps: DockApp[] = [
  { id: "terminal", name: "Terminal", icon: "terminal" },
  { id: "browser", name: "Browser", icon: "browser" },
  { id: "settings", name: "Settings", icon: "settings" },
  { id: "about", name: "About", icon: "info" },
];
