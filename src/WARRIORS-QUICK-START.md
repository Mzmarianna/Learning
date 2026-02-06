# ⚔️ Warriors Curriculum - Quick Start Guide

## 🚀 For Developers

### **Import the Curriculum**

```typescript
import { 
  WARRIORS_CURRICULUM, 
  getWarriorQuestByWeek,
  getWarriorQuestById 
} from '@/lib/curriculum/warriors-curriculum';
```

### **Get a Quest**

```typescript
// By week number
const week1 = getWarriorQuestByWeek(1);
console.log(week1.theme); // "Kingdom Foundations"
console.log(week1.challenges.length); // 5

// By quest ID
const quest = getWarriorQuestById('WA-W5-ALGEBRA');
console.log(quest.theme); // "The Algebra Frontier"
```

### **Assign to a Student**

```typescript
// In your quest assignment service
if (studentTier === 'warriors') {
  const currentWeek = calculateCurrentWeek(student.startDate);
  const quest = getWarriorQuestByWeek(currentWeek);
  
  await assignQuestToStudent({
    studentId: student.id,
    questId: quest.questId,
    challenges: quest.challenges,
    totalXP: quest.totalXP,
  });
}
```

---

## 📚 For Educators

### **Week 1: Kingdom Foundations**

**What Students Learn:**
- Scientific Method & Experimentation
- Pre-Algebra: Variables & Expressions
- Writing Thesis Statements
- Analyzing Arguments
- Strategic Goal Setting

**5 Challenges:**
1. **Design a Controlled Experiment** (STEAM) - 60 min
2. **Variables in the Real World** (Math) - 45 min
3. **Craft a Thesis Statement** (Writing) - 40 min
4. **Analyze Argument Structure** (Reading) - 50 min
5. **Strategic Goal Setting** (Critical Thinking) - 45 min

**Total Time:** ~4 hours | **Total XP:** 500

### **Sample Challenge: "Design a Controlled Experiment"**

**Description:**  
Create and execute a controlled experiment testing a hypothesis of your choice

**Instructions:**
1. Choose a testable question (e.g., "Does music affect concentration during math?")
2. Identify independent, dependent, and control variables
3. Design a procedure with at least 3 trials
4. Collect quantitative data
5. Analyze results and draw evidence-based conclusions

**Mastery Requirements:**
- Clearly identifies all variables (independent, dependent, control)
- Procedure is repeatable and scientifically sound
- Data collection is systematic and quantitative
- Conclusion is supported by evidence

**XP Reward:** 100 XP  
**Submission Type:** Text (lab report format)

---

## 🎯 For Parents

### **What is the Warriors Tier?**

The Warriors tier is designed for students working at 6th-8th grade levels, typically ages 12-18. It uses:

- **Mature themes** - No childish graphics or baby talk
- **Real-world projects** - Code games, build circuits, conduct research
- **Strategic challenges** - Critical thinking and problem-solving
- **Academic writing** - Essays, lab reports, research papers

### **How Much Time Per Week?**

Each week contains 5 challenges:
- **STEAM:** 60-90 min (hands-on project)
- **Math:** 45-55 min
- **Writing:** 40-70 min
- **Reading:** 40-55 min
- **Critical Thinking:** 45-75 min

**Total:** ~4-6 hours per week

### **What Will My Child Do?**

**Week 1 Example:**
- Monday: Design and run a science experiment
- Tuesday: Solve algebra problems with variables
- Wednesday: Write a persuasive thesis statement
- Thursday: Analyze an argumentative article
- Friday: Set SMART academic goals

### **How is Progress Tracked?**

- **XP System:** 100 XP per challenge, 500 XP per week
- **Mastery Levels:** Emerging → Developing → Proficient → Advanced → Mastered
- **Portfolio:** Students collect their best work for final showcase
- **Badges:** Earn badges for completing each week's quest

---

## 🏆 Progression Path

### **Tier Advancement**

Students in Warriors tier may:
1. **Stay in Warriors** - Working at 6th-8th grade level
2. **Return to Explorers** - If foundational gaps identified
3. **Advance beyond** - High schoolers can tackle high school content with Warriors UI

**Remember:** Tier is about **competency**, not age. A 16-year-old working on fractions uses Warriors UI (mature) with Explorers content (appropriate skill level).

---

## 📊 Sample Week Structure

### **Monday - STEAM Day**
- **Challenge:** Design a Controlled Experiment
- **Time:** 60 minutes
- **Materials:** Household items (varies by experiment)
- **Submission:** Lab report with photos

### **Tuesday - Math Day**
- **Challenge:** Variables in the Real World
- **Time:** 45 minutes
- **Materials:** Pencil, paper, calculator
- **Submission:** Completed problem set

### **Wednesday - Writing Day**
- **Challenge:** Craft a Thesis Statement
- **Time:** 40 minutes
- **Materials:** Writing device
- **Submission:** 3 thesis statements + reflection

### **Thursday - Reading Day**
- **Challenge:** Analyze Argument Structure
- **Time:** 50 minutes
- **Materials:** Provided article
- **Submission:** Annotation + analysis

### **Friday - Critical Thinking Day**
- **Challenge:** Strategic Goal Setting
- **Time:** 45 minutes
- **Materials:** Self-assessment data
- **Submission:** SMART goals + action plan

---

## 💬 Support Available

### **For Students:**
- **Wowl AI Tutor** - 24/7 help with any challenge
- **Peer Help** - Collaborate on most challenges (not assessments)
- **Resubmissions** - Can always improve work for higher mastery level

### **For Parents:**
- **Weekly Progress Reports** - See what your child accomplished
- **Challenge Previews** - Know what's coming
- **Communication Tools** - Message tutors if concerns arise

### **For Tutors:**
- **Flagged Submissions** - Review work that needs human attention
- **Progress Dashboards** - Track student mastery levels
- **Intervention Alerts** - Notified if student struggles or disengages

---

## ❓ FAQ

**Q: Is this too hard for a 12-year-old?**  
A: The content is 6th-8th grade level. If a student struggles, they can move to Explorers tier and return when ready.

**Q: Can students work ahead?**  
A: Yes! Complete challenges at your own pace. Some students finish a week in 3 days, others take 7-10 days.

**Q: What if my child gets stuck?**  
A: They can ask Wowl (AI tutor), request peer help, or flag for tutor review. Warriors never give up!

**Q: Are there tests?**  
A: No traditional tests. Assessment is project-based and authentic (experiments, essays, presentations).

**Q: What happens after Week 16?**  
A: Students repeat the curriculum at higher mastery levels, advance to high school content, or pursue independent projects.

---

## 🎯 Success Metrics

**By Week 16, students will:**
✅ Complete 80 academic challenges  
✅ Write 16+ essays and reports  
✅ Conduct 10+ science experiments  
✅ Solve 400+ math problems  
✅ Analyze 20+ texts  
✅ Build a professional portfolio  
✅ Present and defend their learning  
✅ Earn 8,000 XP  

**Most importantly:**  
✅ Develop confidence as independent learners  
✅ Master study skills and self-regulation  
✅ Discover their strengths and interests  
✅ Prepare for high school success  

---

**Questions?** Contact support or ask Wowl! 🦉
