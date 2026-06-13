/**
 * mockData.js — shared data store for both User and Admin interfaces.
 * In production, replace with API calls / state management (Zustand/Redux).
 */

export const mockServices = [
  { id: 1, title: 'Corporate & Business Strategy', category: 'Strategy', status: 'active', price: 'ETB 45,000', requests: 34, icon: '🎯', description: 'Defining vision, mission, and actionable growth plans.' },
  { id: 2, title: 'Growth & Business Transformation', category: 'Transformation', status: 'active', price: 'ETB 55,000', requests: 28, icon: '🚀', description: 'Strategies to accelerate growth and improve performance.' },
  { id: 3, title: 'Organizational Design', category: 'OD', status: 'active', price: 'ETB 38,000', requests: 19, icon: '🏢', description: 'Efficient organizational structures and governance.' },
  { id: 4, title: 'Project Feasibility Studies', category: 'Feasibility', status: 'active', price: 'ETB 62,000', requests: 41, icon: '📋', description: 'Market, financial, technical feasibility assessments.' },
  { id: 5, title: 'Business Plan Development', category: 'Planning', status: 'active', price: 'ETB 28,000', requests: 56, icon: '📄', description: 'Investor-ready business plans for any stage.' },
  { id: 6, title: 'Project Assessment & Evaluation', category: 'Evaluation', status: 'inactive', price: 'ETB 42,000', requests: 15, icon: '🔍', description: 'Baseline studies, M&E frameworks and evaluations.' },
  { id: 7, title: 'Training & Capacity Building', category: 'Training', status: 'active', price: 'ETB 18,000', requests: 72, icon: '🎓', description: 'Leadership, management, and professional training.' },
  { id: 8, title: 'Research & Advisory', category: 'Research', status: 'active', price: 'ETB 35,000', requests: 23, icon: '📊', description: 'Data-driven studies and strategic recommendations.' },
];

export const mockAppointments = [
  { id: 1, client: 'Abebe Tadesse', company: 'Sunrise PLC', service: 'Feasibility Studies', date: '2026-06-15', time: '10:00 AM', status: 'confirmed', email: 'abebe@sunrise.et', phone: '+251911001234' },
  { id: 2, client: 'Tigist Alemu', company: 'USAID Ethiopia', service: 'Organizational Design', date: '2026-06-16', time: '2:00 PM', status: 'pending', email: 'tigist@usaid.org', phone: '+251922345678' },
  { id: 3, client: 'Mulugeta Bekele', company: 'MoA Ethiopia', service: 'Capacity Building', date: '2026-06-17', time: '9:00 AM', status: 'confirmed', email: 'mulugeta@moa.gov.et', phone: '+251933456789' },
  { id: 4, client: 'Sara Mohammed', company: 'EthiTech Startup', service: 'Business Plan', date: '2026-06-18', time: '11:00 AM', status: 'pending', email: 'sara@ethitech.et', phone: '+251944567890' },
  { id: 5, client: 'Yonas Girma', company: 'Dashen Bank', service: 'Business Strategy', date: '2026-06-19', time: '3:00 PM', status: 'cancelled', email: 'yonas@dashen.et', phone: '+251955678901' },
  { id: 6, client: 'Almaz Wondimu', company: 'Save the Children', service: 'Project Evaluation', date: '2026-06-20', time: '1:00 PM', status: 'confirmed', email: 'almaz@stc.org', phone: '+251966789012' },
];

export const mockInquiries = [
  { id: 1, name: 'Belayneh Tesfaye', email: 'belayneh@email.com', company: 'BT Ventures', service: 'Business Strategy', message: 'Looking for strategic planning for our 3-year expansion.', date: '2026-06-10', status: 'new' },
  { id: 2, name: 'Hiwot Kebede', email: 'hiwot@ngo.org', company: 'ActionAid Ethiopia', service: 'Capacity Building', message: 'We need a tailored leadership program for 50 staff members.', date: '2026-06-09', status: 'responded' },
  { id: 3, name: 'Dawit Haile', email: 'dawit@mfg.et', company: 'Addis Manufacturing', service: 'Feasibility Studies', message: 'New factory expansion — need full feasibility assessment.', date: '2026-06-08', status: 'new' },
  { id: 4, name: 'Meron Assefa', email: 'meron@bank.et', company: 'Hibret Bank', service: 'Organizational Design', message: 'Restructuring our HR department and reporting lines.', date: '2026-06-07', status: 'responded' },
];

export const mockBlogPosts = [
  { id: 1, title: '5 Key Strategies for Sustainable Business Growth', category: 'Business Strategy', author: 'Solomon Bekele', date: '2026-06-05', status: 'published', views: 1240 },
  { id: 2, title: 'How to Build a Robust M&E Framework', category: 'Project Management', author: 'Tigist Haile', date: '2026-05-28', status: 'published', views: 856 },
  { id: 3, title: 'Transforming Organizational Culture for High Performance', category: 'OD', author: 'Mulugeta Girma', date: '2026-05-15', status: 'draft', views: 0 },
  { id: 4, title: 'Investment Climate in Ethiopia: 2026 Outlook', category: 'Research', author: 'Solomon Bekele', date: '2026-06-01', status: 'published', views: 2103 },
];

export const dashboardStats = {
  totalRevenue: 'ETB 2.4M',
  revenueGrowth: '+18%',
  totalClients: 127,
  clientGrowth: '+12%',
  activeProjects: 34,
  projectGrowth: '+8%',
  pendingAppointments: 8,
  apptChange: '+3',
};

export const monthlyData = [
  { month: 'Jan', revenue: 180, clients: 9 },
  { month: 'Feb', revenue: 210, clients: 11 },
  { month: 'Mar', revenue: 195, clients: 10 },
  { month: 'Apr', revenue: 240, clients: 13 },
  { month: 'May', revenue: 280, clients: 15 },
  { month: 'Jun', revenue: 310, clients: 17 },
];
