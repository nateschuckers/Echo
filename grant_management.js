const { useState, useEffect, useMemo } = React;

// --- MOCK DATA ---
// Added more test data for a richer user experience.
const initialGrants = [
    { id: 1, name: "Malaria Vaccine Research", foundationName: "Global Health Initiative", status: "Reporting", amountRequested: 100000, amountAwarded: 75000, deadline: "2025-11-01", documents: [{ name: "Malaria Q1 Report.docx", type: "Report" }], budget: { allocated: 75000, spent: 45000 } },
    { id: 2, name: "Girls Who Code Summer Camp", foundationName: "Innovate Tomorrow Fund", status: "Awarded", amountRequested: 25000, amountAwarded: 25000, deadline: null, documents: [{ name: "GWC Award Letter.pdf", type: "Award Letter" }], budget: { allocated: 25000, spent: 10000 } },
    { id: 3, name: "Urban Gardening Initiative", foundationName: "The Giving Tree Foundation", status: "Declined", amountRequested: 10000, amountAwarded: 0, deadline: null, documents: [], budget: null },
    { id: 4, name: "Reforestation Project 2025", foundationName: "The Giving Tree Foundation", status: "Submitted", amountRequested: 50000, amountAwarded: 0, deadline: "2025-10-14", documents: [{ name: "Reforestation Proposal.pdf", type: "Proposal" }], budget: null },
    { id: 5, name: "Downtown Mural Installation", foundationName: "Community Arts Project", status: "Draft", amountRequested: 15000, amountAwarded: 0, deadline: "2025-09-29", documents: [], budget: null },
    { id: 6, name: "Clean Water Access in Rural Areas", foundationName: "Global Health Initiative", status: "Awarded", amountRequested: 250000, amountAwarded: 250000, deadline: null, documents: [{ name: "Water Project Charter.pdf", type: "Proposal" }], budget: { allocated: 250000, spent: 120000 } },
    { id: 7, name: "Youth Literacy Program", foundationName: "Future Leaders Foundation", status: "Submitted", amountRequested: 30000, amountAwarded: 0, deadline: "2025-09-15", documents: [{ name: "Literacy Grant App.pdf", type: "Proposal" }], budget: null },
    { id: 8, name: "Senior Citizen Tech Training", foundationName: "Innovate Tomorrow Fund", status: "Draft", amountRequested: 5000, amountAwarded: 0, deadline: "2025-12-10", documents: [], budget: null }
];

const initialFoundations = [
    { id: 1, name: "The Giving Tree Foundation", focusArea: "Environmental Conservation", contactName: "Jane Appleseed", contactEmail: "jane@givingtree.org", website: "https://givingtree.org", grantCount: 2 },
    { id: 2, name: "Community Arts Project", focusArea: "Public Art", contactName: "Frida Rivera", contactEmail: "frida@communityarts.org", website: "https://communityarts.org", grantCount: 1 },
    { id: 3, name: "Global Health Initiative", focusArea: "Medical Research", contactName: "Jonas Salk", contactEmail: "jonas@ghi.org", website: "https://ghi.org", grantCount: 2 },
    { id: 4, name: "Innovate Tomorrow Fund", focusArea: "STEM Education", contactName: "Alex Turing", contactEmail: "alex@innovatetomorrow.org", website: "https://innovatetomorrow.org", grantCount: 2 },
    { id: 5, name: "Future Leaders Foundation", focusArea: "Youth Development", contactName: "Maria Montessori", contactEmail: "maria@flf.org", website: "https://flf.org", grantCount: 1 }
];

// --- INLINE SVG ICONS ---
// Using inline SVGs for icons to avoid external dependencies.
const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {path}
    </svg>
);
const Plus = (props) => <Icon {...props} path={<path d="M5 12h14m-7-7v14" />} />;
const FileText = (props) => <Icon {...props} path={<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></>} />;
const Calendar = (props) => <Icon {...props} path={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>} />;
const DollarSign = (props) => <Icon {...props} path={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>} />;
const Home = (props) => <Icon {...props} path={<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />} />;
const Trash2 = (props) => <Icon {...props} path={<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>} />;
const Building = (props) => <Icon {...props} path={<><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></>} />;
const Edit = (props) => <Icon {...props} path={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>} />;
const ChevronsLeft = (props) => <Icon {...props} path={<><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></>} />;
const ChevronsRight = (props) => <Icon {...props} path={<><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></>} />;
const File = (props) => <Icon {...props} path={<><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></>} />;

