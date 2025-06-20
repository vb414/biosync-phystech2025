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
const Upload = ({ className = "" }) => <span className={className}>📤</span>;
const FileText = ({ className = "" }) => <span className={className}>📄</span>;
const Shield = ({ className = "" }) => <span className={className}>🛡️</span>;

// Simple Chart Component
const SimpleChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-gray-500 text-center">No data yet - Start exercising to see your performance</div>;
    
    const maxValue = Math.max(...data.map(d => d.heartRate || 0), 100);
    
    return (
        <div className="h-full w-full bg-gray-50 rounded p-4">
            <div className="flex items-end space-x-1 h-48">
                {data.slice(-30).map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                        <div 
                            className="w-full bg-red-400 rounded-t transition-all duration-300 hover:bg-red-500"
                            style={{ height: `${(item.heartRate / maxValue) * 100}%`, minHeight: '4px' }}
                            title={`Time: ${item.time}s | HR: ${item.heartRate} | Hydration: ${item.hydration}%`}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Time: {data.length > 0 ? data[0].time : 0}s</span>
                <span className="text-red-500">Heart Rate Trend</span>
                <span>Time: {data.length > 0 ? data[data.length - 1].time : 0}s</span>
            </div>
        </div>
    );
};

const BioSyncAdvanced = () => {
    // Core state
    const [currentStep, setCurrentStep] = useState('dashboard'); // Skip to dashboard for testing
    const [isExercising, setIsExercising] = useState(false);
    const [exerciseType, setExerciseType] = useState('running');
    const [exerciseDuration, setExerciseDuration] = useState(0);
    
    // User profile with default values for testing
    const [userProfile, setUserProfile] = useState({
        name: 'Test User',
        age: '30',
        gender: 'male',
        weight: '70',
        height: '175',
        activityLevel: 'moderate',
        fitnessGoals: ['General Health'],
        medicalConditions: ['None'],
        medications: [],
        dietaryRestrictions: [],
        bloodWork: {
            glucose: null,
            cholesterol: null,
            hemoglobin: null,
            vitamins: {},
            minerals: {}
        },
        bmi: 22.9,
        bmr: 1680,
        maxHeartRate: 190
    });

    // Medical report analysis
    const [medicalReport, setMedicalReport] = useState(null);
    const [reportAnalysis, setReportAnalysis] = useState(null);

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

    // Debug log
    console.log('Component state:', { isExercising, exerciseDuration, historicalData: historicalData.length });

    // Calculate BMI and BMR when profile changes
    useEffect(() => {
        if (userProfile.weight && userProfile.height) {
            const heightInMeters = parseFloat(userProfile.height) / 100;
            const weight = parseFloat(userProfile.weight);
            const age = parseInt(userProfile.age) || 30;
            const bmi = weight / (heightInMeters * heightInMeters);
            
            let bmr;
            if (userProfile.gender === 'male') {
                bmr = 10 * weight + 6.25 * parseFloat(userProfile.height) - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * parseFloat(userProfile.height) - 5 * age - 161;
            }
            
            const maxHR = 220 - age;
            
            setUserProfile(prev => ({
                ...prev,
                bmi: bmi.toFixed(1),
                bmr: Math.round(bmr),
                maxHeartRate: maxHR
            }));
        }
    }, [userProfile.weight, userProfile.height, userProfile.age, userProfile.gender]);

    // Main update function
    const updateBiometrics = () => {
        console.log('Updating biometrics...');
        
        setBiometrics(prev => {
            const intensityMultiplier = {
                running: 2.2,
                cycling: 1.8,
                swimming: 2.0,
                strength: 1.5,
                yoga: 1.2
            }[exerciseType] || 1.5;

            // Personalized calculations based on user profile
            const baseHR = userProfile.gender === 'male' ? 70 : 75;
            const maxHR = userProfile.maxHeartRate || 190;
            const currentDuration = exerciseDuration;
            
            // Calculate target heart rate based on duration
            const targetHR = Math.min(baseHR + (currentDuration * intensityMultiplier * 0.5), maxHR * 0.85);
            const newHR = prev.heartRate + (targetHR - prev.heartRate) * 0.1;

            const hrPercentage = ((newHR - baseHR) / (maxHR - baseHR)) * 100;
            let zone = 'rest';
            if (hrPercentage > 80) zone = 'peak';
            else if (hrPercentage > 70) zone = 'cardio';
            else if (hrPercentage > 60) zone = 'aerobic';
            else if (hrPercentage > 50) zone = 'fat-burn';
            else if (hrPercentage > 0) zone = 'warm-up';

            // Calculate other metrics
            const bodyWeightFactor = (parseFloat(userProfile.weight) || 70) / 70;
            const intensityFactor = hrPercentage / 100;
            const newSweatRate = 0.5 * intensityFactor * bodyWeightFactor;
            
            const newCoreTemp = Math.min(prev.coreTemp + intensityFactor * 0.02, 39.5);
            const fluidLoss = newSweatRate / 3600;
            const newHydration = Math.max(prev.hydrationLevel - fluidLoss * 2, 0);
            
            const fitnessMultiplier = userProfile.activityLevel === 'athlete' ? 0.7 : 1.0;
            const newGlycogen = Math.max(prev.glycogenStores - (intensityFactor * 0.05 * fitnessMultiplier), 0);
            const newFatigue = Math.min(prev.fatigue + (intensityFactor * 0.03 * fitnessMultiplier), 100);

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

    // Update historical data
    useEffect(() => {
        if (isExercising && exerciseDuration > 0) {
            setHistoricalData(prevHistory => {
                const newEntry = {
                    time: exerciseDuration,
                    heartRate: biometrics.heartRate,
                    hydration: Math.round(biometrics.hydrationLevel),
                    glycogen: Math.round(biometrics.glycogenStores),
                    fatigue: Math.round(biometrics.fatigue)
                };
                console.log('Adding historical data:', newEntry);
                return [...prevHistory.slice(-59), newEntry];
            });
        }
    }, [exerciseDuration, biometrics, isExercising]);

    // Exercise effect - Main timer
    useEffect(() => {
        if (isExercising) {
            console.log('Starting exercise...');
            intervalRef.current = setInterval(() => {
                setExerciseDuration(prev => {
                    console.log('Exercise duration:', prev + 1);
                    return prev + 1;
                });
            }, 1000);
        } else {
            console.log('Stopping exercise...');
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isExercising]);

    // Update biometrics when duration changes
    useEffect(() => {
        if (isExercising && exerciseDuration > 0) {
            updateBiometrics();
            generatePersonalizedRecommendations();
            checkForAlerts();
        }
    }, [exerciseDuration]);

   const generatePersonalizedRecommendations = () => {
    const recs = [];

    // Show recommendations earlier and more frequently
    
    // Hydration recommendations (trigger at 95% instead of 85%)
    if (biometrics.hydrationLevel < 95) {
        const waterNeeded = Math.round((100 - biometrics.hydrationLevel) * (parseFloat(userProfile.weight) || 70) * 0.01 * 1000);
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

    // Energy recommendations (trigger at 80% instead of 30%)
    if (biometrics.glycogenStores < 80) {
        recs.push({
            id: Date.now() + 2,
            type: 'energy',
            title: 'Energy Management',
            message: 'Consider consuming 15-30g carbs to maintain energy levels',
            icon: Zap,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50'
        });
    }

    // Heart rate zone recommendations
    if (biometrics.heartRateZone === 'peak') {
        recs.push({
            id: Date.now() + 3,
            type: 'intensity',
            title: 'Peak Zone Alert',
            message: 'You\'re in peak zone! Consider reducing intensity for sustained performance',
            icon: Heart,
            color: 'text-red-500',
            bgColor: 'bg-red-50'
        });
    } else if (biometrics.heartRateZone === 'cardio') {
        recs.push({
            id: Date.now() + 4,
            type: 'performance',
            title: 'Optimal Cardio Zone',
            message: 'Perfect! You\'re in the cardio zone for maximum fat burn',
            icon: TrendingUp,
            color: 'text-green-500',
            bgColor: 'bg-green-50'
        });
    }

    // Temperature management (trigger at 38.0° instead of 38.5°)
    if (biometrics.coreTemp > 38.0) {
        recs.push({
            id: Date.now() + 5,
            type: 'cooling',
            title: 'Temperature Rising',
            message: 'Core temperature elevated. Consider cooling strategies',
            icon: Thermometer,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50'
        });
    }

    // Exercise duration recommendations
    if (exerciseDuration > 30 && exerciseDuration < 60) {
        recs.push({
            id: Date.now() + 6,
            type: 'motivation',
            title: 'Great Progress!',
            message: 'You\'re doing amazing! Keep up the steady pace',
            icon: CheckCircle2,
            color: 'text-green-500',
            bgColor: 'bg-green-50'
        });
    }

    // Personalized based on user profile
    if (userProfile.activityLevel === 'sedentary' && exerciseDuration > 20) {
        recs.push({
            id: Date.now() + 7,
            type: 'encouragement',
            title: 'Building Endurance',
            message: 'Excellent work building your fitness base! Listen to your body',
            icon: User,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50'
        });
    }

    // Add a demo recommendation if no others are triggered
    if (recs.length === 0 && exerciseDuration > 5) {
        recs.push({
            id: Date.now() + 8,
            type: 'demo',
            title: 'AI System Active',
            message: 'BioSync is monitoring your performance and will provide recommendations as needed',
            icon: Brain,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        });
    }

    console.log('Generated recommendations:', recs);
    setRecommendations(recs);
};
    const checkForAlerts = () => {
        const newAlerts = [];

        // Personalized heart rate alerts
        if (biometrics.heartRate > (userProfile.maxHeartRate || 190) * 0.9) {
            newAlerts.push({
                id: Date.now(),
                message: 'Heart rate approaching your maximum safe limit'
            });
        }

        // Special alerts for medical conditions
        if (userProfile.medicalConditions.includes('Hypertension') && biometrics.heartRate > 160) {
            newAlerts.push({
                id: Date.now() + 1,
                message: 'Heart rate elevated - consider reducing intensity (hypertension management)'
            });
        }

        if (biometrics.hydrationLevel < 70) {
            newAlerts.push({
                id: Date.now() + 2,
                message: 'Dehydration risk - performance declining'
            });
        }

        if (newAlerts.length > 0) {
            setAlerts(newAlerts);
        }
    };

    const handleStartStop = () => {
        console.log('Start/Stop clicked. Current state:', isExercising);
        if (!isExercising) {
            // Starting exercise
            setIsExercising(true);
            setHistoricalData([]); // Clear previous data
            setExerciseDuration(0);
            setAlerts([]);
            setRecommendations([]);
        } else {
            // Stopping exercise
            setIsExercising(false);
            // Reset biometrics gradually
            setBiometrics(prev => ({
                ...prev,
                heartRateZone: 'rest'
            }));
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

    // For testing, skip to dashboard
    if (currentStep === 'dashboard') {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Brain className="text-3xl" />
                                <div>
                                    <h1 className="text-2xl font-bold">BioSync</h1>
                                    <p className="text-sm text-gray-600">Welcome, {userProfile.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <select
                                    value={exerciseType}
                                    onChange={(e) => setExerciseType(e.target.value)}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isExercising}
                                >
                                    <option value="running">Running</option>
                                    <option value="cycling">Cycling</option>
                                    <option value="swimming">Swimming</option>
                                    <option value="strength">Strength</option>
                                    <option value="yoga">Yoga</option>
                                </select>
                                <button
                                    onClick={handleStartStop}
                                    className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                                        isExercising 
                                            ? 'bg-red-500 hover:bg-red-600' 
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                >
                                    {isExercising ? 'Stop' : 'Start'}
                                </button>
                                {isExercising && (
                                    <div className="font-mono text-lg font-semibold">
                                        {formatDuration(exerciseDuration)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="bg-red-50 border-b px-4 py-3">
                        <div className="max-w-7xl mx-auto flex items-center">
                            <AlertCircle className="text-red-600 mr-2" />
                            <p className="text-red-800">{alerts[0].message}</p>
                        </div>
                    </div>
                )}

                {/* User Stats Bar */}
                <div className="bg-blue-50 border-b px-4 py-3">
                    <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-6">
                            <span><strong>Age:</strong> {userProfile.age}</span>
                            <span><strong>BMI:</strong> {userProfile.bmi}</span>
                            <span><strong>Activity:</strong> {userProfile.activityLevel}</span>
                            <span><strong>Max HR:</strong> {userProfile.maxHeartRate} bpm</span>
                            {isExercising && (
                                <span className="text-green-600 font-semibold">
                                    🟢 Exercise Active
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard */}
                <main className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Metrics */}
                        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-red-50 rounded-xl p-4 transition-all hover:shadow-lg">
                                <Heart className="text-2xl mb-2" />
                                <div className="text-2xl font-bold">{biometrics.heartRate}</div>
                                <div className="text-sm text-gray-600">Heart Rate</div>
                                <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${getZoneColor(biometrics.heartRateZone)}`}>
                                    {biometrics.heartRateZone}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Target: {Math.round((userProfile.maxHeartRate || 190) * 0.7)}-{Math.round((userProfile.maxHeartRate || 190) * 0.85)}
                                </div>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 transition-all hover:shadow-lg">
                                <Droplets className="text-2xl mb-2" />
                                <div className="text-2xl font-bold">{Math.round(biometrics.hydrationLevel)}%</div>
                                <div className="text-sm text-gray-600">Hydration</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${biometrics.hydrationLevel}%` }}
                                    />
                                </div>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-4 transition-all hover:shadow-lg">
                                <Zap className="text-2xl mb-2" />
                                <div className="text-2xl font-bold">{Math.round(biometrics.glycogenStores)}%</div>
                                <div className="text-sm text-gray-600">Glycogen</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${biometrics.glycogenStores}%` }}
                                    />
                                </div>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-4 transition-all hover:shadow-lg">
                                <Thermometer className="text-2xl mb-2" />
                                <div className="text-2xl font-bold">{biometrics.coreTemp.toFixed(1)}°C</div>
                                <div className="text-sm text-gray-600">Core Temp</div>
                                <div className={`text-xs mt-1 ${biometrics.coreTemp > 38.5 ? 'text-red-600' : 'text-green-600'}`}>
                                    {biometrics.coreTemp > 38.5 ? '⚠️ High' : '✓ Normal'}
                                </div>
                            </div>
                        </div>

                        {/* Personalized Recommendations */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <Brain className="mr-2" />
                                AI Recommendations
                            </h3>
                            {recommendations.length > 0 ? (
                                <div className="space-y-3">
                                    {recommendations.map(rec => (
                                        <div key={rec.id} className={`${rec.bgColor} rounded-lg p-3 transition-all hover:shadow-md`}>
                                            <div className="flex items-start space-x-3">
                                                <rec.icon className="text-2xl flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold">{rec.title}</h4>
                                                    <p className="text-sm">{rec.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Activity className="text-4xl mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-500">
                                        {isExercising 
                                            ? 'Monitoring your performance...' 
                                            : 'Start exercising to receive personalized recommendations'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Chart */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <BarChart3 className="mr-2" />
                                Performance Tracking
                            </h3>
                            <SimpleChart data={historicalData} />
                            {isExercising && historicalData.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Avg Heart Rate</p>
                                        <p className="text-lg font-semibold text-red-600">
                                            {Math.round(historicalData.reduce((sum, d) => sum + d.heartRate, 0) / historicalData.length)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Calories Burned</p>
                                        <p className="text-lg font-semibold text-orange-600">
                                            {Math.round(exerciseDuration * 0.1 * (parseFloat(userProfile.weight) || 70) / 60)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Sweat Loss</p>
                                        <p className="text-lg font-semibold text-blue-600">
                                            {(biometrics.sweatRate * exerciseDuration / 3600).toFixed(1)}L
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Personalized Stats */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <User className="mr-2" />
                                Your Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Daily Calorie Needs:</span>
                                    <span className="font-semibold">
                                        {Math.round((userProfile.bmr || 1680) * 1.5)} cal
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Water Needs:</span>
                                    <span className="font-semibold">
                                        {Math.round((parseFloat(userProfile.weight) || 70) * 35)} ml/day
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fitness Level:</span>
                                    <span className="font-semibold capitalize">{userProfile.activityLevel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Exercise Status:</span>
                                    <span className={`font-semibold ${isExercising ? 'text-green-600' : 'text-gray-600'}`}>
                                        {isExercising ? '🏃 Active' : '⏸️ Resting'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Return dashboard by default for testing
    return null;
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BioSyncAdvanced />);
