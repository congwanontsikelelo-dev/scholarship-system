export interface Scholarship {
  id: number
  name: string
  title?: string
  description: string
  amount: string
  type: string
  deadline: string
  eligibility: string
  requirements?: string[]
  status?: string
  publishedDate?: string
  field?: string
}

export interface Application {
  id: number
  studentName: string
  scholarshipName: string
  type: "scholarship" | "work-study"
  school: string
  course: string
  yearLevel: string
  status: string
  submittedDocuments?: string[]
}

export const scholarshipsData: Scholarship[] = [
  {
    id: 1,
    name: "Funza Lushaka Bursary",
    title: "Funza Lushaka Bursary",
    description: "Full-cost bursary for students pursuing teaching qualifications at public universities in South Africa. Covers tuition, accommodation, meals, books, and transport.",
    amount: "R 96,000",
    type: "Bursary",
    deadline: "2026-01-15",
    eligibility: "South African citizens pursuing Bachelor of Education or PGCE at public higher education institutions. Must commit to teach at a public school for equal years funded.",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-05-01",
    field: "Education",
  },
  {
    id: 2,
    name: "NSFAS Bursary",
    title: "NSFAS Bursary",
    description: "National Student Financial Aid Scheme for financially disadvantaged South African students. Covers full cost of study at public universities and TVET colleges.",
    amount: "R 95,000",
    type: "Bursary",
    deadline: "2026-01-31",
    eligibility: "South African citizens from households with combined annual income of R350,000 or less, studying at public universities or TVET colleges",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Proof of household income", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-04-01",
    field: "All Fields",
  },
  {
    id: 3,
    name: "Sasol Bursary",
    title: "Sasol Bursary",
    description: "Comprehensive bursary for students in Engineering, Science, and Commerce fields. Includes tuition, accommodation, meals, books, and vacation work.",
    amount: "R 130,000",
    type: "Bursary",
    deadline: "2025-08-31",
    eligibility: "South African citizens studying Chemical Engineering, Mechanical Engineering, Electrical Engineering, Chemistry, or related fields with minimum 65% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-03-15",
    field: "Engineering & Science",
  },
  {
    id: 4,
    name: "Eskom Bursary",
    title: "Eskom Bursary",
    description: "Bursary for students pursuing engineering and technical qualifications. Covers tuition, accommodation, meals, books, and provides vacation work opportunities.",
    amount: "R 115,000",
    type: "Bursary",
    deadline: "2025-09-15",
    eligibility: "South African citizens studying Electrical, Mechanical, Civil, or Chemical Engineering with minimum 60% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-04-01",
    field: "Engineering",
  },
  {
    id: 5,
    name: "Anglo American Bursary",
    title: "Anglo American Bursary",
    description: "Bursary for students in Mining, Engineering, and related fields. Covers full study costs plus vacation work and potential employment after graduation.",
    amount: "R 140,000",
    type: "Bursary",
    deadline: "2025-10-15",
    eligibility: "South African citizens studying Mining Engineering, Metallurgy, Geology, Mechanical or Electrical Engineering with minimum 65% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-04-15",
    field: "Mining & Engineering",
  },
  {
    id: 6,
    name: "Transnet Bursary",
    title: "Transnet Bursary",
    description: "Bursary for students in Engineering, IT, and Finance fields. Covers tuition, accommodation, meals, books, and offers vacation work.",
    amount: "R 110,000",
    type: "Bursary",
    deadline: "2025-08-20",
    eligibility: "South African citizens studying Engineering, Information Technology, Finance, or Supply Chain Management with minimum 60% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-03-20",
    field: "Engineering, IT & Finance",
  },
  {
    id: 7,
    name: "Allan Gray Orbis Fellowship",
    title: "Allan Gray Orbis Fellowship",
    description: "Full-cost fellowship for academically talented students with entrepreneurial leadership potential. Covers tuition, accommodation, meals, books, and mentorship.",
    amount: "R 160,000",
    type: "Merit-based",
    deadline: "2025-07-31",
    eligibility: "South African citizens with exceptional academic results (minimum 70% average) and demonstrated leadership or entrepreneurial potential",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Personal statement", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-03-01",
    field: "All Fields",
  },
  {
    id: 8,
    name: "Absa Fellowship Programme",
    title: "Absa Fellowship Programme",
    description: "Comprehensive fellowship for students in Commerce, IT, and STEM fields. Includes tuition, accommodation, meals, books, mentoring, and leadership development.",
    amount: "R 100,000",
    type: "Fellowship",
    deadline: "2025-09-30",
    eligibility: "South African citizens studying Accounting, Finance, Economics, Information Technology, or STEM fields with minimum 60% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-04-10",
    field: "Commerce & IT",
  },
  {
    id: 9,
    name: "Standard Bank Bursary",
    title: "Standard Bank Bursary",
    description: "Bursary for students in Commerce, Engineering, and Technology. Covers tuition, accommodation, meals, books, and provides vacation work experience.",
    amount: "R 105,000",
    type: "Bursary",
    deadline: "2025-09-01",
    eligibility: "South African citizens studying Accounting, Finance, Engineering, Computer Science, or Data Science with minimum 65% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-04-20",
    field: "Commerce & Technology",
  },
  {
    id: 10,
    name: "Mining Qualifications Authority Bursary",
    title: "MQA Bursary",
    description: "Bursary for students pursuing careers in the mining and minerals sector. Covers tuition, accommodation, meals, books, and offers workplace experience.",
    amount: "R 95,000",
    type: "Bursary",
    deadline: "2025-10-31",
    eligibility: "South African citizens studying Mining Engineering, Geology, Metallurgy, Surveying, or related mining disciplines with minimum 60% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-05-01",
    field: "Mining & Minerals",
  },
  {
    id: 11,
    name: "Department of Health Bursary",
    title: "DOH Bursary",
    description: "Bursary for students pursuing health sciences qualifications. Covers tuition, accommodation, meals, books, and requires service obligation after graduation.",
    amount: "R 90,000",
    type: "Bursary",
    deadline: "2025-11-15",
    eligibility: "South African citizens studying Medicine, Nursing, Pharmacy, Dentistry, or Allied Health Sciences with minimum 60% average",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-05-10",
    field: "Health Sciences",
  },
  {
    id: 12,
    name: "Sefako Makgatho Health Sciences Bursary",
    title: "SMU Bursary",
    description: "Bursary for students at Sefako Makgatho Health Sciences University. Covers tuition and accommodation for qualifying health sciences students.",
    amount: "R 85,000",
    type: "Bursary",
    deadline: "2025-12-01",
    eligibility: "South African citizens registered at SMU studying Medicine, Nursing, Pharmacy, or Allied Health Sciences",
    requirements: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
    status: "Active",
    publishedDate: "2025-05-15",
    field: "Health Sciences",
  },
]