// --- UI COMPONENTS (Now with Dark Mode support) ---
const Card = ({ children, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

const StatusBadge = ({ status }) => {
    const statusStyles = {
        'Awarded': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300', 
        'Reporting': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', 
        'Declined': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', 
        'Submitted': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300', 
        'Draft': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    };
    return <span className={`px-2.5 py-0.5 text-sm font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const PieChartComponent = ({ data }) => {
    const colors = { Reporting: '#3b82f6', Awarded: '#22c55e', Declined: '#ef4444', Submitted: '#a855f7', Draft: '#f59e0b' };
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">No data</div>;

    let cumulativePercent = 0;
    const segments = data.map(item => {
        const percent = (item.value / total) * 100;
        const startAngle = (cumulativePercent / 100) * 360;
        cumulativePercent += percent;
        const endAngle = (cumulativePercent / 100) * 360;
        const largeArcFlag = percent > 50 ? 1 : 0;
        const x1 = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
        const y1 = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
        const x2 = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
        const y2 = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
        return { path: `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} Z`, color: colors[item.name] || '#6b7280' };
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <svg viewBox="0 0 100 100" className="w-40 h-40">
                {segments.map((segment, i) => <path key={i} d={segment.path} fill={segment.color} />)}
            </svg>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600 dark:text-gray-300">
                {data.map(item => (
                    <div key={item.name} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[item.name] || '#6b7280' }}></span>
                        {item.name} ({item.value})
                    </div>
                ))}
            </div>
        </div>
    );
};

const PageHeader = ({ title, children }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
        <div>{children}</div>
    </div>
);

// --- TOP NAVIGATION COMPONENT ---
const TopNav = ({ activeView, setActiveView }) => {
    const navItems = [
        { name: 'Dashboard', icon: Home }, { name: 'Foundations', icon: Building }, { name: 'Grants', icon: FileText },
        { name: 'Deadlines', icon: Calendar }, { name: 'Budgeting', icon: DollarSign }, { name: 'Documents', icon: File },
    ];
    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex items-center space-x-2 px-8">
                {navItems.map(item => (
                     <a
                        key={item.name}
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveView(item.name); }}
                        className={`flex items-center py-4 px-3 text-sm font-medium border-b-2 transition-colors ${activeView === item.name ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <item.icon size={18} className="mr-2" />
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
        </header>
    );
};

// --- VIEW COMPONENTS ---
const Dashboard = ({ grants, foundations }) => {
    const stats = {
        grantsTracked: grants.length,
        foundations: foundations.length,
        totalAwarded: grants.reduce((sum, g) => sum + g.amountAwarded, 0),
        totalRequested: grants.reduce((sum, g) => sum + g.amountRequested, 0),
    };
    const upcomingDeadlines = grants.filter(g => g.deadline && new Date(g.deadline) > new Date()).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);
    const grantStatusDistribution = Object.entries(grants.reduce((acc, grant) => { acc[grant.status] = (acc[grant.status] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
    return (
        <div className="p-8">
            <PageHeader title="Dashboard" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-5"><p className="text-gray-500 dark:text-gray-400 text-sm">Total Grants Tracked</p><p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.grantsTracked}</p></Card>
                <Card className="p-5"><p className="text-gray-500 dark:text-gray-400 text-sm">Total Foundations</p><p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{stats.foundations}</p></Card>
                <Card className="p-5"><p className="text-gray-500 dark:text-gray-400 text-sm">Total Awarded</p><p className="text-3xl font-bold text-green-600 dark:text-green-400">${stats.totalAwarded.toLocaleString()}</p></Card>
                <Card className="p-5"><p className="text-gray-500 dark:text-gray-400 text-sm">Total Requested</p><p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.totalRequested.toLocaleString()}</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 p-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Upcoming Deadlines</h3>
                    <div className="space-y-4">
                        {upcomingDeadlines.map(grant => (
                            <div key={grant.id}>
                                <div className="flex justify-between items-baseline"><p className="font-medium text-gray-800 dark:text-gray-200">{grant.name}</p><p className="text-sm font-semibold text-red-600 dark:text-red-400">{new Date(grant.deadline).toLocaleDateString()}</p></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{grant.foundationName}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="lg:col-span-2 p-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Grant Status Distribution</h3>
                    <PieChartComponent data={grantStatusDistribution} />
                </Card>
            </div>
        </div>
    );
};
const FoundationsView = ({ foundations }) => (
    <div className="p-8">
        <PageHeader title="Foundations">
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-500"><Plus size={20} className="mr-2" /> Add Foundation</button>
        </PageHeader>
        <div className="mb-4"><input type="text" placeholder="Search by name or focus area..." className="w-full sm:w-72 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" /></div>
        <Card><table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><tr><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Focus Area</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Contact</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Website</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Grants</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th></tr></thead>
            <tbody>{foundations.map(f => (<tr key={f.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td className="p-4 font-medium text-gray-800 dark:text-gray-200">{f.name}</td><td className="p-4 text-gray-600 dark:text-gray-400">{f.focusArea}</td><td className="p-4 text-gray-600 dark:text-gray-400">{f.contactName}<br /><span className="text-xs text-gray-500">{f.contactEmail}</span></td><td className="p-4"><a href={f.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{f.website}</a></td><td className="p-4 text-gray-600 dark:text-gray-400">{f.grantCount}</td><td className="p-4"><button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"><Edit size={18} /></button></td></tr>))}</tbody>
        </table></Card>
    </div>
);
const GrantsView = ({ grants }) => (
    <div className="p-8">
        <PageHeader title="Grant Applications"><button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-500"><Plus size={20} className="mr-2" /> Add Grant</button></PageHeader>
        <Card><table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><tr><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Grant Name</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Foundation</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount Requested</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount Awarded</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Application Deadline</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th></tr></thead>
            <tbody>{grants.map(g => (<tr key={g.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td className="p-4 font-medium text-gray-800 dark:text-gray-200">{g.name}</td><td className="p-4 text-gray-600 dark:text-gray-400">{g.foundationName}</td><td className="p-4"><StatusBadge status={g.status} /></td><td className="p-4 text-gray-600 dark:text-gray-400">${g.amountRequested.toLocaleString()}</td><td className="p-4 font-medium text-green-700 dark:text-green-400">${g.amountAwarded.toLocaleString()}</td><td className="p-4 text-gray-600 dark:text-gray-400">{g.deadline ? new Date(g.deadline).toLocaleDateString() : 'N/A'}</td><td className="p-4"><div className="flex gap-3"><button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"><Edit size={18} /></button><button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"><Trash2 size={18} /></button></div></td></tr>))}</tbody>
        </table></Card>
    </div>
);
const DeadlinesView = ({ grants }) => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-08-01'));
    const [selectedDate, setSelectedDate] = useState(null);
    const deadlines = useMemo(() => { const map = new Map(); grants.forEach(grant => { if (grant.deadline) { const date = new Date(grant.deadline).toDateString(); if (!map.has(date)) map.set(date, []); map.get(date).push({ type: 'Deadline', name: grant.name }); } }); return map; }, [grants]);
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const changeMonth = (offset) => { setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)); setSelectedDate(null); };
    const selectedDayEvents = selectedDate && deadlines.get(selectedDate.toDateString()) || [];
    return (
        <div className="p-8">
            <PageHeader title="Deadlines Calendar" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-4">
                    <div className="flex justify-between items-center mb-4 px-2 text-gray-800 dark:text-gray-200"><button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronsLeft size={20} /></button><h3 className="text-lg font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3><button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronsRight size={20} /></button></div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 dark:text-gray-400">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2 font-medium">{day}</div>)}
                        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="border border-gray-100 dark:border-gray-700/50 rounded-md"></div>)}
                        {Array.from({ length: daysInMonth }).map((_, day) => {
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);
                            const hasDeadline = deadlines.has(date.toDateString());
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            return (<div key={day} onClick={() => setSelectedDate(date)} className={`border rounded-md p-2 h-20 flex flex-col cursor-pointer ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-500' : 'border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700'}`}><span className={`font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>{day + 1}</span>{hasDeadline && <span className="mt-auto w-2 h-2 bg-red-500 rounded-full mx-auto"></span>}</div>);
                        })}
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">{selectedDate ? selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) : "Select a day"}</h3>
                    {selectedDate ? (selectedDayEvents.length > 0 ? (<ul className="space-y-3">{selectedDayEvents.map((event, i) => (<li key={i} className="text-sm p-2 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-500/30 rounded-md"><p className="font-semibold text-red-700 dark:text-red-300">{event.type}</p><p className="text-gray-700 dark:text-gray-300">{event.name}</p></li>))}</ul>) : <p className="text-sm text-gray-500 dark:text-gray-400">No events for this day.</p>) : <p className="text-sm text-gray-500 dark:text-gray-400">Click on a day with events to see details.</p>}
                </Card>
            </div>
        </div>
    );
};
const BudgetingView = ({ grants }) => {
    const budgets = grants.filter(g => g.budget);
    return (
        <div className="p-8">
            <PageHeader title="Budgeting"><button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-500"><Plus size={20} className="mr-2" /> Add Budget</button></PageHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(grant => {
                    const remaining = grant.budget.allocated - grant.budget.spent;
                    const progress = (grant.budget.allocated > 0) ? (grant.budget.spent / grant.budget.allocated) * 100 : 0;
                    return (
                        <Card key={grant.id} className="p-5">
                            <div className="flex justify-between items-start mb-2"><div><h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{grant.name}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{grant.foundationName}</p></div><button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"><Trash2 size={18} /></button></div>
                            <div className="space-y-2 text-sm mt-4 text-gray-600 dark:text-gray-300"><div className="flex justify-between"><span>Allocated:</span> <span className="font-medium">${grant.budget.allocated.toLocaleString()}</span></div><div className="flex justify-between"><span>Spent:</span> <span className="font-medium">${grant.budget.spent.toLocaleString()}</span></div><div className="flex justify-between text-green-700 dark:text-green-400"><strong>Remaining:</strong> <strong>${remaining.toLocaleString()}</strong></div></div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div></div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
const DocumentsView = ({ grants }) => {
    const allDocuments = grants.flatMap(grant => grant.documents.map(doc => ({ ...doc, grantName: grant.name })));
    return (
        <div className="p-8">
            <PageHeader title="Documents"><button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-500"><Plus size={20} className="mr-2" /> Add Document</button></PageHeader>
            <Card><table className="w-full text-left">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"><tr><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">File Name</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Related Grant</th><th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th></tr></thead>
                <tbody>{allDocuments.map((doc, i) => (<tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td className="p-4 font-medium text-gray-800 dark:text-gray-200">{doc.name}</td><td className="p-4 text-gray-600 dark:text-gray-400">{doc.type}</td><td className="p-4 text-gray-600 dark:text-gray-400">{doc.grantName}</td><td className="p-4"><button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"><Trash2 size={18} /></button></td></tr>))}</tbody>
            </table></Card>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
function App() {
    const [grants, setGrants] = useState(initialGrants);
    const [foundations, setFoundations] = useState(initialFoundations);
    const [activeView, setActiveView] = useState('Dashboard');

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard': return <Dashboard grants={grants} foundations={foundations} />;
            case 'Foundations': return <FoundationsView foundations={foundations} />;
            case 'Grants': return <GrantsView grants={grants} />;
            case 'Deadlines': return <DeadlinesView grants={grants} />;
            case 'Budgeting': return <BudgetingView grants={grants} />;
            case 'Documents': return <DocumentsView grants={grants} />;
            default: return <Dashboard grants={grants} foundations={foundations} />;
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
            <TopNav activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1">
                {renderView()}
            </main>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
