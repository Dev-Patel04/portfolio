# 📝 How to Add Your Resume Content

## 🎯 **3 Easy Ways to Add Your Resume:**

### **1. UPDATE RESUME DATA FILE** ⭐ **RECOMMENDED**
**File:** `src/data/resume.json`

**What to Update:**
- **Personal Info**: Name, email, phone, LinkedIn, GitHub
- **Skills**: Frontend, backend, database, tools
- **Experience**: Job titles, companies, dates, descriptions  
- **Education**: Degree, school, graduation year
- **Projects**: Your best work with links
- **Certifications**: AWS, React, etc.

**Example:**
```json
{
  "personalInfo": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "linkedin": "https://linkedin.com/in/yourprofile"
  },
  "skills": {
    "frontend": ["React", "Vue.js", "Angular"],
    "backend": ["Node.js", "Python", "Java"]
  }
}
```

### **2. ADD PDF RESUME DOWNLOAD**
**Steps:**
1. Put your `resume.pdf` file in the `public/` folder
2. The download button in the Contact scene will automatically work
3. Visitors can download your full resume with one click

**File Location:** `public/resume.pdf`

### **3. UPDATE CONTACT SCENE DIRECTLY**
**File:** `src/scenes/ContactScene.ts`

**Search for:** "Driver Profile" section
**Update:** Skills, experience, and education directly in the HTML

---

## 🏁 **Quick Start:**

1. **Edit** `src/data/resume.json` with your info
2. **Add** your `resume.pdf` to `public/` folder  
3. **Commit & Push** to GitHub
4. **Your resume is live!** 🚀

---

## 🎨 **Current Resume Features:**

✅ **Skills Display**: Tech stack badges in F1 colors  
✅ **Experience Timeline**: Latest positions  
✅ **Education Section**: Degree and school  
✅ **PDF Download**: One-click resume download  
✅ **Contact Info**: Email and social links  
✅ **F1 Theme**: Racing terminology and styling  

---

**Need help?** Just update the `resume.json` file - it's the easiest way! 🏎️