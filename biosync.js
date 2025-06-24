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
const Shield = ({ className = "" }) => <span className={className}>🛡️</span>;

// Enhanced Chart Component with Real-Time Updates
const SimpleChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded p-4">
                <div className="text-center text-gray-500">
                    <Activity className="text-4xl mx-auto mb-2" />
                    <p>Start exercising to see your performance data</p>
                </div>
            </div>
        );
    }
    
    const maxHR = Math.max(...data.map(d => d.heartRate || 0), 200);
    const minHR = Math.min(...data.map(d => d.heartRate || 0), 60);
    const hrRange = maxHR - minHR || 1;
    
    return (
        <div className="h-64 bg-gray-50 rounded p-4">
            <svg width="100%" height="100%" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#ef4444', stopOpacity:0.8}} />
                        <stop offset="100%" style={{stopColor:'#dc2626', stopOpacity:0.8}} />
                    </linearGradient>
                    <linearGradient id="hydrationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#3b82f6', stopOpacity:0.6}} />
                        <stop offset="100%" style={{stopColor:'#2563eb', stopOpacity:0.6}} />
                    </linearGradient>
                </defs>
                
                {/* Heart Rate Path */}
                <path
                    d={data.map((item, i) => {
                        const x = 20 + (i / (data.length - 1 || 1)) * 560;
                        const y = 20 + (1 - (item.heartRate - minHR) / hrRange) * 200;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                />
                
                {/* Hydration Path */}
                <path
                    d={data.map((item, i) => {
                        const x = 20 + (i / (data.length - 1 || 1)) * 560;
                        const y = 20 + (1 - item.hydration / 100) * 200;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />
                
                {/* Data Points */}
                {data.map((item, i) => {
                    const x = 20 + (i / (data.length - 1 || 1)) * 560;
                    const hrY = 20 + (1 - (item.heartRate - minHR) / hrRange) * 200;
                    const hydrationY = 20 + (1 - item.hydration / 100) * 200;
                    
                    return (
                        <g key={i}>
                            <circle cx={x} cy={hrY} r="4" fill="#dc2626" stroke="white" strokeWidth="2">
                                <title>Time: {item.time}s | HR: {item.heartRate} | Hydration: {Math.round(item.hydration)}%</title>
                            </circle>
                            <circle cx={x} cy={hydrationY} r="3" fill="#3b82f6" stroke="white" strokeWidth="2">
                                <title>Hydration: {Math.round(item.hydration)}%</title>
                            </circle>
                        </g>
                    );
                })}
                
                {/* Labels */}
                <text x="20" y="235" fontSize="12" fill="#666">0s</text>
                <text x="580" y="235" fontSize="12" fill="#666" textAnchor="end">{data[data.length - 1]?.time}s</text>
                <text x="300" y="235" fontSize="12" fill="#dc2626" textAnchor="middle">❤️ Heart Rate</text>
                <text x="300" y="15" fontSize="12" fill="#3b82f6" textAnchor="middle">💧 Hydration</text>
            </svg>
        </div>
    );
};

const BioSyncAdvanced = () => {
    const [currentStep, setCurrentStep] = useState('welcome');
    const [isExercising, setIsExercising] = useState(false);
    const [exerciseType, setExerciseType] = useState('running');
    const [exerciseDuration, setExerciseDuration] = useState(0);
    
    // User profile state
    const [userProfile, setUserProfile] = useState({
        name: '',
        age: '',
        gender: '',
        weight: '',
        height: '',
        activityLevel: '',
        fitnessGoals: [],
        medicalConditions: [],
        bmi: null,
        bmr: null,
        maxHeartRate: null
    });

    // Medical report state
    const [medicalReport, setMedicalReport] = useState(null);
    const [reportAnalysis, setReportAnalysis] = useState(null);

    // Biometrics state
    const [biometrics, setBiometrics] = useState({
        heartRate: 72,
        heartRateZone: 'rest',
        sweatRate: 0,
        coreTemp: 37.0,
        hydrationLevel: 100,
        electrolyteBalance: { sodium: 140, potassium: 4.0, magnesium: 1.8 },
        glycogenStores: 100,
        fatigue: 0,
        vo2Max: 45
    });

    // Separate cooldown tracking
    const [cooldowns, setCooldowns] = useState({
        hydrationCooldown: 0,
        energyCooldown: 0,
        tempCooldown: 0
    });

    // Separate alert tracking
    const [lastAlerts, setLastAlerts] = useState({
        hydration: 0,
        energy: 0,
        temp: 0
    });

    const [recommendations, setRecommendations] = useState([]);
    const [completedRecommendations, setCompletedRecommendations] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [historicalData, setHistoricalData] = useState([]);
    const intervalRef = useRef(null);

    // Calculate BMI and BMR when profile changes
    useEffect(() => {
        if (userProfile.weight && userProfile.height && userProfile.age) {
            const heightInMeters = parseFloat(userProfile.height) / 100;
            const weight = parseFloat(userProfile.weight);
            const age = parseInt(userProfile.age);
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

    // Exercise timer
    useEffect(() => {
        if (isExercising) {
            intervalRef.current = setInterval(() => {
                setExerciseDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isExercising]);

    // Update biometrics and recommendations when exercising
    useEffect(() => {
        if (isExercising && exerciseDuration > 0) {
            updateBiometrics();
            generateRecommendations();
            updateHistoricalData();
        }
    }, [exerciseDuration, isExercising]);

    // Enhanced updateBiometrics with cooldown system
    const updateBiometrics = () => {
        setBiometrics(prev => {
            const intensityMultiplier = {
                running: 2.2, cycling: 1.8, swimming: 2.0, strength: 1.5, yoga: 1.2
            }[exerciseType] || 1.5;

            const baseHR = userProfile.gender === 'male' ? 70 : 75;
            const maxHR = userProfile.maxHeartRate || 190;
            const targetHR = Math.min(baseHR + (exerciseDuration * intensityMultiplier * 0.3), maxHR * 0.85);
            const newHR = prev.heartRate + (targetHR - prev.heartRate) * 0.1;

            const hrPercentage = ((newHR - baseHR) / (maxHR - baseHR)) * 100;
            let zone = 'rest';
            if (hrPercentage > 80) zone = 'peak';
            else if (hrPercentage > 70) zone = 'cardio';
            else if (hrPercentage > 60) zone = 'aerobic';
            else if (hrPercentage > 50) zone = 'fat-burn';
            else if (hrPercentage > 0) zone = 'warm-up';

            const intensityFactor = Math.max(hrPercentage / 100, 0);
            const bodyWeightFactor = (parseFloat(userProfile.weight) || 70) / 70;
            const newSweatRate = 0.5 * intensityFactor * bodyWeightFactor;
            
            // Only decrease if not in cooldown
            let newHydration = prev.hydrationLevel;
            if (cooldowns.hydrationCooldown === 0) {
                newHydration = Math.max(prev.hydrationLevel - (newSweatRate * 0.5), 0);
            }
            
            let newGlycogen = prev.glycogenStores;
            if (cooldowns.energyCooldown === 0) {
                newGlycogen = Math.max(prev.glycogenStores - (intensityFactor * 0.3), 0);
            }
            
            let newCoreTemp = prev.coreTemp;
            if (cooldowns.tempCooldown === 0) {
                newCoreTemp = Math.min(prev.coreTemp + intensityFactor * 0.015, 39.5);
            } else {
                newCoreTemp = Math.max(prev.coreTemp - 0.02, 37.0);
            }

            return {
                ...prev,
                heartRate: Math.round(newHR),
                heartRateZone: zone,
                sweatRate: newSweatRate,
                coreTemp: newCoreTemp,
                hydrationLevel: newHydration,
                glycogenStores: newGlycogen
            };
        });

        // Update cooldowns
        setCooldowns(prev => ({
            hydrationCooldown: Math.max(prev.hydrationCooldown - 1, 0),
            energyCooldown: Math.max(prev.energyCooldown - 1, 0),
            tempCooldown: Math.max(prev.tempCooldown - 1, 0)
        }));
    };

    // Enhanced generateRecommendations with repeated alerts
    const generateRecommendations = () => {
        const recs = [];

        // Always show current status
        recs.push({
            id: 'status',
            type: 'status',
            title: `${userProfile.name}'s AI Analysis`,
            message: `Monitoring your ${exerciseType} session - ${Math.floor(exerciseDuration/60)}:${(exerciseDuration%60).toString().padStart(2,'0')} elapsed. Heart rate in ${biometrics.heartRateZone} zone.`,
            icon: Brain,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            actionable: false,
            completed: false
        });

        // HYDRATION - Show again after 60 seconds if still low
        if (biometrics.hydrationLevel < 90 && (exerciseDuration - lastAlerts.hydration) > 60) {
            const bodyWeight = parseFloat(userProfile.weight) || 70;
            const waterNeeded = Math.round((100 - biometrics.hydrationLevel) * bodyWeight * 0.015);
            
            let urgency = '';
            if (biometrics.hydrationLevel < 70) urgency = 'URGENT: ';
            else if (biometrics.hydrationLevel < 80) urgency = 'Important: ';
            
            recs.push({
                id: `hydration_${exerciseDuration}`,
                type: 'hydration',
                title: `${urgency}Hydration Alert`,
                message: `${userProfile.name}, drink ${waterNeeded}ml water now. As a ${userProfile.activityLevel} athlete (${bodyWeight}kg), your body needs extra hydration during ${exerciseType}.`,
                icon: Droplets,
                color: 'text-blue-500',
                bgColor: biometrics.hydrationLevel < 70 ? 'bg-red-50' : 'bg-blue-50',
                actionable: true,
                completed: false
            });
            setLastAlerts(prev => ({ ...prev, hydration: exerciseDuration }));
        }

        // ENERGY - Show again after 90 seconds if still low
        if (biometrics.glycogenStores < 70 && (exerciseDuration - lastAlerts.energy) > 90) {
            const baseCarbs = userProfile.gender === 'female' ? 25 : 30;
            const intensityMultiplier = {
                running: 1.2, cycling: 1.0, swimming: 1.1, strength: 0.8, yoga: 0.5
            }[exerciseType];
            const recommendedCarbs = Math.round(baseCarbs * intensityMultiplier);
            
            recs.push({
                id: `energy_${exerciseDuration}`,
                type: 'energy',
                title: `Energy Management for ${userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1)} Athletes`,
                message: `${userProfile.name}, consume ${recommendedCarbs}g quick carbs (banana, sports drink). ${userProfile.gender === 'female' ? 'Women' : 'Men'} typically need this amount during ${exerciseType} sessions lasting ${Math.floor(exerciseDuration/60)}+ minutes.`,
                icon: Zap,
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-50',
                actionable: true,
                completed: false
            });
            setLastAlerts(prev => ({ ...prev, energy: exerciseDuration }));
        }

        // TEMPERATURE - Show again after 120 seconds if still high
        if (biometrics.coreTemp > 38.0 && (exerciseDuration - lastAlerts.temp) > 120) {
            const ageWarning = userProfile.age > 50 ? ' Especially important at your age.' : '';
            recs.push({
                id: `temp_${exerciseDuration}`,
                type: 'cooling',
                title: 'Temperature Safety Alert',
                message: `${userProfile.name}, core temp elevated to ${biometrics.coreTemp.toFixed(1)}°C. Take a 2-minute cool-down break.${ageWarning}`,
                icon: Thermometer,
                color: 'text-orange-500',
                bgColor: 'bg-orange-50',
                actionable: true,
                completed: false
            });
            setLastAlerts(prev => ({ ...prev, temp: exerciseDuration }));
        }

        // Heart rate zone feedback
        if (biometrics.heartRateZone === 'peak') {
            const ageGroup = userProfile.age < 25 ? 'young athlete' : userProfile.age > 50 ? 'experienced athlete' : 'athlete';
            recs.push({
                id: 'hr-peak',
                type: 'intensity',
                title: `Peak Zone Alert for ${userProfile.age}-year-old`,
                message: `${userProfile.name}, as a ${ageGroup}, reduce intensity to 70-85% max HR (${Math.round(userProfile.maxHeartRate * 0.7)}-${Math.round(userProfile.maxHeartRate * 0.85)} bpm) for optimal ${exerciseType} performance.`,
                icon: Heart,
                color: 'text-red-500',
                bgColor: 'bg-red-50',
                actionable: false,
                completed: false
            });
        } else if (biometrics.heartRateZone === 'cardio') {
            recs.push({
                id: 'hr-cardio',
                type: 'performance',
                title: 'Perfect Cardio Zone Achievement',
                message: `Excellent! Your ${biometrics.heartRate} bpm is ideal for your age (${userProfile.age}). This zone maximizes fat burn and cardiovascular benefits for ${exerciseType}.`,
                icon: Heart,
                color: 'text-green-500',
                bgColor: 'bg-green-50',
                actionable: false,
                completed: false
            });
        }

        // Add back completed recommendations
        Object.values(completedRecommendations).forEach(rec => {
            if (!recs.find(r => r.id === rec.id)) {
                recs.push(rec);
            }
        });
        
        setRecommendations(recs);
    };

    const updateHistoricalData = () => {
        setHistoricalData(prev => {
            const newEntry = {
                time: exerciseDuration,
                heartRate: biometrics.heartRate,
                hydration: Math.round(biometrics.hydrationLevel),
                glycogen: Math.round(biometrics.glycogenStores),
                fatigue: Math.round(biometrics.fatigue || 0)
            };
            return [...prev.slice(-29), newEntry]; // Keep last 30 points
        });
    };

    // Complete recommendation handler
    const completeRecommendation = (recId) => {
        const rec = recommendations.find(r => r.id === recId);
        if (!rec || !rec.actionable || rec.completed) return;

        // Mark as completed
        const completedRec = { ...rec, completed: true };
        setCompletedRecommendations(prev => ({ ...prev, [recId]: completedRec }));
        
        // Update recommendations
        setRecommendations(prev => prev.map(r => 
            r.id === recId ? { ...r, completed: true } : r
        ));

        // Apply the effect based on type
        switch(rec.type) {
            case 'hydration':
                setBiometrics(prev => ({ ...prev, hydrationLevel: Math.min(100, prev.hydrationLevel + 20) }));
                setCooldowns(prev => ({ ...prev, hydrationCooldown: 45 }));
                showNotification('💧 Hydration restored! You\'ll maintain this level for a while.');
                break;
                
            case 'energy':
                setBiometrics(prev => ({ ...prev, glycogenStores: Math.min(100, prev.glycogenStores + 25) }));
                setCooldowns(prev => ({ ...prev, energyCooldown: 60 }));
                showNotification('⚡ Energy boosted! Your glycogen stores are replenished.');
                break;
                
            case 'cooling':
                setBiometrics(prev => ({ 
                    ...prev, 
                    coreTemp: Math.max(37.0, prev.coreTemp - 0.3),
                    heartRate: Math.max(72, prev.heartRate - 10)
                }));
                setCooldowns(prev => ({ ...prev, tempCooldown: 30 }));
                showNotification('🌡️ Cooling down! Your body temperature is normalizing.');
                break;
        }
    };

    // Notification function
    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 notification';
        notification.style.animation = 'slideIn 0.3s ease-out';
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="text-xl mr-2">✅</span>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        if (userProfile.name && userProfile.age && userProfile.gender && userProfile.weight && userProfile.height) {
            setCurrentStep('medical');
        }
    };

    const handleMedicalReportUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedicalReport(file);
            
            // Simulate analysis
            setTimeout(() => {
                const analysis = {
                    glucose: Math.random() > 0.7 ? 'normal' : 'low',
                    cholesterol: Math.random() > 0.6 ? 'normal' : 'high',
                    hemoglobin: Math.random() > 0.8 ? 'normal' : 'low',
                    vitamins: { d: Math.random() > 0.5 ? 'normal' : 'low' },
                    recommendations: [
                        'Monitor blood sugar during exercise', 
                        'Consider vitamin D supplementation',
                        'Stay hydrated during workouts'
                    ]
                };
                setReportAnalysis(analysis);
            }, 2000);
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

    // Fixed toggle exercise function
    const toggleExercise = () => {
        if (!isExercising) {
            setIsExercising(true);
            setExerciseDuration(0);
            setHistoricalData([]);
            setRecommendations([]);
            setCompletedRecommendations({});
            setLastAlerts({ hydration: 0, energy: 0, temp: 0 });
            setCooldowns({ hydrationCooldown: 0, energyCooldown: 0, tempCooldown: 0 });
        } else {
            setIsExercising(false);
            setExerciseDuration(0);
            setBiometrics({
                heartRate: 72,
                heartRateZone: 'rest',
                sweatRate: 0,
                coreTemp: 37.0,
                hydrationLevel: 100,
                electrolyteBalance: { sodium: 140, potassium: 4.0, magnesium: 1.8 },
                glycogenStores: 100,
                fatigue: 0,
                vo2Max: 45
            });
            setCooldowns({ hydrationCooldown: 0, energyCooldown: 0, tempCooldown: 0 });
            setLastAlerts({ hydration: 0, energy: 0, temp: 0 });
            setRecommendations([]);
            setCompletedRecommendations({});
        }
    };

    // WELCOME SCREEN
    if (currentStep === 'welcome') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-4 border border-white/20">
                    <Brain className="text-6xl mx-auto mb-6 block" />
                    <h1 className="text-4xl font-bold text-white mb-4 text-center">Welcome to BioSync</h1>
                    <p className="text-white/80 text-lg mb-8 text-center">
                        AI-powered nutrition optimization that adapts to your unique physiology. 
                        Let's personalize your experience with your health data.
                    </p>
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <Shield className="text-3xl" />
                        <p className="text-white/70 text-sm">Your data is secure and never shared</p>
                    </div>
                    <button
                        onClick={() => setCurrentStep('profile')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        );
    }

    // PROFILE SETUP SCREEN
    if (currentStep === 'profile') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Personal Profile</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={userProfile.name}
                                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                    <input
                                        type="number"
                                        required
                                        min="10"
                                        max="100"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={userProfile.age}
                                        onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                                        placeholder="25"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <div className="flex space-x-4">
                                    {['male', 'female', 'other'].map(gender => (
                                        <label key={gender} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={gender}
                                                required
                                                className="mr-2"
                                                checked={userProfile.gender === gender}
                                                onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                                            />
                                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                                    <input
                                        type="number"
                                        required
                                        min="30"
                                        max="300"
                                        step="0.1"
                                        className="w-full px-4 py-2 border