export const applicationsData: Application[] = [
  {
    id: 1,
    studentName: "Thandi Nkosi",
    scholarshipName: "Funza Lushaka Bursary",
    type: "scholarship",
    school: "University of Cape Town",
    course: "Bachelor of Education",
    yearLevel: "Second Year",
    status: "Under Review",
    submittedDocuments: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
  },
  {
    id: 2,
    studentName: "Sipho Dlamini",
    scholarshipName: "NSFAS Bursary",
    type: "scholarship",
    school: "University of Witwatersrand",
    course: "BSc Computer Science",
    yearLevel: "Third Year",
    status: "Approved",
    submittedDocuments: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Proof of household income", "Proof of residence"],
  },
  {
    id: 3,
    studentName: "Lerato Mokoena",
    scholarshipName: "Sasol Bursary",
    type: "scholarship",
    school: "Stellenbosch University",
    course: "BEng Chemical Engineering",
    yearLevel: "Fourth Year",
    status: "Pending",
    submittedDocuments: ["Certified ID copy", "Proof of registration", "Academic transcripts", "Motivation letter", "Proof of residence"],
  },
  {
    id: 4,
    studentName: "Zanele Khumalo",
    scholarshipName: "Library Assistant Program",
    type: "work-study",
    school: "University of Pretoria",
    course: "BA Information Science",
    yearLevel: "First Year",
    status: "Under Review",
    submittedDocuments: ["Certified ID copy", "Proof of registration", "Academic transcripts"],
  },
]
