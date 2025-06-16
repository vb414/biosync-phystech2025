const { useState, useEffect, useRef } = React;

// Icon components
const Heart = ({ className = "" }) => <span className={className}>❤️</span>;
const Droplets = ({ className = "" }) => <span className={className}>💧</span>;
const Zap = ({ className = "" }) => <span className={className}>⚡</span>;
const Brain = ({ className = "" }) => <span className={className}>🧠</span>;
const Activity = ({ className = "" }) => <span className={className}>📊</span>;
const Thermometer = ({ className = "" }) => <span className={className}>🌡️</span>;
const Timer = ({ className = "" }) => <span className={className}>⏱️</span>;
const User = ({ className = "" }) => <span className={className}>👤</span>;
const AlertCircle = ({ className = "" }) => <span className={className}>⚠️</span>;
const CheckCircle2 = ({ className = "" }) => <span className={className}>✅</span>;
const BarChart3 = ({ className = "" }) => <span className={className}>📈</span>;
const TrendingUp = ({ className = "" }) => <span className={className}>📈</span>;

// Simple Chart Component
const SimpleChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-gray-500 text-center">No data yet</div>;
    
    const maxValue = Math.max(...data.map(d => d.heartRate || 0), 100);
    
    return (
        <div className="h-full w-full bg-gray-50 rounded p-4">
            <div className="flex items-end space-x-1 h-48">
                {data.slice(-30).map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                        <div 
                            className="w-full bg-red-400 rounded-t transition-all duration-300"
                            style={{ height: `${(item.heartRate / maxValue) * 100}%` }}
                            title={`HR: ${item.heartRate} | Hydration: ${item.hydration}%`}
                        />
                    </div>
                ))}
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">Heart Rate Trend</div>
        </div>
    );
};

