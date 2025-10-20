// In a browser environment without a build step, React and Firebase are accessed from the window object.
const { useState, useEffect, useMemo } = React;
const {
    initializeApp,
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    doc,
    setDoc,
    getDocs,
    query
} = window.firebaseSDK;


// --- FONT AWESOME ICON COMPONENTS (replaces lucide-react for browser compatibility) ---
const Icon = ({ className, size = 'h-5 w-5' }) => <i className={`${className} ${size}`}></i>;
const ArrowRight = (props) => <Icon className="fa-solid fa-arrow-right" {...props} />;
const Mail = (props) => <Icon className="fa-solid fa-envelope" {...props} />;
const Phone = (props) => <Icon className="fa-solid fa-phone" {...props} />;
const Twitter = (props) => <Icon className="fa-brands fa-twitter" {...props} />;
const CheckCircle = (props) => <Icon className="fa-solid fa-check-circle" {...props} />;
const PlusCircle = (props) => <Icon className="fa-solid fa-plus-circle" {...props} />;
const Users = (props) => <Icon className="fa-solid fa-users" {...props} />;
const FileText = (props) => <Icon className="fa-solid fa-file-alt" {...props} />;
const BarChart2 = (props) => <Icon className="fa-solid fa-chart-bar" {...props} />;


// --- MOCK DATA ---
const mockLegislators = [
  { id: 1, level: 'Federal', name: 'Isabella Rossi', party: 'D', state: 'PA', district: '17th Congressional District', phone: '202-225-2301', email: 'isabella.rossi@example.com', twitter: 'RepRossiPA', record: { 'Clean Air Act': 'For', 'Healthcare Reform': 'For', 'Education Funding': 'Against', 'Infrastructure Bill': 'For' } },
  { id: 2, level: 'Federal', name: 'Benjamin Carter', party: 'R', state: 'PA', district: 'Senator', phone: '202-224-6324', email: 'ben.carter@example.com', twitter: 'SenCarterPA', record: { 'Clean Air Act': 'Against', 'Healthcare Reform': 'Against', 'Education Funding': 'For', 'Infrastructure Bill': 'For' } },
  { id: 3, level: 'State', name: 'Olivia Chen', party: 'D', state: 'PA', district: 'State Senator, District 43', phone: '717-787-5166', email: 'olivia.chen@example.com', twitter: 'SenChenPA', record: { 'Clean Air Act': 'For', 'Healthcare Reform': 'For', 'Education Funding': 'For', 'Infrastructure Bill': 'Neutral' } },
  { id: 4, level: 'State', name: 'Liam Goldberg', party: 'R', state: 'PA', district: 'State Representative, District 28', phone: '717-783-6421', email: 'liam.goldberg@example.com', twitter: 'RepGoldberg', record: { 'Clean Air Act': 'Against', 'Healthcare Reform': 'Against', 'Education Funding': 'Against', 'Infrastructure Bill': 'For' } },
  { id: 5, level: 'Local', name: 'Sophia Rodriguez', party: 'I', state: 'PA', district: 'Allegheny County Executive', phone: '412-350-6500', email: 'sophia.rodriguez@example.com', twitter: 'ExecRodriguez', record: { 'Clean Air Act': 'For', 'Healthcare Reform': 'Neutral', 'Education Funding': 'For', 'Infrastructure Bill': 'For' } },
];

