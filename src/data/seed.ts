export const TODAY = new Date("2026-10-19T09:00:00+05:30");
export const student = {
  name: "Vepusanan N.",
  id: "FC000000",
  year: "Year 3",
  degree: "BSc Computer Science",
};
export const courses = [
  ["ml", "CCS3062", "Machine Learning", 5, 42, "Dr. N. Perera", "mint"],
  [
    "algo",
    "CCS3042",
    "Advanced Data Structures & Algorithms",
    5,
    64,
    "Dr. S. Fernando",
    "peach",
  ],
  [
    "security",
    "CCS3062",
    "Computer Security",
    5,
    28,
    "Dr. K. Silva",
    "lavender",
  ],
  ["mobile", "CCS3102", "Mobile Computing", 5, 56, "Ms. T. Jayasinghe", "blue"],
  [
    "research",
    "CCS3052",
    "Research Methodologies",
    5,
    35,
    "Dr. M. Wijesinghe",
    "peach",
  ],
  ["theory", "CCS3092", "Theory of Computation", 5, 20, "Dr. A. Dias", "mint"],
  [
    "social",
    "CCS3022",
    "Social & Professional Issues",
    5,
    60,
    "Ms. R. De Silva",
    "lavender",
  ],
  [
    "hpc",
    "CSE3102",
    "High Performance Computing",
    5,
    45,
    "Dr. H. Ranasinghe",
    "blue",
  ],
  [
    "project",
    "CCS3082",
    "Software Project Management",
    4,
    21,
    "Dr. I. Bandara",
    "peach",
  ],
  [
    "webapps",
    "CCS2552",
    "Service Oriented Web Applications",
    4,
    100,
    "Dr. S. Fernando",
    "blue",
  ],
  [
    "sqa",
    "CCS2592",
    "Software Quality Assurance",
    4,
    100,
    "Ms. T. Jayasinghe",
    "mint",
  ],
  [
    "architecture",
    "CCS2572",
    "Software Architecture & Design Patterns",
    4,
    100,
    "Dr. K. Silva",
    "lavender",
  ],
  [
    "equations",
    "CCS2542",
    "Differential Equations",
    4,
    77,
    "Dr. A. Dias",
    "peach",
  ],
  ["group", "CCS2994", "Group Project", 3, 100, "Dr. I. Bandara", "blue"],
  ["comms", "CCS2013", "Data Communication", 3, 100, "Dr. K. Silva", "mint"],
  ["web", "CCS2032", "Web Technologies", 3, 100, "Dr. S. Fernando", "lavender"],
  [
    "ai",
    "CCS2062",
    "Artificial Intelligence",
    3,
    100,
    "Dr. N. Perera",
    "peach",
  ],
  [
    "math",
    "CCS2052",
    "Mathematics for Computing",
    3,
    100,
    "Dr. A. Dias",
    "blue",
  ],
  [
    "oo",
    "CCS1542",
    "Object Oriented Analysis & Design",
    2,
    100,
    "Ms. T. Jayasinghe",
    "mint",
  ],
  [
    "systems",
    "CCS1552",
    "Computer System Architecture",
    2,
    50,
    "Dr. H. Ranasinghe",
    "lavender",
  ],
  [
    "algebra",
    "CCS1572",
    "Algebra for Computing",
    2,
    100,
    "Dr. A. Dias",
    "peach",
  ],
  [
    "discrete",
    "CCS1042",
    "Discrete Mathematics",
    1,
    100,
    "Dr. A. Dias",
    "blue",
  ],
  [
    "intro",
    "CCS1032",
    "Introduction to Computing",
    1,
    46,
    "Dr. S. Fernando",
    "mint",
  ],
  [
    "leadership",
    "CCS1081",
    "Leadership & Human Skills",
    1,
    100,
    "Ms. R. De Silva",
    "lavender",
  ],
  [
    "english",
    "CEN1002",
    "Professional English",
    1,
    100,
    "Ms. R. De Silva",
    "peach",
  ],
].map(([id, code, title, semester, progress, lecturer, color], i) => ({
  id: String(id),
  code: String(code),
  title: String(title),
  semester: Number(semester),
  progress: Number(progress),
  lecturer: String(lecturer),
  color: String(color),
  access: i,
}));
export type Course = (typeof courses)[number];
export const assignments = [
  {
    id: "a1",
    course: "ml",
    title: "Neural networks · Practical 03",
    due: "2026-10-20T23:59:00+05:30",
    status: "In progress",
    type: "Practical",
    description:
      "Build a simple feed-forward neural network. Include your implementation, training results, and a short reflection on model performance.",
  },
  {
    id: "a2",
    course: "research",
    title: "Progress Report 01",
    due: "2026-10-23T17:00:00+05:30",
    status: "Not started",
    type: "Report",
    description:
      "Summarise your research question, literature review and next steps. Submit one PDF with references.",
  },
  {
    id: "a3",
    course: "research",
    title: "Progress Report 02",
    due: "2026-10-30T17:00:00+05:30",
    status: "Not started",
    type: "Report",
    description:
      "Document your methodology and initial findings. Include the feedback from your first progress report.",
  },
  {
    id: "a4",
    course: "project",
    title: "Practical Assignment",
    due: "2026-10-16T17:00:00+05:30",
    status: "Overdue",
    type: "Assignment",
    description:
      "Create a project plan with a work breakdown structure, risk register and milestone schedule.",
  },
  {
    id: "a5",
    course: "project",
    title: "Group Project — Report Submission",
    due: "2026-10-22T17:00:00+05:30",
    status: "Submitted",
    type: "Report",
    description:
      "Submit your team’s final project report, contribution statement and retrospective.",
  },
  {
    id: "a6",
    course: "algo",
    title: "Graph algorithms worksheet",
    due: "2026-10-22T23:59:00+05:30",
    status: "Not started",
    type: "Worksheet",
    description:
      "Compare breadth-first search and Dijkstra’s algorithm. Explain the complexity and show a worked example.",
  },
  {
    id: "a7",
    course: "security",
    title: "Threat modelling exercise",
    due: "2026-10-27T17:00:00+05:30",
    status: "Not started",
    type: "Practical",
    description:
      "Prepare a threat model for a student portal. Identify assets, threats and suitable mitigations.",
  },
];
export const lessons = [
  "Introduction to machine learning",
  "Data preparation & exploration",
  "Linear & logistic regression",
  "Decision trees & random forests",
  "Neural networks",
  "Model evaluation",
  "Unsupervised learning",
];
export const timetable = [
  {
    day: 0,
    time: "09:00",
    end: "11:00",
    course: "ml",
    type: "Lecture",
    room: "Lecture Hall 02",
  },
  {
    day: 0,
    time: "13:00",
    end: "15:00",
    course: "algo",
    type: "Lab",
    room: "Computer Lab 01",
  },
  {
    day: 1,
    time: "09:00",
    end: "11:00",
    course: "security",
    type: "Lecture",
    room: "Lecture Hall 01",
  },
  {
    day: 1,
    time: "13:00",
    end: "15:00",
    course: "mobile",
    type: "Lab",
    room: "Computer Lab 02",
  },
  {
    day: 2,
    time: "10:00",
    end: "12:00",
    course: "research",
    type: "Lecture",
    room: "Lecture Hall 03",
  },
  {
    day: 2,
    time: "14:00",
    end: "16:00",
    course: "hpc",
    type: "Lab",
    room: "Computer Lab 01",
  },
  {
    day: 3,
    time: "09:00",
    end: "11:00",
    course: "theory",
    type: "Lecture",
    room: "Lecture Hall 02",
  },
  {
    day: 3,
    time: "13:00",
    end: "15:00",
    course: "social",
    type: "Lecture",
    room: "Lecture Hall 01",
  },
  {
    day: 4,
    time: "09:00",
    end: "10:00",
    course: "ml",
    type: "Exam",
    room: "Lecture Hall 02",
  },
  {
    day: 4,
    time: "11:00",
    end: "13:00",
    course: "mobile",
    type: "Lecture",
    room: "Lecture Hall 03",
  },
];
export const initialMessages = Array.from({ length: 12 }, (_, i) => ({
  id: "m" + i,
  sender: [
    "Dr. N. Perera",
    "Faculty Office",
    "Amaya Fernando",
    "Dr. S. Fernando",
  ][i % 4],
  subject: [
    "Your neural networks practical",
    "Semester 05 examination information",
    "This week’s study group",
    "Graph algorithms: additional reading",
    "Student record book collection",
    "Library opening hours",
    "Feedback on your project proposal",
    "Lab preparation checklist",
    "Hostel facilities update",
    "Research seminar invitation",
    "Group project feedback",
    "Welcome to Semester 05",
  ][i],
  body: [
    "Hello Vepusanan, please include the training and validation loss curves in your Practical 03 report. We will discuss your results in Monday’s lecture. Let me know if you have any questions.",
    "Please review the examination information and verify your student details. The original January registration window is closed. The LMS practice form is for demonstration only.",
    "Our study group meets on Wednesday at 3 pm in the library discussion room. Bring your notes and questions; everyone is welcome.",
    "The additional reading materials are available in your course content. Focus on the worked examples before your next lab.",
  ][i % 4],
  read: i > 3,
  starred: i === 2,
  date: i < 3 ? "Today" : "18 Oct",
}));
export const notices = [
  {
    title: "Examination registration",
    body: "Original notice: registration closed Friday 23 January 2026 at 1:00 p.m. (Sri Lanka time). Contact the faculty office for the next official registration window.",
    priority: "Urgent",
    to: "/exam-registration",
  },
  {
    title: "Repeat subject payments",
    body: "Confirm the current fee and payment instructions with the Faculty Office before paying. Keep your receipt for verification.",
    priority: "Important",
    to: "/exam-registration",
  },
  {
    title: "Student record book collection",
    body: "Fourth-year students can contact the Faculty Office to confirm their collection appointment. Bring your student ID.",
    priority: "Info",
    to: "/help",
  },
  {
    title: "Hostel facilities",
    body: "For accommodation availability and accessibility requests, contact Student Services through Help & support.",
    priority: "Info",
    to: "/help",
  },
];
export const notifications = Array.from({ length: 16 }, (_, i) => ({
  id: "n" + i,
  ...(i < 4
    ? notices[i]
    : {
        title: [
          "Neural networks practical due tomorrow",
          "New course material available",
          "Your project feedback is ready",
          "Research seminar this week",
        ][i % 4],
        body: [
          "Practical 03 is due on 20 October at 11:59 p.m.",
          "Open your course content to review the latest resources.",
          "Read the assessment feedback in Grades.",
          "Contact the faculty office for seminar details.",
        ][i % 4],
        priority: ["Urgent", "Info", "Important", "Info"][i % 4],
        to: ["/assignments/a1", "/courses/ml", "/grades", "/help"][i % 4],
      }),
  read: i > 5,
}));
const first = [
  "Amaya",
  "Nethmi",
  "Kavindu",
  "Tharushi",
  "Dinuka",
  "Ishara",
  "Nipun",
  "Chamodi",
  "Sahan",
  "Hiruni",
  "Ravindu",
  "Dilini",
  "Pasindu",
  "Anjali",
  "Malith",
  "Sanduni",
  "Kasun",
  "Rashmi",
  "Thevindu",
  "Sachini",
  "Praveen",
  "Harini",
  "Dhanush",
  "Shanika",
  "Ruwan",
  "Keshani",
  "Nisal",
  "Vishmi",
];
export const participants = first.map((name, i) => ({
  id: i,
  name:
    name +
    " " +
    [
      "Fernando",
      "Perera",
      "Silva",
      "Jayasinghe",
      "Bandara",
      "Wickramasinghe",
      "Rajendran",
    ][i % 7],
  role: i === 0 ? "Teaching assistant" : "Student",
  group: i % 2 ? "Group B" : "Group A",
}));
export const courseById = (id: string) =>
  courses.find((c) => c.id === id) || courses[0];
export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Colombo",
  });
export const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  });
export const dueLabel = (value: string) => {
  const day = (d: Date) =>
    Date.parse(d.toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" }));
  const d = Math.round((day(new Date(value)) - day(TODAY)) / 86400000);
  return d < 0 ? "Overdue" : d === 1 ? "Due tomorrow" : `Due in ${d} days`;
};

export const courseProgress = (course: Course, done: string[]) => {
  const baseline = course.id === "ml" ? 0 : course.progress;
  const completed = done.filter((d) => d.startsWith(course.id + "-")).length;
  return Math.min(
    100,
    Math.round(baseline + ((100 - baseline) * completed) / 8),
  );
};