const BioSyncAdvanced = () => {
    // Core state
    const [isExercising, setIsExercising] = useState(false);
    const [exerciseType, setExerciseType] = useState('running');
    const [exerciseDuration, setExerciseDuration] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(true);
    
    // User profile
    const [userProfile] = useState({
        name: 'Alex Runner',
        age: 28,
        weight: 70,
        height: 175,
        fitnessLevel: 'intermediate',
        sweatRate: 'moderate',
        goals: ['endurance', 'performance']
    });

    // Biometrics
    const [biometrics, setBiometrics] = useState({
        heartRate: 72,
        heartRateZone: 'rest',
        sweatRate: 0,
        coreTemp: 37.0,
        hydrationLevel: 100,
        electrolyteBalance: {
            sodium: 140,
            potassium: 4.0,
            magnesium: 1.8
        },
        glycogenStores: 100,
        fatigue: 0,
        vo2Max: 45
    });

    // Environment
    const [environment] = useState({
        temperature: 22,
        humidity: 50,
        altitude: 0,
        airQuality: 85
    });

    // Data tracking
    const [recommendations, setRecommendations] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);
    const intervalRef = useRef(null);

    // Exercise effect
    useEffect(() => {
        if (isExercising) {
            intervalRef.current = setInterval(() => {
                setExerciseDuration(prev => prev + 1);
                updateBiometrics();
                generateRecommendations();
                checkForAlerts();
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isExercising, exerciseType]);

    const updateBiometrics = () => {
        setBiometrics(prev => {
            const intensityMultiplier = {
                running: 2.2,
                cycling: 1.8,
                swimming: 2.0,
                strength: 1.5,
                yoga: 1.2
            }[exerciseType];

            const baseHR = 72;
            const maxHR = 220 - userProfile.age;
            const targetHR = Math.min(baseHR + (exerciseDuration * intensityMultiplier), maxHR * 0.85);
            const newHR = prev.heartRate + (targetHR - prev.heartRate) * 0.1;

            const hrPercentage = ((newHR - baseHR) / (maxHR - baseHR)) * 100;
            let zone = 'rest';
            if (hrPercentage > 80) zone = 'peak';
            else if (hrPercentage > 70) zone = 'cardio';
            else if (hrPercentage > 60) zone = 'aerobic';
            else if (hrPercentage > 50) zone = 'fat-burn';
            else if (hrPercentage > 0) zone = 'warm-up';

            const intensityFactor = hrPercentage / 100;
            const newSweatRate = 0.5 * intensityFactor;
            const newCoreTemp = Math.min(prev.coreTemp + intensityFactor * 0.02, 39.5);
            const fluidLoss = newSweatRate / 3600;
            const newHydration = Math.max(prev.hydrationLevel - fluidLoss * 2, 0);
            const newGlycogen = Math.max(prev.glycogenStores - intensityFactor * 0.05, 0);
            const newFatigue = Math.min(prev.fatigue + intensityFactor * 0.03, 100);

            setHistoricalData(prevHistory => {
                const newEntry = {
                    time: exerciseDuration,
                    heartRate: Math.round(newHR),
                    hydration: Math.round(newHydration),
                    glycogen: Math.round(newGlycogen),
                    fatigue: Math.round(newFatigue)
                };
                return [...prevHistory.slice(-59), newEntry];
            });

            return {
                ...prev,
                heartRate: Math.round(newHR),
                heartRateZone: zone,
                sweatRate: newSweatRate,
                coreTemp: newCoreTemp,
                hydrationLevel: newHydration,
                glycogenStores: newGlycogen,
                fatigue: newFatigue
            };
        });
    };

    const generateRecommendations = () => {
        const recs = [];

        if (biometrics.hydrationLevel < 85) {
            const waterNeeded = Math.round((100 - biometrics.hydrationLevel) * userProfile.weight * 0.01 * 1000);
            recs.push({
                id: Date.now() + 1,
                type: 'hydration',
                title: 'Hydration Alert',
                message: `Drink ${waterNeeded}ml water immediately`,
                icon: Droplets,
                color: 'text-blue-500',
                bgColor: 'bg-blue-50'
            });
        }

        if (biometrics.glycogenStores < 30) {
            recs.push({
                id: Date.now() + 2,
                type: 'energy',
                title: 'Energy Depletion',
                message: 'Consume 30g fast carbs',
                icon: Zap,
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-50'
            });
        }

        if (biometrics.coreTemp > 38.5) {
            recs.push({
                id: Date.now() + 3,
                type: 'cooling',
                title: 'Overheating Risk',
                message: 'Reduce intensity and cool down',
                icon: Thermometer,
                color: 'text-red-500',
                bgColor: 'bg-red-50'
            });
        }

        setRecommendations(recs);
    };

    const checkForAlerts = () => {
        const newAlerts = [];

        if (biometrics.heartRate > (220 - userProfile.age) * 0.9) {
            newAlerts.push({
                id: Date.now(),
                message: 'Heart rate approaching maximum safe limit'
            });
        }

        if (biometrics.hydrationLevel < 70) {
            newAlerts.push({
                id: Date.now() + 1,
                message: 'Dehydration risk - performance declining'
            });
        }

        if (newAlerts.length > 0) {
            setAlerts(newAlerts);
        }
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getZoneColor = (zone) => {
        const colors = {
            rest: 'bg-gray-100 text-gray-600',
            'warm-up': 'bg-blue-100 text-blue-600',
            'fat-burn': 'bg-green-100 text-green-600',
            aerobic: 'bg-yellow-100 text-yellow-600',
            cardio: 'bg-orange-100 text-orange-600',
            peak: 'bg-red-100 text-red-600'
        };
        return colors[zone] || 'bg-gray-100 text-gray-600';
    };

    if (showOnboarding) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-4 border border-white/20">
                    <h1 className="text-4xl font-bold text-white mb-4">Welcome to BioSync</h1>
                    <p className="text-white/80 text-lg mb-8">
                        Revolutionary AI-powered nutrition optimization that monitors your body in real-time.
                    </p>
                    <button
                        onClick={() => setShowOnboarding(false)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-600"
                    >
                        Start Demo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Brain className="text-3xl" />
                            <h1 className="text-2xl font-bold">BioSync</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={exerciseType}
                                onChange={(e) => setExerciseType(e.target.value)}
                                className="px-4 py-2 border rounded-lg"
                                disabled={isExercising}
                            >
                                <option value="running">Running</option>
                                <option value="cycling">Cycling</option>
                                <option value="swimming">Swimming</option>
                                <option value="strength">Strength</option>
                                <option value="yoga">Yoga</option>
                            </select>
                            <button
                                onClick={() => setIsExercising(!isExercising)}
                                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                                    isExercising ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                            >
                                {isExercising ? 'Stop' : 'Start'}
                            </button>
                            {isExercising && (
                                <div className="font-mono text-lg">{formatDuration(exerciseDuration)}</div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Alerts */}
            {alerts.length > 0 && (
                <div className="bg-red-50 border-b px-4 py-3">
                    <p className="text-red-800">{alerts[0].message}</p>
                </div>
            )}

            {/* Dashboard */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Metrics */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-red-50 rounded-xl p-4">
                            <Heart className="text-2xl mb-2" />
                            <div className="text-2xl font-bold">{biometrics.heartRate}</div>
                            <div className="text-sm text-gray-600">Heart Rate</div>
                            <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${getZoneColor(biometrics.heartRateZone)}`}>
                                {biometrics.heartRateZone}
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                            <Droplets className="text-2xl mb-2" />
                            <div className="text-2xl font-bold">{Math.round(biometrics.hydrationLevel)}%</div>
                            <div className="text-sm text-gray-600">Hydration</div>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-4">
                            <Zap className="text-2xl mb-2" />
                            <div className="text-2xl font-bold">{Math.round(biometrics.glycogenStores)}%</div>
                            <div className="text-sm text-gray-600">Glycogen</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4">
                            <Thermometer className="text-2xl mb-2" />
                            <div className="text-2xl font-bold">{biometrics.coreTemp.toFixed(1)}°C</div>
                            <div className="text-sm text-gray-600">Core Temp</div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                        {recommendations.length > 0 ? (
                            <div className="space-y-3">
                                {recommendations.map(rec => (
                                    <div key={rec.id} className={`${rec.bgColor} rounded-lg p-3`}>
                                        <div className="flex items-start space-x-3">
                                            <rec.icon className="text-2xl" />
                                            <div>
                                                <h4 className="font-semibold">{rec.title}</h4>
                                                <p className="text-sm">{rec.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Start exercising to receive recommendations</p>
                        )}
                    </div>

                    {/* Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Performance</h3>
                        <SimpleChart data={historicalData} />
                    </div>

                    {/* Electrolytes */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Electrolyte Balance</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Sodium</span>
                                    <span>{biometrics.electrolyteBalance.sodium.toFixed(1)} mmol/L</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{width: '70%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Potassium</span>
                                    <span>{biometrics.electrolyteBalance.potassium.toFixed(1)} mmol/L</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Magnesium</span>
                                    <span>{biometrics.electrolyteBalance.magnesium.toFixed(1)} mmol/L</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{width: '50%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BioSyncAdvanced />);
