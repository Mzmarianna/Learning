# 🎓 CURRICULUM-INTEGRATED INQUIRY-BASED PROJECTS

## ✅ **WHAT'S NEW**

Wowl can now:
1. **Pull from curriculum templates** - Uses existing lesson competencies
2. **Generate inquiry-based projects** - Real-world problems, not just drills
3. **Adjust difficulty dynamically** - Based on student mastery data
4. **Provide scaffolding** - Support tailored to student skill level

---

## 🎯 **HOW IT WORKS**

### **The Flow:**

```
Student completes lessons
  ↓
Wowl tracks competency mastery
  ↓
Wowl identifies current competencies (e.g., "addition-within-10", "counting")
  ↓
Wowl generates inquiry-based project that aligns with curriculum
  ↓
Project difficulty adjusts based on student's success rate
  ↓
Scaffolding provided (hints, examples, resources) matched to skill level
  ↓
Student completes project in Roblox/Minecraft/etc.
  ↓
AI evaluates project against rubric
  ↓
Competencies marked as mastered or need-work
```

---

## 📚 **CURRICULUM COMPETENCY MAPPING**

### **What We Built:**

Each curriculum lesson is now mapped to specific competencies:

**Example: Level 1 Math**

| Lesson | Competencies | Suggested Projects |
|--------|--------------|-------------------|
| **L1UM01: Count to 10** | `counting-1-10`, `number-recognition`, `one-to-one-correspondence` | Counting Collection, Number Poster |
| **L1UM05: Addition Basics** | `addition-within-10`, `number-bonds`, `problem-solving` | Addition Story, Roblox Treasure Counter |
| **L1UM08: Patterns** | `pattern-recognition`, `pattern-extension`, `sequencing` | Pattern Builder, Minecraft Pattern Floor |
| **L1UM11: Shapes** | `shape-identification`, `geometry-basics`, `spatial-awareness` | Shape City, Roblox Shape Museum |
| **L1UM13: Money Counter** | `coin-recognition`, `money-counting`, `addition-application` | Virtual Store, Roblox Shop |

**Files:**
- `/lib/curriculum-project-mapper.ts` - Complete mappings for L1, L2, L3 Math

---

## 🔍 **INQUIRY-BASED PROJECT TEMPLATES**

### **What Makes a Project "Inquiry-Based"?**

1. **Driving Question** - Open-ended question that frames the investigation
2. **Phases** - Clear steps (Research → Plan → Create → Present)
3. **Real-World Application** - Connects to students' interests
4. **Multiple Platforms** - Students choose (Roblox, Minecraft, Canva, video, etc.)
5. **Scaffolding by Level** - Support adjusted to student mastery

---

## 📊 **PROJECT EXAMPLES**

### **Example 1: "What Can You Count?" (Foundation Level)**

**Driving Question:**  
*"How many different ways can you count and organize a collection?"*

**Competencies:** Counting, number recognition, grouping

**Phases:**
1. **Collect** (10 min) - Find 10 items, organize them
2. **Count & Organize** (15 min) - Count in different ways (groups, lines, circles)
3. **Explain** (5 min) - Which counting method was easiest? Why?

**Scaffolding by Skill Level:**

| Skill Level | Hints | Examples | Resources |
|-------------|-------|----------|-----------|
| **Emerging** | Start with items you can touch, Try making groups of 2 or 5 | Count toy cars, Count blocks | Counting videos, Number chart |
| **Developing** | Try multiple grouping strategies, Use skip counting (2s, 5s) | Count and regroup items, Make arrays | Skip counting songs |
| **Proficient** | Count larger collections (20-50 items), Compare different methods | Count large collections, Analyze efficiency | Advanced counting strategies |
| **Advanced** | Count 100+ items efficiently, Teach someone your method | Inventory project, Counting survey | Real-world applications |

---

### **Example 2: "Treasure Island Addition" (Intermediate Level)**

**Driving Question:**  
*"How can addition help you find and count treasure?"*

**Competencies:** Addition within 10/20, problem-solving

**Platforms:** Roblox Studio (preferred), Minecraft

**Phases:**
1. **Design Your Island** (20 min) - Build island, hide treasure chests
2. **Create Addition Challenges** (25 min) - Make addition clues ("3 red coins + 4 blue coins = ? treasure")
3. **Test & Explain** (15 min) - Test your hunt, explain how addition helps

**Scaffolding by Skill Level:**