const initialPetitions = [
    { id: 'p1', title: 'Mandate Renewable Energy in Pennsylvania by 2035', description: 'We urge the state legislature to pass a bill requiring all public utilities to source 100% of their electricity from renewable sources like wind, solar, and hydro by the year 2035 to combat climate change and create green jobs.', signatures: 1042 },
    { id: 'p2', title: 'Increase Funding for Public Schools in Underserved Communities', description: 'This petition calls for a significant increase in state funding for public schools in low-income areas to ensure every child has access to a quality education, regardless of their zip code.', signatures: 2519 },
    { id: 'p3', title: 'Fund the Baden-Economy Bridge Repair Project', description: 'The Baden-Economy Bridge is a vital link for our communities. We, the undersigned, urge the Beaver County Commissioners to prioritize and fully fund the immediate repair and modernization of this critical piece of infrastructure to ensure public safety and economic stability.', signatures: 788 },
    { id: 'p4', title: 'Protect and Expand Walter C. Mielke Fields & Park', description: 'Let\'s ensure our local green space is preserved for future generations. This petition asks the Baden Borough Council to designate Walter C. Mielke Fields as a protected park and explore opportunities to expand its recreational facilities for families and children.', signatures: 1234 },
    { id: 'p5', title: 'Establish a Weekly Farmers\' Market in Baden', description: 'A weekly farmers\' market would provide residents with access to fresh, local produce, support our regional farmers, and create a vibrant community gathering spot. We request the borough to support the creation of a market in a central location.', signatures: 542 },
];

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-advocacy-app';

// --- MAIN APP COMPONENT ---
function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const authInstance = getAuth(app);
            setDb(firestore);
            setAuth(authInstance);

            onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    const userCredential = await signInAnonymously(authInstance);
                    setUserId(userCredential.user.uid);
                }
                setIsAuthReady(true);
            });
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            setIsAuthReady(true); // Set to true even on error to prevent infinite loading
        }
    }, []);

    const renderContent = () => {
        if (!isAuthReady) {
            return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
        }
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard setActiveTab={setActiveTab} />;
            case 'legislators':
                return <LegislatorDatabase />;
            case 'petitions':
                return <Petitioning db={db} />;
            case 'scorecards':
                return <GrassrootsScorecards />;
            default:
                return <Dashboard setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
            <div className="container mx-auto">
                <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
                <main>
                    <div className="bg-gray-800 p-6 rounded-b-lg shadow-lg">
                        {renderContent()}
                    </div>
                </main>
                <footer className="text-center text-gray-500 mt-8 text-sm">
                    <p>Advocacy Hub | Empowering Change</p>
                    {userId && <p className="text-xs mt-1">Session ID: {userId}</p>}
                </footer>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TabMenu({ activeTab, setActiveTab }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
        { id: 'legislators', label: 'Legislator Database', icon: Users },
        { id: 'petitions', label: 'Petitions', icon: FileText },
        { id: 'scorecards', label: 'Scorecards', icon: CheckCircle },
    ];

    return (
        <nav className="bg-gray-800 rounded-t-lg shadow-md">
            <div className="flex items-center space-x-2 p-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md text-left transition-colors duration-200 ${
                            activeTab === item.id
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon className="flex-shrink-0" />
                        <span className="font-medium hidden sm:inline">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

function Dashboard({ setActiveTab }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Welcome to Your Advocacy Hub</h2>
            <p className="mb-8 text-gray-400">This is your command center for driving political action. From here, you can find your representatives, sign petitions, and track their performance on key issues. What would you like to do first?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    icon={Users}
                    title="Find Legislators"
                    description="Access a full database of officials and find out how to contact them."
                    onClick={() => setActiveTab('legislators')}
                    color="blue"
                />
                <DashboardCard
                    icon={FileText}
                    title="Manage Petitions"
                    description="Create a new petition or sign an existing one to make your voice heard."
                    onClick={() => setActiveTab('petitions')}
                    color="green"
                />
                <DashboardCard
                    icon={CheckCircle}
                    title="View Scorecards"
                    description="See how your representatives are voting on the issues that matter to you."
                    onClick={() => setActiveTab('scorecards')}
                    color="purple"
                />
            </div>
        </div>
    );
}

function DashboardCard({ icon: Icon, title, description, onClick, color }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    };

    return (
        <div 
            onClick={onClick}
            className={`bg-gradient-to-br ${colorClasses[color]} text-white p-6 rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full`}
        >
            <div>
                <Icon size="h-10 w-10" className="mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-sm opacity-90">{description}</p>
            </div>
            <div className="flex items-center justify-end mt-4 text-sm font-semibold">
                <span>Go to section</span>
                <ArrowRight size="h-4 w-4" className="ml-1" />
            </div>
        </div>
    );
}

