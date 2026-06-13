import { dashboardStats, monthlyData, mockAppointments, mockInquiries } from '../../data/mockData';
import './AdminDashboard.css';

const kpiCards = [
  { icon: '💰', label: 'Total Revenue',      value: dashboardStats.totalRevenue,          change: dashboardStats.revenueGrowth, positive: true,  color: '#1B2B4B' },
  { icon: '👥', label: 'Total Clients',      value: dashboardStats.totalClients,           change: dashboardStats.clientGrowth,  positive: true,  color: '#059669' },
  { icon: '📁', label: 'Active Projects',    value: dashboardStats.activeProjects,         change: dashboardStats.projectGrowth, positive: true,  color: '#7C3AED' },
  { icon: '📅', label: 'Pending Bookings',   value: dashboardStats.pendingAppointments,    change: dashboardStats.apptChange,    positive: true,  color: '#F59E0B' },
];

/** Simple SVG bar chart */
function BarChart({ data }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const barW = 32; const gap = 18; const h = 140;
  const totalW = data.length * (barW + gap) - gap;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${totalW} ${h + 28}`} className="bar-chart-svg" aria-label="Monthly revenue bar chart">
        {data.map((d, i) => {
          const barH = (d.revenue / maxRevenue) * h;
          const x = i * (barW + gap);
          const y = h - barH;
          const isLast = i === data.length - 1;
          return (
            <g key={d.month}>
              <rect x={x} y={y} width={barW} height={barH}
                fill={isLast ? '#F59E0B' : '#1B2B4B'}
                rx={5} opacity={isLast ? 1 : 0.75}
              />
              <text x={x + barW / 2} y={h + 18} textAnchor="middle" fontSize="10" fill="#6B7280">{d.month}</text>
              <text x={x + barW / 2} y={y - 5}  textAnchor="middle" fontSize="9"  fill="#1B2B4B" fontWeight="700">{d.revenue}k</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Simple donut chart */
function DonutChart() {
  const segments = [
    { label: 'Strategy',    pct: 28, color: '#1B2B4B' },
    { label: 'Feasibility', pct: 22, color: '#F59E0B' },
    { label: 'Training',    pct: 20, color: '#059669' },
    { label: 'OD',          pct: 15, color: '#7C3AED' },
    { label: 'Research',    pct: 15, color: '#EF4444' },
  ];
  const r = 48; const cx = 60; const cy = 60;
  let cum = 0;

  const arc = (start, pct) => {
    const s = (start / 100) * 2 * Math.PI - Math.PI / 2;
    const e = ((start + pct) / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(s); const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e); const y2 = cy + r * Math.sin(e);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${pct > 50 ? 1 : 0} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 120 120" className="donut-svg" aria-label="Service distribution">
        {segments.map(s => {
          const path = arc(cum, s.pct);
          cum += s.pct;
          return <path key={s.label} d={path} fill={s.color} stroke="white" strokeWidth="2" opacity="0.92" />;
        })}
        <circle cx={cx} cy={cy} r={28} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#1B2B4B">TOP</text>
        <text x={cx} y={cy + 9}  textAnchor="middle" fontSize="9"  fill="#6B7280">SERVICE</text>
      </svg>
      <div className="donut-legend">
        {segments.map(s => (
          <div key={s.label} className="donut-item">
            <span className="donut-dot" style={{ background: s.color }} />
            <span className="donut-lbl">{s.label}</span>
            <span className="donut-pct">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const recent = mockAppointments.slice(0, 5);
  const recentInquiries = mockInquiries.slice(0, 3);

  return (
    <div className="admin-dashboard">
      {/* KPI cards */}
      <div className="kpi-grid">
        {kpiCards.map(card => (
          <div key={card.label} className="kpi-card" style={{ '--kpi-color': card.color }}>
            <div className="kpi-icon" style={{ background: `${card.color}18`, color: card.color }}>
              {card.icon}
            </div>
            <div className="kpi-body">
              <div className="kpi-value">{card.value}</div>
              <div className="kpi-label">{card.label}</div>
            </div>
            <div className={`kpi-change ${card.positive ? 'positive' : 'negative'}`}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="admin-card chart-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Monthly Revenue (ETB &apos;000)</span>
            <span className="chart-period">Jan – Jun 2026</span>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <BarChart data={monthlyData} />
          </div>
        </div>

        <div className="admin-card chart-card-sm">
          <div className="admin-card-header">
            <span className="admin-card-title">Service Breakdown</span>
          </div>
          <div style={{ padding: '20px 24px' }}>
            <DonutChart />
          </div>
        </div>
      </div>

      {/* Recent activity row */}
      <div className="activity-row">
        {/* Recent appointments */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Recent Appointments</span>
            <span className="view-all-link">View All →</span>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="td-client">
                        <div className="td-avatar">{a.client.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                        <div>
                          <div className="td-name">{a.client}</div>
                          <div className="td-company">{a.company}</div>
                        </div>
                      </div>
                    </td>
                    <td>{a.service}</td>
                    <td>{a.date}</td>
                    <td><span className={`status-badge status-${a.status}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="admin-card inquiry-card">
          <div className="admin-card-header">
            <span className="admin-card-title">New Inquiries</span>
            <span className="view-all-link">View All →</span>
          </div>
          <div className="inquiry-list">
            {recentInquiries.map(inq => (
              <div key={inq.id} className="inq-item">
                <div className="inq-avatar">
                  {inq.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="inq-body">
                  <div className="inq-name">{inq.name} — <span>{inq.company}</span></div>
                  <div className="inq-service">{inq.service}</div>
                  <div className="inq-msg">{inq.message.slice(0, 70)}…</div>
                </div>
                <span className={`status-badge status-${inq.status}`}>{inq.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
