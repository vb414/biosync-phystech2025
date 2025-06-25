const { useState, useEffect, useRef, useCallback } = React;

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
    const [historicalData, setHistoricalData] = useState([]);
    const intervalRef = useRef(null);
    const lastUpdateRef = useRef(0);

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

   // FIXED Exercise timer - Simple approach that forces re-render
    useEffect(() => {
        let interval = null;
        
        if (isExercising) {
            interval = setInterval(() => {
                setExerciseDuration(prevDuration => prevDuration + 1);
            }, 1000);
        } else if (!isExercising && exerciseDuration !== 0) {
            setExerciseDuration(0);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isExercising]);

    // Update other metrics when duration changes
    useEffect(() => {
        if (isExercising && exerciseDuration > 0) {
            // Update all biometrics
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

            // Update historical data
            setHistoricalData(prev => {
                const newEntry = {
                    time: exerciseDuration,
                    heartRate: biometrics.heartRate,
                    hydration: Math.round(biometrics.hydrationLevel),
                    glycogen: Math.round(biometrics.glycogenStores),
                    fatigue: Math.round(biometrics.fatigue || 0)
                };
                return [...prev.slice(-29), newEntry];
            });

            // Generate recommendations
            generateRecommendations(exerciseDuration);
        }
    }, [exerciseDuration, isExercising, exerciseType, userProfile, cooldowns, biometrics]);

    // Enhanced generateRecommendations with duration parameter
    const generateRecommendations = (duration) => {
        setRecommendations(prevRecs => {
            const newRecs = [];

            // Always show current status
            newRecs.push({
                id: 'status',
                type: 'status',
                title: `${userProfile.name}'s AI Analysis`,
                message: `Monitoring your ${exerciseType} session - ${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')} elapsed. Heart rate in ${biometrics.heartRateZone} zone.`,
                icon: Brain,
                color: 'text-blue-500',
                bgColor: 'bg-blue-50',
                actionable: false,
                completed: false
            });

            // Check for existing non-completed recommendations
            const existingHydration = prevRecs.find(r => r.type === 'hydration' && !r.completed);
            const existingEnergy = prevRecs.find(r => r.type === 'energy' && !r.completed);
            const existingCooling = prevRecs.find(r => r.type === 'cooling' && !r.completed);

            // HYDRATION - Show again after 60 seconds if still low
            if (!existingHydration && biometrics.hydrationLevel < 90 && (duration - lastAlerts.hydration) > 60) {
                const bodyWeight = parseFloat(userProfile.weight) || 70;
                const waterNeeded = Math.round((100 - biometrics.hydrationLevel) * bodyWeight * 0.015);
                
                let urgency = '';
                if (biometrics.hydrationLevel < 70) urgency = 'URGENT: ';
                else if (biometrics.hydrationLevel < 80) urgency = 'Important: ';
                
                newRecs.push({
                    id: `hydration_${duration}`,
                    type: 'hydration',
                    title: `${urgency}Hydration Alert`,
                    message: `${userProfile.name}, drink ${waterNeeded}ml water now. As a ${userProfile.activityLevel} athlete (${bodyWeight}kg), your body needs extra hydration during ${exerciseType}.`,
                    icon: Droplets,
                    color: 'text-blue-500',
                    bgColor: biometrics.hydrationLevel < 70 ? 'bg-red-50' : 'bg-blue-50',
                    actionable: true,
                    completed: false
                });
                setLastAlerts(prev => ({ ...prev, hydration: duration }));
            }

            // ENERGY - Show again after 90 seconds if still low
            if (!existingEnergy && biometrics.glycogenStores < 70 && (duration - lastAlerts.energy) > 90) {
                const baseCarbs = userProfile.gender === 'female' ? 25 : 30;
                const intensityMultiplier = {
                    running: 1.2, cycling: 1.0, swimming: 1.1, strength: 0.8, yoga: 0.5
                }[exerciseType];
                const recommendedCarbs = Math.round(baseCarbs * intensityMultiplier);
                
                newRecs.push({
                    id: `energy_${duration}`,
                    type: 'energy',
                    title: `Energy Management for ${userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1)} Athletes`,
                    message: `${userProfile.name}, consume ${recommendedCarbs}g quick carbs (banana, sports drink). ${userProfile.gender === 'female' ? 'Women' : 'Men'} typically need this amount during ${exerciseType} sessions lasting ${Math.floor(duration/60)}+ minutes.`,
                    icon: Zap,
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50',
                    actionable: true,
                    completed: false
                });
                setLastAlerts(prev => ({ ...prev, energy: duration }));
            }

            // TEMPERATURE - Show again after 120 seconds if still high
            if (!existingCooling && biometrics.coreTemp > 38.0 && (duration - lastAlerts.temp) > 120) {
                const ageWarning = userProfile.age > 50 ? ' Especially important at your age.' : '';
                newRecs.push({
                    id: `temp_${duration}`,
                    type: 'cooling',
                    title: 'Temperature Safety Alert',
                    message: `${userProfile.name}, core temp elevated to ${biometrics.coreTemp.toFixed(1)}°C. Take a 2-minute cool-down break.${ageWarning}`,
                    icon: Thermometer,
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-50',
                    actionable: true,
                    completed: false
                });
                setLastAlerts(prev => ({ ...prev, temp: duration }));
            }

            // Heart rate zone feedback
            if (biometrics.heartRateZone === 'peak') {
                const ageGroup = userProfile.age < 25 ? 'young athlete' : userProfile.age > 50 ? 'experienced athlete' : 'athlete';
                newRecs.push({
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
            }

            // Add back existing recommendations
            prevRecs.forEach(rec => {
                if (!newRecs.find(r => r.id === rec.id)) {
                    newRecs.push(rec);
                }
            });

            // Add completed recommendations
            Object.values(completedRecommendations).forEach(rec => {
                if (!newRecs.find(r => r.id === rec.id)) {
                    newRecs.push(rec);
                }
            });
            
            return newRecs;
        });
    }, [biometrics, userProfile, exerciseType, lastAlerts, completedRecommendations]);

    const updateHistoricalData = useCallback((duration) => {
        setHistoricalData(prev => {
            const newEntry = {
                time: duration,
                heartRate: biometrics.heartRate,
                hydration: Math.round(biometrics.hydrationLevel),
                glycogen: Math.round(biometrics.glycogenStores),
                fatigue: Math.round(biometrics.fatigue || 0)
            };
            return [...prev.slice(-29), newEntry]; // Keep last 30 points
        });
    }, [biometrics]);

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
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={userProfile.weight}
                                        onChange={(e) => setUserProfile({...userProfile, weight: e.target.value})}
                                        placeholder="70"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                                    <input
                                        type="number"
                                        required
                                        min="100"
                                        max="250"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={userProfile.height}
                                        onChange={(e) => setUserProfile({...userProfile, height: e.target.value})}
                                        placeholder="175"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={userProfile.activityLevel}
                                    onChange={(e) => setUserProfile({...userProfile, activityLevel: e.target.value})}
                                >
                                    <option value="">Select activity level</option>
                                    <option value="sedentary">Sedentary (little to no exercise)</option>
                                    <option value="light">Light (exercise 1-3 days/week)</option>
                                    <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                                    <option value="active">Active (exercise 6-7 days/week)</option>
                                    <option value="athlete">Athlete (intense training)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goals</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Weight Loss', 'Muscle Gain', 'Endurance', 'General Health', 'Performance', 'Recovery'].map(goal => (
                                        <label key={goal} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={userProfile.fitnessGoals.includes(goal)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUserProfile({...userProfile, fitnessGoals: [...userProfile.fitnessGoals, goal]});
                                                    } else {
                                                        setUserProfile({...userProfile, fitnessGoals: userProfile.fitnessGoals.filter(g => g !== goal)});
                                                    }
                                                }}
                                            />
                                            {goal}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid'].map(condition => (
                                        <label key={condition} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={userProfile.medicalConditions.includes(condition)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setUserProfile({...userProfile, medicalConditions: [...userProfile.medicalConditions, condition]});
                                                    } else {
                                                        setUserProfile({...userProfile, medicalConditions: userProfile.medicalConditions.filter(c => c !== condition)});
                                                    }
                                                }}
                                            />
                                            {condition}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {userProfile.bmi && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">📊 Your Calculated Metrics:</h3>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div><span className="text-gray-600">BMI:</span> <span className="font-semibold ml-2">{userProfile.bmi}</span></div>
                                        <div><span className="text-gray-600">BMR:</span> <span className="font-semibold ml-2">{userProfile.bmr} cal/day</span></div>
                                        <div><span className="text-gray-600">Max HR:</span> <span className="font-semibold ml-2">{userProfile.maxHeartRate} bpm</span></div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                            >
                                Continue to Medical Information
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

// MEDICAL REPORT UPLOAD SCREEN
    if (currentStep === 'medical') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Medical Information</h2>
                        <p className="text-gray-600 mb-8">
                            Upload your recent medical report for personalized nutrition recommendations. This is optional but helps us provide more accurate guidance.
                        </p>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-400 transition-colors">
                            <Upload className="text-5xl mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Upload Medical Report</h3>
                            <p className="text-sm text-gray-600 mb-4">PDF, JPG, or PNG (Max 10MB)</p>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleMedicalReportUpload}
                                className="hidden"
                                id="medical-upload"
                            />
                            <label
                                htmlFor="medical-upload"
                                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all"
                            >
                                Choose File
                            </label>
                        </div>

                        {medicalReport && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <CheckCircle2 className="text-2xl mr-3" />
                                    <div>
                                        <p className="font-semibold text-green-800">File Uploaded Successfully</p>
                                        <p className="text-sm text-green-600">{medicalReport.name}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {reportAnalysis && (
                            <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                <h3 className="font-semibold text-lg mb-4">🔬 Medical Report Analysis</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex justify-between bg-white p-3 rounded">
                                        <span>Glucose:</span>
                                        <span className={`font-semibold ${reportAnalysis.glucose === 'normal' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {reportAnalysis.glucose}
                                        </span>
                                    </div>
                                    <div className="flex justify-between bg-white p-3 rounded">
                                        <span>Cholesterol:</span>
                                        <span className={`font-semibold ${reportAnalysis.cholesterol === 'normal' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {reportAnalysis.cholesterol}
                                        </span>
                                    </div>
                                </div>
                                {reportAnalysis.recommendations && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Recommendations:</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {reportAnalysis.recommendations.map((rec, i) => (
                                                <li key={i} className="text-sm text-gray-700">{rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <Shield className="text-2xl mr-3 mt-1" />
                                <div>
                                    <h4 className="font-semibold mb-1">Your Privacy Matters</h4>
                                    <p className="text-sm text-gray-600">
                                        Your medical data is processed locally and never stored on our servers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setCurrentStep('profile')}
                                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setCurrentStep('dashboard')}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                            >
                                {medicalReport ? 'Start BioSync' : 'Skip & Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

// MAIN DASHBOARD
    return (
        <div className="min-h-screen bg-gray-50">
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
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                disabled={isExercising}
                            >
                                <option value="running">🏃 Running</option>
                                <option value="cycling">🚴 Cycling</option>
                                <option value="swimming">🏊 Swimming</option>
                                <option value="strength">💪 Strength</option>
                                <option value="yoga">🧘 Yoga</option>
                            </select>
                            <button
                                onClick={toggleExercise}
                                className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                                    isExercising 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                {isExercising ? '⏹️ Stop' : '▶️ Start'}
                            </button>
                            {isExercising && (
                                <div className="font-mono text-lg font-semibold text-blue-600 animate-pulse">
                                    {formatDuration(exerciseDuration)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* User Stats Bar */}
            <div className="bg-blue-50 border-b px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-6">
                        <span><strong>Age:</strong> {userProfile.age}</span>
                        <span><strong>BMI:</strong> {userProfile.bmi}</span>
                        <span><strong>Activity:</strong> {userProfile.activityLevel}</span>
                        <span><strong>Max HR:</strong> {userProfile.maxHeartRate} bpm</span>
                        {isExercising && (
                            <span className="text-green-600 font-semibold animate-pulse">
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
                            {cooldowns.hydrationCooldown > 0 && (
                                <div className="text-xs text-green-600 mt-1">Protected: {cooldowns.hydrationCooldown}s</div>
                            )}
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
                            {cooldowns.energyCooldown > 0 && (
                                <div className="text-xs text-green-600 mt-1">Protected: {cooldowns.energyCooldown}s</div>
                            )}
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 transition-all hover:shadow-lg">
                            <Thermometer className="text-2xl mb-2" />
                            <div className="text-2xl font-bold">{biometrics.coreTemp.toFixed(1)}°C</div>
                            <div className="text-sm text-gray-600">Core Temp</div>
                            <div className={`text-xs mt-1 ${biometrics.coreTemp > 38.0 ? 'text-red-600' : 'text-green-600'}`}>
                                {biometrics.coreTemp > 38.0 ? '⚠️ Elevated' : '✓ Normal'}
                            </div>
                            {cooldowns.tempCooldown > 0 && (
                                <div className="text-xs text-blue-600 mt-1">Cooling: {cooldowns.tempCooldown}s</div>
                            )}
                        </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Brain className="mr-2" />
                            AI Recommendations
                        </h3>
                        {recommendations.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {recommendations.map(rec => (
                                    <div key={rec.id} className={`${rec.bgColor} rounded-lg p-3 transition-all hover:shadow-md ${rec.completed ? 'opacity-60' : ''}`}>
                                        <div className="flex items-start space-x-3">
                                            <rec.icon className="text-xl flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h4 className={`font-semibold text-sm ${rec.completed ? 'line-through' : ''}`}>{rec.title}</h4>
                                                <p className="text-xs text-gray-700 mt-1">{rec.message}</p>
                                                {rec.actionable && !rec.completed && (
                                                    <button
                                                        onClick={() => completeRecommendation(rec.id)}
                                                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-all"
                                                    >
                                                        ✓ Done
                                                    </button>
                                                )}
                                                {rec.completed && (
                                                    <div className="mt-2 text-xs text-green-600 font-semibold">
                                                        ✅ Completed
                                                    </div>
                                                )}
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
                                        ? 'AI monitoring your performance...' 
                                        : 'Start exercising to receive AI recommendations'}
                                </p>
                            </div>
                        )}

                        {/* Medical-based recommendations */}
                        {reportAnalysis && reportAnalysis.recommendations && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold text-sm mb-2">📋 From your medical report:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {reportAnalysis.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Performance Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <BarChart3 className="mr-2" />
                            Real-Time Performance Tracking
                        </h3>
                        <SimpleChart data={historicalData} />
                        {isExercising && historicalData.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Avg Heart Rate</p>
                                    <p className="text-lg font-semibold text-red-600">
                                        {Math.round(historicalData.reduce((sum, d) => sum + d.heartRate, 0) / historicalData.length)}
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Calories Burned</p>
                                    <p className="text-lg font-semibold text-orange-600">
                                        {Math.round(exerciseDuration * 0.1 * (parseFloat(userProfile.weight) || 70) / 60)}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Avg Hydration</p>
                                    <p className="text-lg font-semibold text-blue-600">
                                        {Math.round(historicalData.reduce((sum, d) => sum + d.hydration, 0) / historicalData.length)}%
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Sweat Loss</p>
                                    <p className="text-lg font-semibold text-purple-600">
                                        {(biometrics.sweatRate * exerciseDuration / 3600).toFixed(1)}L
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Personal Stats */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <User className="mr-2" />
                            Your Personal Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                                <span className="text-gray-600">🔥 Daily Calories:</span>
                                <span className="font-semibold">
                                    {Math.round((userProfile.bmr || 1680) * 1.5)} cal
                                </span>
                            </div>
                            <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                                <span className="text-gray-600">💧 Water Needs:</span>
                                <span className="font-semibold">
                                    {Math.round((parseFloat(userProfile.weight) || 70) * 35)} ml/day
                                </span>
                            </div>
                            <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                                <span className="text-gray-600">🎯 Fitness Goals:</span>
                                <span className="font-semibold text-sm">
                                    {userProfile.fitnessGoals.slice(0, 2).join(', ') || 'General Health'}
                                </span>
                            </div>
                            <div className="flex justify-between p-2 hover:bg-gray-50 rounded">
                                <span className="text-gray-600">📈 Exercise Status:</span>
                                <span className={`font-semibold ${isExercising ? 'text-green-600' : 'text-gray-600'}`}>
                                    {isExercising ? '🏃 Active' : '⏸️ Resting'}
                                </span>
                            </div>
                            {userProfile.medicalConditions.length > 0 && userProfile.medicalConditions[0] !== 'None' && (
                                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                                    <span className="text-gray-600">⚠️ Conditions:</span>
                                    <span className="font-semibold text-sm text-red-600">
                                        {userProfile.medicalConditions.filter(c => c !== 'None').join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes grow {
        from { height: 0; }
        to { height: auto; }
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
    }
    .notification {
        animation: slideIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BioSyncAdvanced />);