| Skill Level | Hints | Examples |
|-------------|-------|----------|
| **Emerging** | Use addition within 5, Use pictures | 2+1=3 coins |
| **Developing** | Use addition within 10, Create 5+ challenges | 5+4=9 treasure |
| **Proficient** | Use addition within 20, Multi-step problems | 12+8=20 points |
| **Advanced** | Addition with regrouping, Scripted auto-checking | Roblox Lua scripts |

---

### **Example 3: "Design a Garden" (Advanced Level)**

**Driving Question:**  
*"How can math help you design the perfect garden?"*

**Competencies:** Area, perimeter, measurement, fractions

**Platforms:** Roblox, Minecraft, Canva, Photo

**Phases:**
1. **Research & Plan** (20 min) - Decide what to grow, sketch layout
2. **Calculate** (30 min) - Area, perimeter, plant spacing (fractions)
3. **Build** (30 min) - Build in Roblox/Minecraft with measurements labeled
4. **Present** (10 min) - Explain math choices

**Deliverables:**
- Garden sketch with measurements
- Math calculations document (show all work)
- Screenshots (top view & side view)
- Short presentation

**Rubric:**
- **Area & Perimeter** (30 pts) - All calculations correct and clearly shown
- **Plant Spacing** (30 pts) - Plants spaced evenly using fractions/division
- **Design** (40 pts) - Garden is logical, organized, labeled

**Scaffolding by Skill Level:**

| Skill Level | What to Do |
|-------------|-----------|
| **Emerging** | Simple rectangles, whole numbers, 1-2 garden beds |
| **Developing** | Multiple beds, different shapes, total area |
| **Proficient** | Complex shapes (L-shapes, circles), fractions, budget |
| **Advanced** | Full yard layout, pathways, optimization, 3D volume |

---

## 🤖 **HOW WOWL USES THIS**

### **1. Generate Project**

```typescript
import { generateInquiryProject, inquiryToProject } from './lib/curriculum-project-mapper';

// Wowl analyzes student
const studentId = 'student123';
const subject = 'math';
const currentLesson = L1UM05; // Addition Basics

// Generate inquiry project
const inquiryTemplate = generateInquiryProject(
  studentId, 
  subject,
  currentLesson,
  studentMasteryData // From adaptive learning system
);

// Convert to standard project format
const project = inquiryToProject(inquiryTemplate, studentMasteryData);
```

### **2. Dynamic Difficulty Adjustment**

Wowl looks at student's **competency mastery**:

```typescript
Student Mastery: 85% success rate
  ↓
Skill Level: "Proficient"
  ↓
Project Difficulty: "Intermediate"
  ↓
Scaffolding: Proficient-level hints, examples, resources
```

**If student struggles (50% success rate):**
- Skill Level → "Developing"  
- Project Difficulty → "Foundation"  
- Scaffolding → More hints, simpler examples, basic resources

**If student excels (95% success rate):**
- Skill Level → "Advanced"  
- Project Difficulty → "Advanced"  
- Scaffolding → Challenge problems, minimal hints, advanced resources

### **3. Scaffolding Delivered**

Based on student level, Wowl provides:

**Emerging:**
- Step-by-step hints
- Visual examples
- Basic resources (videos, charts)

**Developing:**
- Strategic hints
- Multiple approaches
- Intermediate resources

**Proficient:**
- Efficiency tips
- Real-world connections
- Advanced strategies

**Advanced:**
- Challenge extensions
- Teaching opportunities
- Professional resources

---

## 🎮 **STUDENT EXPERIENCE**

### **Scenario: Student Working on Addition**

**Before (Old System):**
```
Student: Completes "Addition Basics" lesson
System: "Good job! Next lesson: Subtraction Basics"
```

**After (New System):**
```
Student: Completes "Addition Basics" lesson (82% success rate)

Wowl: "You understand addition. Let me offer you a project.

**Treasure Island Addition**

Build a treasure hunt in Roblox where addition helps find treasure.
You'll create 5+ addition challenges and hide treasure chests.

I've analyzed your skills. You're at 82% mastery—this project 
matches your level. I'll give you hints if you need them.

Ready to build?"

Student: "Yes!"

Wowl: *Provides scaffolding for "Proficient" level*
- Use addition within 20
- Create multi-step problems
- Here are examples: [shows 3 examples]
- If stuck, watch this: [link to strategy video]

Student: *Builds project in Roblox*

Student: *Submits screenshots + answer key*

Wowl: *Evaluates project using AI*
- Addition Accuracy: 24/25 points (Excellent)
- Problem Design: 22/25 points (Good - could add more variety)
- Creativity: 25/25 points (Unique treasure locations!)
- Instructions: 20/25 points (Needs clearer signs)

Total: 91/100 (91%)

Wowl: "Strong work. You've mastered addition within 20. 
The treasure hunt design is creative. Let's work on clearer 
instructions for next time. Ready for the next challenge?"
```

