// ============================================
// AI Service (Simulated Mode for Hackathon Demo)
// ============================================
// We simulate the AI to guarantee 100% reliability during live pitches,
// avoiding internet latency, API limits, or Google Cloud region errors.

const knowledgeBase = {
    'binary tree': {
        response: `### 🌳 Binary Trees

A **Binary Tree** is a hierarchical data structure where each node has at most **two children**: a left child and a right child.

**Key Properties:**
- The topmost node is called the **root**
- Nodes with no children are called **leaves**
- The **height** of a tree is the longest path from root to leaf

**Common Types:**
- **Binary Search Tree (BST)** — left child < parent < right child
- **AVL Tree** — self-balancing BST
- **Heap** — complete binary tree for priority queues

**Time Complexity:**
- Search: \`O(log n)\` average, \`O(n)\` worst
- Insert: \`O(log n)\` average
- Delete: \`O(log n)\` average

*Would you like me to explain traversal methods (inorder, preorder, postorder)?*`
    },
    'linked list': {
        response: `### 🔗 Linked Lists

A **Linked List** is a linear data structure where elements are stored in **nodes**, and each node points to the next one.

**Types:**
- **Singly Linked List** — each node points to the next
- **Doubly Linked List** — nodes point both forward and backward
- **Circular Linked List** — last node points back to the first

**Advantages over Arrays:**
- Dynamic size — no need to declare size upfront
- Efficient insertions/deletions at \`O(1)\` if you have a pointer

**Disadvantages:**
- No random access — must traverse from head: \`O(n)\`
- Extra memory for pointers

*Shall I compare arrays vs linked lists in a table format?*`
    },
    'data structure': {
        response: `### 📊 Data Structures Overview

A **Data Structure** is a way of organizing data so it can be used efficiently. Here are the fundamental ones:

**Linear Structures:**
- **Array** — fixed-size, random access \`O(1)\`
- **Linked List** — dynamic size, sequential access
- **Stack** — LIFO (Last In, First Out)
- **Queue** — FIFO (First In, First Out)

**Non-Linear Structures:**
- **Tree** — hierarchical, great for searching
- **Graph** — models relationships and networks
- **Hash Table** — key-value pairs, \`O(1)\` average lookup

**How to Choose:**
- Need fast lookup? → **Hash Table**
- Need sorted data? → **BST or AVL Tree**
- Need FIFO processing? → **Queue**
- Need undo functionality? → **Stack**

*Which specific data structure would you like me to deep-dive into?*`
    },
    'pomodoro': {
        response: `### 🍅 The Pomodoro Technique

The **Pomodoro Technique** is a time management method developed by Francesco Cirillo in the late 1980s.

**How It Works:**
- Work for **25 minutes** (one "pomodoro")
- Take a **5-minute break**
- After 4 pomodoros, take a **15-30 minute break**

**Why It Works:**
- Combats **mental fatigue** by enforcing regular breaks
- Creates **urgency** — the timer pushes you to focus
- Improves **self-awareness** of how long tasks actually take

**Research Shows:**
- Students using Pomodoro score **14% higher** on retention tests
- Regular breaks improve **creative problem-solving** by 20%

**Pro Tip:** Use CognitaDesk's built-in Focus Timer — it's already set up for 25-minute sessions!

*Ready to start a focus session?*`
    },
    'study': {
        response: `### 📚 Effective Study Strategies

Based on cognitive science research, here are the **most effective** study methods:

**Tier 1 — Proven Methods:**
- **Active Recall** — test yourself instead of re-reading
- **Spaced Repetition** — review at increasing intervals
- **Interleaving** — mix different topics in one session

**Tier 2 — Helpful Methods:**
- **Elaborative Interrogation** — ask "why?" and "how?"
- **Self-Explanation** — explain concepts in your own words
- **The Feynman Technique** — teach it to simplify it

**What Doesn't Work Well:**
- Highlighting/underlining (feels productive but isn't)
- Re-reading notes passively
- Cramming the night before

**Quick Win:** After each study session, write a 3-sentence summary of what you learned. This alone can boost retention by 30%!

*Would you like me to create a study plan based on these techniques?*`
    },
    'algorithm': {
        response: `### ⚡ Algorithms Fundamentals

An **Algorithm** is a step-by-step procedure for solving a problem or performing a computation.

**Essential Sorting Algorithms:**
- **Bubble Sort** — \`O(n²)\` — simple but slow
- **Merge Sort** — \`O(n log n)\` — divide and conquer
- **Quick Sort** — \`O(n log n)\` avg — fastest in practice

**Essential Search Algorithms:**
- **Linear Search** — \`O(n)\` — checks every element
- **Binary Search** — \`O(log n)\` — requires sorted data

**Algorithm Design Patterns:**
- **Divide & Conquer** — split, solve, combine
- **Dynamic Programming** — store solutions to sub-problems
- **Greedy** — make locally optimal choices

**Big-O Cheat Sheet:**
\`O(1)\` < \`O(log n)\` < \`O(n)\` < \`O(n log n)\` < \`O(n²)\` < \`O(2ⁿ)\`

*Want me to walk through a specific algorithm step-by-step?*`
    },
    'react': {
        response: `### ⚛️ React & React Native

**React** is a JavaScript library for building user interfaces, created by Facebook.

**Core Concepts:**
- **Components** — reusable building blocks of UI
- **JSX** — HTML-like syntax in JavaScript
- **Props** — data passed from parent to child
- **State** — component's internal data that can change

**Essential Hooks:**
- \`useState\` — manage local state
- \`useEffect\` — handle side effects (API calls, timers)
- \`useContext\` — share data without prop drilling
- \`useRef\` — access DOM elements or persist values

**React Native Extras:**
- Uses native components instead of HTML (\`View\`, \`Text\`, \`TouchableOpacity\`)
- \`StyleSheet\` instead of CSS
- Works on iOS, Android, and Web simultaneously

*What specific React concept would you like me to explain further?*`
    },
    'math': {
        response: `### 🔢 Mathematics Study Guide

Here's a roadmap for key math concepts:

**Calculus:**
- **Derivatives** — rate of change, slopes of curves
- **Integrals** — area under curves, accumulation
- **Limits** — foundation of calculus, approaching values

**Linear Algebra:**
- **Matrices** — rectangular arrays of numbers
- **Vectors** — magnitude + direction
- **Eigenvalues** — scalar values in linear transformations

**Discrete Math (for CS):**
- **Logic** — propositions, truth tables
- **Set Theory** — unions, intersections, complements
- **Graph Theory** — vertices, edges, paths

**Study Tip:** Math is learned by **doing problems**, not reading solutions. Aim for at least 10 practice problems per topic!

*Which area of math are you currently studying?*`
    },
    'explain': {
        response: `### 💡 Concept Explanation Mode

I can break down complex topics into simple, understandable parts!

**How I Explain:**
- Start with a **simple analogy** you can relate to
- Build up the **core definition** step by step
- Provide **real-world examples** for context
- Highlight **common misconceptions** to avoid

**Try asking me about:**
- "Explain recursion" 
- "Explain Big-O notation"
- "Explain how databases work"
- "Explain machine learning basics"

*What concept would you like me to break down for you?*`
    },
    'hello': {
        response: `### 👋 Welcome to CognitaDesk AI!

I'm your intelligent study companion. Here's what I can help with:

**📖 Study Topics:**
- Ask about any CS topic (data structures, algorithms, React, etc.)
- Ask about math concepts (calculus, linear algebra, etc.)

**🧠 Study Methods:**
- Learn about the Pomodoro Technique
- Get effective study strategies
- Get personalized study tips

**📷 Scan Notes:**
- Use the "Scan Notes" button to photograph your handwritten notes
- I'll extract and organize the text for you

**💡 Quick Commands:**
- "Explain [concept]" — Simple breakdown of any topic
- "Compare [A] vs [B]" — Side-by-side comparison
- "Quiz me on [topic]" — Practice questions

*What would you like to study today?*`
    },
    'help': {
        response: `### 🆘 How to Use CognitaDesk AI

**Available Commands:**
- Type any study question and I'll provide a detailed answer
- Use "Scan Notes" to upload a photo of handwritten notes
- Use "Explain Concept" for simplified breakdowns

**Best Topics I Cover:**
- Computer Science (data structures, algorithms, React)
- Mathematics (calculus, linear algebra, discrete math)
- Study techniques & productivity

**Tips for Better Answers:**
- Be specific: "Explain binary search trees" vs "explain trees"
- Ask follow-ups: "Tell me more about [subtopic]"
- Try comparisons: "Arrays vs Linked Lists"

*Go ahead, ask me anything!*`
    }
};