function LegislatorDatabase() {
    const [legislators, setLegislators] = useState(mockLegislators);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');

    const filteredLegislators = useMemo(() => {
        return legislators.filter(leg => {
            const matchesSearch = leg.name.toLowerCase().includes(searchTerm.toLowerCase()) || leg.district.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = filterLevel === 'All' || leg.level === filterLevel;
            return matchesSearch && matchesLevel;
        });
    }, [legislators, searchTerm, filterLevel]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Legislator Database</h2>
            <p className="mb-6 text-gray-400">Find and contact your elected officials.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or district..."
                    className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-white"
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                >
                    <option>All</option>
                    <option>Federal</option>
                    <option>State</option>
                    <option>Local</option>
                </select>
            </div>

            <div className="space-y-4">
                {filteredLegislators.map(leg => <LegislatorCard key={leg.id} legislator={leg} />)}
            </div>
        </div>
    );
}

function LegislatorCard({ legislator }) {
    const partyColor = legislator.party === 'D' ? 'blue' : legislator.party === 'R' ? 'red' : 'gray';

    const handleTweet = () => {
        const text = `Hey @${legislator.twitter}, let's talk about [Your Issue Here]. The people of ${legislator.district} are counting on you. #Advocacy`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="bg-gray-700/50 border border-gray-700 rounded-xl p-5 transition-shadow hover:shadow-md hover:bg-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-${partyColor}-600`}>{legislator.party}</span>
                        <h3 className="text-xl font-bold text-white">{legislator.name}</h3>
                    </div>
                    <p className="text-gray-400 mt-1">{legislator.district}, {legislator.state}</p>
                    <p className="text-sm text-gray-500">{legislator.level} Level</p>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <a href={`mailto:${legislator.email}?subject=Regarding [Your Issue Here]`} className="p-3 bg-gray-600 border border-gray-500 rounded-lg hover:bg-gray-500 transition-colors">
                        <Mail className="text-gray-300" />
                    </a>
                    <a href={`tel:${legislator.phone}`} className="p-3 bg-gray-600 border border-gray-500 rounded-lg hover:bg-gray-500 transition-colors">
                        <Phone className="text-gray-300" />
                    </a>
                    <button onClick={handleTweet} className="p-3 bg-gray-600 border border-gray-500 rounded-lg hover:bg-gray-500 transition-colors">
                        <Twitter className="text-blue-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}


function Petitioning({ db }) {
    const [petitions, setPetitions] = useState(initialPetitions);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedPetition, setSelectedPetition] = useState(null);

    useEffect(() => {
        if (!db) return; // Don't run effect if db is not initialized

        const petitionsPath = `artifacts/${appId}/public/data/petitions`;
        const q = query(collection(db, petitionsPath));
        
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            let petitionsData = [];
            if (querySnapshot.empty) {
                // If the collection is empty, seed it with initial data
                for (const pet of initialPetitions) {
                    const docRef = doc(db, petitionsPath, pet.id);
                    await setDoc(docRef, { title: pet.title, description: pet.description });
                }
                petitionsData = initialPetitions;
            } else {
                 petitionsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
                    const signaturesPath = `${petitionsPath}/${docSnapshot.id}/signatures`;
                    const signaturesSnapshot = await getDocs(collection(db, signaturesPath));
                    const initialPetition = initialPetitions.find(p => p.id === docSnapshot.id);
                    const mockSignatures = initialPetition ? initialPetition.signatures : 0;

                    return {
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                        signatures: signaturesSnapshot.size + mockSignatures,
                    };
                }));
            }
            setPetitions(petitionsData);
        }, (error) => {
            console.error("Error fetching petitions:", error);
            setPetitions(initialPetitions); // Fallback to mock data on error
        });

        return () => unsubscribe();
    }, [db]);


    const handleCreate = async (newPetition) => {
        if (!db) return;
        try {
            const petitionsPath = `artifacts/${appId}/public/data/petitions`;
            await addDoc(collection(db, petitionsPath), newPetition);
            setShowCreateForm(false);
        } catch (error) {
            console.error("Error creating petition: ", error);
        }
    };

    const handleSign = async (petitionId, signatureData) => {
       if (!db) return;
        try {
            const signaturesPath = `artifacts/${appId}/public/data/petitions/${petitionId}/signatures`;
            await addDoc(collection(db, signaturesPath), signatureData);
            setSelectedPetition(null); // Close modal
        } catch (error) {
            console.error("Error signing petition: ", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Petitions</h2>
                    <p className="text-gray-400">Make your voice heard by creating or signing a petition.</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-md"
                >
                    <PlusCircle />
                    <span>{showCreateForm ? 'Cancel' : 'Create Petition'}</span>
                </button>
            </div>

            {showCreateForm && <CreatePetitionForm onCreate={handleCreate} />}

            <div className="space-y-4 mt-6">
                {petitions.map(pet => (
                    <PetitionItem key={pet.id} petition={pet} onSignClick={() => setSelectedPetition(pet)} />
                ))}
            </div>

            {selectedPetition && (
                <SignPetitionModal
                    petition={selectedPetition}
                    onClose={() => setSelectedPetition(null)}
                    onSign={handleSign}
                />
            )}
        </div>
    );
}

function PetitionItem({ petition, onSignClick }) {
    return (
        <div className="bg-gray-700/50 border border-gray-700 rounded-xl p-5">
            <h3 className="text-lg font-bold text-white">{petition.title}</h3>
            <p className="text-gray-400 my-2 text-sm">{petition.description}</p>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <Users />
                    <span>{petition.signatures.toLocaleString()} Signatures</span>
                </div>
                <button
                    onClick={onSignClick}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                    Sign Petition
                </button>
            </div>
        </div>
    );
}

function CreatePetitionForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            console.error("Please fill out both title and description.");
            return;
        }
        onCreate({ title, description });
        setTitle('');
        setDescription('');
    };

    return (
        <div className="p-6 bg-gray-700/50 border border-gray-700 rounded-xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-white">Start a New Petition</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Petition Title"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Petition Description"
                    rows="4"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-white"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-bold"
                >
                    Submit Petition
                </button>
            </form>
        </div>
    );
}

