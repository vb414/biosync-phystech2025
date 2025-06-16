<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BioSync - Personalized Nutrition Optimization</title>
    <script crossorigin src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone@7.22.5/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
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
            const [currentStep, setCurrentStep] = useState('welcome'); // welcome, profile, medical, dashboard
            const [isExercising, setIsExercising] = useState(false);
            const [exerciseType, setExerciseType] = useState('running');
            const [exerciseDuration, setExerciseDuration] = useState(0);
            
            // User profile with more comprehensive data
            const [userProfile, setUserProfile] = useState({
                name: '',
                age: '',
                gender: '',
                weight: '',
                height: '',
                activityLevel: '',
                fitnessGoals: [],
                medicalConditions: [],
                medications: [],
                dietaryRestrictions: [],
                // Medical report data
                bloodWork: {
                    glucose: null,
                    cholesterol: null,
                    hemoglobin: null,
                    vitamins: {},
                    minerals: {}
                },
                // Calculated fields
                bmi: null,
                bmr: null,
                maxHeartRate: null
            });

            // Medical report analysis
            const [medicalReport, setMedicalReport] = useState(null);
            const [reportAnalysis, setReportAnalysis] = useState(null);

            // Biometrics - now personalized based on user data
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

            // Calculate BMI and BMR when profile changes
            useEffect(() => {
                if (userProfile.weight && userProfile.height) {
                    const heightInMeters = userProfile.height / 100;
                    const bmi = userProfile.weight / (heightInMeters * heightInMeters);
                    
                    // Calculate BMR using Mifflin-St Jeor equation
                    let bmr;
                    if (userProfile.gender === 'male') {
                        bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
                    } else {
                        bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
                    }
                    
                    const maxHR = 220 - parseInt(userProfile.age);
                    
                    setUserProfile(prev => ({
                        ...prev,
                        bmi: bmi.toFixed(1),
                        bmr: Math.round(bmr),
                        maxHeartRate: maxHR
                    }));
                }
            }, [userProfile.weight, userProfile.height, userProfile.age, userProfile.gender]);

            // Exercise effect
            useEffect(() => {
                if (isExercising) {
                    intervalRef.current = setInterval(() => {
                        setExerciseDuration(prev => prev + 1);
                        updateBiometrics();
                        generatePersonalizedRecommendations();
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

                    // Personalized calculations based on user profile
                    const baseHR = userProfile.gender === 'male' ? 70 : 75;
                    const maxHR = userProfile.maxHeartRate || (220 - (userProfile.age || 30));
                    const targetHR = Math.min(baseHR + (exerciseDuration * intensityMultiplier), maxHR * 0.85);
                    const newHR = prev.heartRate + (targetHR - prev.heartRate) * 0.1;

                    const hrPercentage = ((newHR - baseHR) / (maxHR - baseHR)) * 100;
                    let zone = 'rest';
                    if (hrPercentage > 80) zone = 'peak';
                    else if (hrPercentage > 70) zone = 'cardio';
                    else if (hrPercentage > 60) zone = 'aerobic';
                    else if (hrPercentage > 50) zone = 'fat-burn';
                    else if (hrPercentage > 0) zone = 'warm-up';

                    // Adjust sweat rate based on body composition
                    const bodyWeightFactor = (userProfile.weight || 70) / 70;
                    const intensityFactor = hrPercentage / 100;
                    const newSweatRate = 0.5 * intensityFactor * bodyWeightFactor;
                    
                    const newCoreTemp = Math.min(prev.coreTemp + intensityFactor * 0.02, 39.5);
                    const fluidLoss = newSweatRate / 3600;
                    const newHydration = Math.max(prev.hydrationLevel - fluidLoss * 2, 0);
                    
                    // Adjust glycogen depletion based on fitness level
                    const fitnessMultiplier = userProfile.activityLevel === 'athlete' ? 0.7 : 1.0;
                    const newGlycogen = Math.max(prev.glycogenStores - (intensityFactor * 0.05 * fitnessMultiplier), 0);
                    const newFatigue = Math.min(prev.fatigue + (intensityFactor * 0.03 * fitnessMultiplier), 100);

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

            const generatePersonalizedRecommendations = () => {
                const recs = [];

                // Hydration recommendations adjusted for body weight
                if (biometrics.hydrationLevel < 85) {
                    const waterNeeded = Math.round((100 - biometrics.hydrationLevel) * (userProfile.weight || 70) * 0.01 * 1000);
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

                // Personalized based on medical data
                if (reportAnalysis && reportAnalysis.lowElectrolytes) {
                    recs.push({
                        id: Date.now() + 2,
                        type: 'electrolyte',
                        title: 'Electrolyte Attention',
                        message: 'Your medical report shows low baseline electrolytes. Consider electrolyte drink.',
                        icon: Zap,
                        color: 'text-yellow-500',
                        bgColor: 'bg-yellow-50'
                    });
                }

                // Special recommendations for medical conditions
                if (userProfile.medicalConditions.includes('Diabetes') && biometrics.glycogenStores < 40) {
                    recs.push({
                        id: Date.now() + 3,
                        type: 'glucose',
                        title: 'Blood Sugar Alert',
                        message: 'Monitor blood glucose. Consider 15g quick carbs.',
                        icon: AlertCircle,
                        color: 'text-red-500',
                        bgColor: 'bg-red-50'
                    });
                }

                if (biometrics.coreTemp > 38.5) {
                    recs.push({
                        id: Date.now() + 4,
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

            const handleProfileSubmit = (e) => {
                e.preventDefault();
                // Validate required fields
                if (userProfile.name && userProfile.age && userProfile.gender && userProfile.weight && userProfile.height) {
                    setCurrentStep('medical');
                }
            };

            const handleMedicalReportUpload = (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Simulate medical report analysis
                    setMedicalReport(file);
                    
                    // Simulate extracting data from report
                    setTimeout(() => {
                        const simulatedAnalysis = {
                            glucose: Math.random() > 0.7 ? 'normal' : 'low',
                            cholesterol: Math.random() > 0.6 ? 'normal' : 'high',
                            hemoglobin: Math.random() > 0.8 ? 'normal' : 'low',
                            vitamins: {
                                d: Math.random() > 0.5 ? 'normal' : 'low',
                                b12: Math.random() > 0.7 ? 'normal' : 'low'
                            },
                            minerals: {
                                iron: Math.random() > 0.6 ? 'normal' : 'low',
                                magnesium: Math.random() > 0.7 ? 'normal' : 'low'
                            },
                            lowElectrolytes: Math.random() > 0.7,
                            recommendations: []
                        };

                        // Generate recommendations based on analysis
                        if (simulatedAnalysis.glucose === 'low') {
                            simulatedAnalysis.recommendations.push('Monitor blood sugar during exercise');
                        }
                        if (simulatedAnalysis.vitamins.d === 'low') {
                            simulatedAnalysis.recommendations.push('Consider vitamin D supplementation');
                        }
                        if (simulatedAnalysis.minerals.iron === 'low') {
                            simulatedAnalysis.recommendations.push('May experience faster fatigue - monitor energy levels');
                        }

                        setReportAnalysis(simulatedAnalysis);
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

            // Welcome Screen
            if (currentStep === 'welcome') {
                return (
                    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-4 border border-white/20">
                            <Brain className="text-6xl mx-auto mb-6 block" />
                            <h1 className="text-4xl font-bold text-white mb-4 text-center">Welcome to BioSync</h1>
                            <p className="text-white/80 text-lg mb-8 text-center">
                                Let's personalize your nutrition optimization experience. We'll need some information about you to provide the most accurate recommendations.
                            </p>
                            <div className="flex items-center justify-center space-x-4 mb-8">
                                <Shield className="text-3xl" />
                                <p className="text-white/70 text-sm">Your data is secure and never shared</p>
                            </div>
                            <button
                                onClick={() => setCurrentStep('profile')}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-600"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                );
            }

            // Profile Setup Screen
            if (currentStep === 'profile') {
                return (
                    <div className="min-h-screen bg-gray-50 py-8">
                        <div className="max-w-2xl mx-auto px-4">
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Personal Profile</h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                value={userProfile.name}
                                                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
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
                                            />
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    required
                                                    className="mr-2"
                                                    checked={userProfile.gender === 'male'}
                                                    onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                                                />
                                                Male
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    required
                                                    className="mr-2"
                                                    checked={userProfile.gender === 'female'}
                                                    onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                                                />
                                                Female
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="other"
                                                    required
                                                    className="mr-2"
                                                    checked={userProfile.gender === 'other'}
                                                    onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                                                />
                                                Other
                                            </label>
                                        </div>
                                    </div>

                                    {/* Physical Measurements */}
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
                                            />
                                        </div>
                                    </div>

                                    {/* Activity Level */}
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

                                    {/* Fitness Goals */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goals (select all that apply)</label>
                                        <div className="space-y-2">
                                            {['Weight Loss', 'Muscle Gain', 'Endurance', 'General Health', 'Performance'].map(goal => (
                                                <label key={goal} className="flex items-center">
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

                                    {/* Medical Conditions */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions (select all that apply)</label>
                                        <div className="space-y-2">
                                            {['None', 'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid Issues'].map(condition => (
                                                <label key={condition} className="flex items-center">
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

                                    {/* Calculated Values Display */}
                                    {userProfile.bmi && (
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-gray-800 mb-2">Your Calculated Metrics:</h3>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">BMI:</span>
                                                    <span className="font-semibold ml-2">{userProfile.bmi}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">BMR:</span>
                                                    <span className="font-semibold ml-2">{userProfile.bmr} cal/day</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Max HR:</span>
                                                    <span className="font-semibold ml-2">{userProfile.maxHeartRate} bpm</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600"
                                    >
                                        Continue to Medical Information
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            }

            // Medical Report Upload Screen
            if (currentStep === 'medical') {
                return (
                    <div className="min-h-screen bg-gray-50 py-8">
                        <div className="max-w-2xl mx-auto px-4">
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Medical Information</h2>
                                <p className="text-gray-600 mb-8">
                                    Upload your recent medical report for personalized nutrition recommendations. This is optional but helps us provide more accurate guidance.
                                </p>

                                {/* Upload Section */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
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
                                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
                                    >
                                        Choose File
                                    </label>
                                </div>

                                {/* Upload Status */}
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

                               {/* Analysis Results */}
                               {reportAnalysis && (
                                   <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                       <h3 className="font-semibold text-lg mb-4">Medical Report Analysis</h3>
                                       <div className="space-y-3">
                                           <div className="grid grid-cols-2 gap-4">
                                               <div className="flex items-center justify-between bg-white p-3 rounded">
                                                   <span>Glucose:</span>
                                                   <span className={`font-semibold ${reportAnalysis.glucose === 'normal' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                       {reportAnalysis.glucose}
                                                   </span>
                                               </div>
                                               <div className="flex items-center justify-between bg-white p-3 rounded">
                                                   <span>Cholesterol:</span>
                                                   <span className={`font-semibold ${reportAnalysis.cholesterol === 'normal' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                       {reportAnalysis.cholesterol}
                                                   </span>
                                               </div>
                                               <div className="flex items-center justify-between bg-white p-3 rounded">
                                                   <span>Hemoglobin:</span>
                                                   <span className={`font-semibold ${reportAnalysis.hemoglobin === 'normal' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                       {reportAnalysis.hemoglobin}
                                                   </span>
                                               </div>
                                               <div className="flex items-center justify-between bg-white p-3 rounded">
                                                   <span>Vitamin D:</span>
                                                   <span className={`font-semibold ${reportAnalysis.vitamins.d === 'normal' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                       {reportAnalysis.vitamins.d}
                                                   </span>
                                               </div>
                                           </div>
                                           
                                           {reportAnalysis.recommendations.length > 0 && (
                                               <div className="mt-4">
                                                   <h4 className="font-semibold mb-2">Personalized Recommendations:</h4>
                                                   <ul className="list-disc list-inside space-y-1">
                                                       {reportAnalysis.recommendations.map((rec, i) => (
                                                           <li key={i} className="text-sm text-gray-700">{rec}</li>
                                                       ))}
                                                   </ul>
                                               </div>
                                           )}
                                       </div>
                                   </div>
                               )}

                               {/* Privacy Notice */}
                               <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                   <div className="flex items-start">
                                       <Shield className="text-2xl mr-3 mt-1" />
                                       <div>
                                           <h4 className="font-semibold mb-1">Your Privacy Matters</h4>
                                           <p className="text-sm text-gray-600">
                                               Your medical data is processed locally and never stored on our servers. 
                                               All analysis is done in real-time and data is deleted after your session.
                                           </p>
                                       </div>
                                   </div>
                               </div>

                               <div className="flex space-x-4">
                                   <button
                                       onClick={() => setCurrentStep('profile')}
                                       className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300"
                                   >
                                       Back
                                   </button>
                                   <button
                                       onClick={() => setCurrentStep('dashboard')}
                                       className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600"
                                   >
                                       {medicalReport ? 'Start BioSync' : 'Skip & Continue'}
                                   </button>
                               </div>
                           </div>
                       </div>
                   </div>
               );
           }

           // Main Dashboard
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
                                       <p className="text-sm text-gray-600">Welcome, {userProfile.name || 'User'}</p>
                                   </div>
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

                   {/* User Stats Bar */}
                   <div className="bg-blue-50 border-b px-4 py-3">
                       <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
                           <div className="flex items-center space-x-6">
                               <span><strong>Age:</strong> {userProfile.age}</span>
                               <span><strong>BMI:</strong> {userProfile.bmi}</span>
                               <span><strong>Activity:</strong> {userProfile.activityLevel}</span>
                               <span><strong>Max HR:</strong> {userProfile.maxHeartRate} bpm</span>
                               {userProfile.medicalConditions.length > 0 && userProfile.medicalConditions[0] !== 'None' && (
                                   <span className="text-red-600">
                                       <strong>Conditions:</strong> {userProfile.medicalConditions.join(', ')}
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
                               <div className="bg-red-50 rounded-xl p-4">
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
                               <div className="bg-blue-50 rounded-xl p-4">
                                   <Droplets className="text-2xl mb-2" />
                                   <div className="text-2xl font-bold">{Math.round(biometrics.hydrationLevel)}%</div>
                                   <div className="text-sm text-gray-600">Hydration</div>
                                   {reportAnalysis?.lowElectrolytes && (
                                       <div className="text-xs text-yellow-600 mt-1">Monitor closely</div>
                                   )}
                               </div>
                               <div className="bg-yellow-50 rounded-xl p-4">
                                   <Zap className="text-2xl mb-2" />
                                   <div className="text-2xl font-bold">{Math.round(biometrics.glycogenStores)}%</div>
                                   <div className="text-sm text-gray-600">Glycogen</div>
                                   {userProfile.medicalConditions.includes('Diabetes') && (
                                       <div className="text-xs text-red-600 mt-1">Monitor glucose</div>
                                   )}
                               </div>
                               <div className="bg-orange-50 rounded-xl p-4">
                                   <Thermometer className="text-2xl mb-2" />
                                   <div className="text-2xl font-bold">{biometrics.coreTemp.toFixed(1)}°C</div>
                                   <div className="text-sm text-gray-600">Core Temp</div>
                               </div>
                           </div>

                           {/* Personalized Recommendations */}
                           <div className="bg-white rounded-xl shadow-lg p-6">
                               <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
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
                                   <p className="text-gray-500">Start exercising to receive personalized recommendations</p>
                               )}
                               
                               {/* Medical-based recommendations */}
                               {reportAnalysis && reportAnalysis.recommendations.length > 0 && (
                                   <div className="mt-4 pt-4 border-t">
                                       <h4 className="font-semibold text-sm mb-2">Based on your medical report:</h4>
                                       <ul className="text-sm text-gray-600 space-y-1">
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

                           {/* Chart */}
                           <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                               <h3 className="text-lg font-semibold mb-4">Performance Tracking</h3>
                               <SimpleChart data={historicalData} />
                           </div>

                           {/* Personalized Stats */}
                           <div className="bg-white rounded-xl shadow-lg p-6">
                               <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
                               <div className="space-y-3">
                                   <div className="flex justify-between">
                                       <span className="text-gray-600">Daily Calorie Needs:</span>
                                       <span className="font-semibold">
                                           {Math.round((userProfile.bmr || 1500) * (userProfile.activityLevel === 'sedentary' ? 1.2 : userProfile.activityLevel === 'athlete' ? 1.9 : 1.5))} cal
                                       </span>
                                   </div>
                                   <div className="flex justify-between">
                                       <span className="text-gray-600">Water Needs:</span>
                                       <span className="font-semibold">
                                           {Math.round((userProfile.weight || 70) * 35)} ml/day
                                       </span>
                                   </div>
                                   <div className="flex justify-between">
                                       <span className="text-gray-600">Fitness Level:</span>
                                       <span className="font-semibold capitalize">{userProfile.activityLevel || 'moderate'}</span>
                                   </div>
                                   <div className="flex justify-between">
                                       <span className="text-gray-600">Goals:</span>
                                       <span className="font-semibold text-sm">{userProfile.fitnessGoals.join(', ') || 'General Health'}</span>
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
   </script>
</body>
</html>
