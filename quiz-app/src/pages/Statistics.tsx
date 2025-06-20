import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "../auth/AuthContext";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {motion} from "framer-motion";
import api from "../api/axiosInterceptor";

interface RecommendedQuiz {
    id: number;
    title: string;
    category: string;
    difficulty: string;
}

interface UserStats {
    totalQuizzes: number;
    averageScore: number;
    highestScore: number;
    categoryStats: Record<string, number>;
    recommended: RecommendedQuiz[];
}

const COLORS = [
    "#6366F1", // indigo
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // red
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#0EA5E9"  // sky
];

export const Statistics = () => {
    const { token } = useAuth();
    const { t } = useTranslation();
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/stats/summary");
                setStats(res.data);
            } catch (err) {
                console.error("Błąd pobierania statystyk:", err);
            }
        };

        fetchStats();
    }, [token]);

    const categoryData = stats
        ? Object.entries(stats.categoryStats).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-xl font-semibold mb-4">{t('statistics.title')}</h2>

                {!stats ? (
                    <p>{t('statistics.loading')}</p>
                ) : (
                    <div className="form-container">
                        <div className="mb-6">
                            <p><strong>{t('statistics.total')}</strong> {stats.totalQuizzes}</p>
                            <p><strong>{t('statistics.average')}</strong> {stats.averageScore.toFixed(2)}</p>
                            <p><strong>{t('statistics.highest')}</strong> {stats.highestScore}</p>
                        </div>

                        <h3 className="text-lg font-medium mb-2">{t('statistics.byCategory')}</h3>
                        <div className="chart-container">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={130}
                                        cornerRadius={10}
                                        label={({name, percent}) =>
                                            `${name} (${(percent * 100).toFixed(0)}%)`
                                        }
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)"}}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <h3 className="text-lg font-medium mt-6">{t('statistics.recommended')}</h3>
                        <ul className="list-disc pl-5">
                            {stats.recommended.map((quiz) => (
                                <li key={quiz.id}>
                                    <strong>{quiz.title}</strong> ({quiz.category}, {quiz.difficulty})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>
        </DashboardLayout>
    );
};