function SignPetitionModal({ petition, onClose, onSign }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [zip, setZip] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !zip.trim()) {
           console.error("All fields are required.");
           return;
        }
        onSign(petition.id, { name, email, zip, signedAt: new Date().toISOString() });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h3 className="text-xl font-bold mb-2 text-white">Sign Petition</h3>
                <p className="font-semibold text-gray-300 mb-4">{petition.title}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white" />
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white" />
                    <input type="text" placeholder="Zip Code" value={zip} onChange={e => setZip(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white" />
                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={onClose} className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-semibold">Cancel</button>
                        <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">Add My Name</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function GrassrootsScorecards() {
    const issues = ['Clean Air Act', 'Healthcare Reform', 'Education Funding', 'Infrastructure Bill'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'For': return 'bg-green-500/20 text-green-300';
            case 'Against': return 'bg-red-500/20 text-red-300';
            case 'Neutral': return 'bg-yellow-500/20 text-yellow-300';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Grassroots Scorecards</h2>
            <p className="mb-6 text-gray-400">Track legislator voting records on key issues.</p>
            <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Legislator</th>
                            {issues.map(issue => (
                                <th key={issue} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">{issue}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {mockLegislators.map(leg => (
                            <tr key={leg.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{leg.name}</div>
                                    <div className="text-sm text-gray-400">{leg.district}</div>
                                </td>
                                {issues.map(issue => (
                                    <td key={issue} className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leg.record[issue])}`}>
                                            {leg.record[issue] || 'N/A'}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- RENDER THE APP ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