export const chatWithAI = async (newMessage) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const query = newMessage.toLowerCase();
            
            // Search knowledge base for matching topic
            for (const [keyword, data] of Object.entries(knowledgeBase)) {
                if (query.includes(keyword)) {
                    resolve(data.response);
                    return;
                }
            }

            // Contextual fallback based on query patterns
            if (query.includes('compare') || query.includes(' vs ')) {
                resolve(`### ⚖️ Comparison Analysis\n\nThat's a great comparison question! In a production environment, I would use Google Gemini to provide a detailed side-by-side analysis.\n\n**For now, try asking about:**\n- Data Structures\n- Algorithms\n- Study techniques\n- React & React Native\n- Mathematics\n\n*Ask about a specific topic and I'll give you a thorough breakdown!*`);
            } else if (query.includes('quiz') || query.includes('test')) {
                resolve(`### 📝 Quick Quiz Mode\n\n**Q1:** What is the time complexity of binary search?\n- A) O(n)\n- B) O(log n) ✅\n- C) O(n²)\n- D) O(1)\n\n**Q2:** Which data structure uses LIFO (Last In, First Out)?\n- A) Queue\n- B) Array\n- C) Stack ✅\n- D) Linked List\n\n**Q3:** What does the \`useEffect\` hook do in React?\n- A) Manages state\n- B) Handles side effects ✅\n- C) Renders components\n- D) Creates refs\n\n*How did you do? Ask me to explain any of the answers!*`);
            } else if (query.length < 10) {
                resolve(`### 🤔 Could you elaborate?\n\nI'd love to help! Try being more specific with your question. For example:\n\n- "What is a binary tree?"\n- "Explain the Pomodoro technique"\n- "How do React hooks work?"\n- "Give me study tips"\n\n*The more specific your question, the better I can assist you!*`);
            } else {
                resolve(`### 💡 Great Question!\n\nThat's an interesting topic! Here's what I can tell you:\n\n**Key Points:**\n- This is a foundational concept in computer science and engineering\n- Understanding the basics will help you build on more advanced topics\n- Practice and repetition are crucial for mastery\n\n**Recommended Next Steps:**\n- Break the concept into smaller sub-topics\n- Use the **Pomodoro Technique** for focused study sessions\n- Create flashcards in the Notes tab for active recall\n\n**Try asking me about:**\n- Data Structures (trees, lists, graphs)\n- Algorithms (sorting, searching)\n- Study techniques & productivity tips\n- React & React Native development\n- Mathematics fundamentals\n\n*Rephrase your question with a specific topic and I'll provide a detailed explanation!*`);
            }
        }, 1200);
    });
};