---

## 📁 **FILES CREATED**

### **New Files:**

1. **`/lib/curriculum-project-mapper.ts`** ⭐ **NEW**
   - Lesson-to-competency mappings (L1, L2, L3 Math)
   - Inquiry-based project templates
   - Dynamic project generator
   - Scaffolding by skill level

### **Updated Files:**

2. **`/lib/project-generator.ts`** ⭐ **ENHANCED**
   - Now curriculum-aware
   - Accepts student mastery data
   - Adjusts difficulty dynamically

3. **`/components/student/WowlInstructor.tsx`** ⭐ **ENHANCED**
   - New "Project Offer" step
   - Integrates inquiry project generation
   - Triggers project mode

---

## 🎯 **INQUIRY PROJECT LIBRARY**

### **Current Projects:**

#### **Math Projects:**

1. **Counting Collection** (Foundation)
   - Grades: K-1
   - Platform: Photo, Video
   - Time: 30 min

2. **Roblox Treasure Counter** (Intermediate)
   - Grades: 1-2
   - Platform: Roblox, Minecraft
   - Time: 60 min

3. **Garden Design** (Intermediate/Advanced)
   - Grades: 3-5
   - Platform: Roblox, Minecraft, Canva
   - Time: 90 min

4. **Multiplication World** (Intermediate)
   - Grades: 3-4
   - Platform: Roblox, Minecraft
   - Time: 75 min

#### **Reading Projects:**

5. **Build Your Story World** (Intermediate)
   - Grades: 5-8
   - Platform: Roblox, Minecraft
   - Time: 90 min

6. **Video Book Summary** (Intermediate)
   - Grades: 5-8
   - Platform: Video, Canva
   - Time: 60 min

---

## 🚀 **NEXT STEPS TO BUILD**

### **Immediate:**
- [ ] Connect to StudentDashboard (show project offers)
- [ ] Add project selection UI (choose from 2-3 options)
- [ ] Implement project tracking (in-progress projects)

### **Soon:**
- [ ] Add Reading curriculum mappings
- [ ] Add Writing curriculum mappings
- [ ] Create more inquiry templates (10+ per subject)
- [ ] Add STEAM projects (Science, Engineering, Art)

### **Future:**
- [ ] Student-generated projects (propose their own)
- [ ] Peer review system
- [ ] Portfolio showcase
- [ ] Project competitions

---

## 💡 **KEY BENEFITS**

### **For Students:**
✅ Real-world application (not just drills)  
✅ Choice of platforms (build in what they love)  
✅ Scaffolded support (hints when stuck)  
✅ Progress at their pace (difficulty adjusts)  
✅ Visible mastery (competencies tracked)

### **For Teachers:**
✅ Curriculum-aligned (matches lessons)  
✅ Standards-based (tied to competencies)  
✅ Differentiated (auto-adjusts to student level)  
✅ Portfolio evidence (student work artifacts)  
✅ Less grading (AI does initial evaluation)

### **For Parents:**
✅ See what kids are learning (project artifacts)  
✅ Real-world connections (not abstract worksheets)  
✅ Engagement (kids excited to build)  
✅ Mastery-based (clear progress tracking)

---

## 🎉 **SUMMARY**

**Wowl is now a full project-based learning system.**

Instead of just:
- "Do 20 addition problems"

Wowl now offers:
- "Build a treasure hunt in Roblox that uses addition to find treasure. Here's how..."

**The system:**
1. ✅ Maps curriculum lessons to competencies
2. ✅ Generates inquiry-based projects from those competencies
3. ✅ Adjusts difficulty based on student mastery
4. ✅ Provides scaffolding matched to skill level
5. ✅ Evaluates projects with AI
6. ✅ Tracks competency mastery

**Status:** Core system built. Ready for UI integration and testing.

---

**Next:** Integrate into StudentDashboard so students can see and start projects! 🚀