export const processOCRImage = async (base64Data, mimeType, customPrompt) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`### 📝 Smart Notes Extracted\n\nI've analyzed the uploaded document. Here are your organized notes:\n\n**Main Subject:** The text discusses procedural structures and their computational efficiency.\n\n**Key Concepts Identified:**\n- **Concept 1:** Algorithmic complexity and Big-O analysis\n- **Concept 2:** Memory management fundamentals\n- **Concept 3:** Optimization techniques for production code\n\n**Important Formula:** \`E = mc²\` (highlighted in document)\n\n**Action Items:**\n- Review Chapter 3 before the midterm exam\n- Practice 5 problems on sorting algorithms\n- Create flashcards for the key definitions\n\n*I can save these Smart Notes to your Knowledge Vault!*`);
        }, 2500);
    });
};

export const generateConceptAssist = async (topic) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`### 💡 Concept Assist: ${topic}\n\nHere is a structured breakdown:\n\n**Core Idea:**\nThis concept is a fundamental building block in its field. It solves complex problems by providing an organized, efficient approach.\n\n**Simple Analogy:**\nThink of it like a library's catalog system — it helps you find exactly what you need without searching every shelf.\n\n**Key Benefits:**\n- Dramatically improves processing efficiency\n- Provides a standardized approach to problem-solving\n- Scales well as complexity increases\n\n**Common Pitfalls:**\n- Don't confuse it with similar-sounding concepts\n- Always consider the trade-offs (speed vs memory)\n- Practice implementation, not just theory\n\n*Would you like me to go deeper into any specific part of this?*`);
        }, 1500);
    });
};

export const fetchAIRecommendations = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                rationale: "Based on your study sessions, here are curated resources for your strongest subject areas.",
                items: [
                    { id: 'ai-1', title: 'MIT OpenCourseWare: Advanced Data Structures', type: 'video', url: 'https://youtube.com', color: '#2563EB' },
                    { id: 'ai-2', title: 'Interactive Big-O Notation Cheatsheet', type: 'document', url: 'https://wikipedia.org', color: '#8B5CF6' },
                    { id: 'ai-3', title: 'React Native Crash Course 2025', type: 'video', url: 'https://reactnative.dev', color: '#10B981' },
                ]
            });
        }, 1800);
    });
};
