import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchJobs } from '../store/jobsSlice';
import Card from '../components/ui/Card';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { jobs } = useSelector((state) => state.jobs);

    useEffect(() => {
        if (jobs.length === 0) {
            dispatch(fetchJobs());
        }
    }, [dispatch, jobs.length]);

    // Calculate stats
    const stats = useMemo(() => ({
        total: jobs.length,
        pending: jobs.filter((j) => j.status === 'pending').length,
        interview: jobs.filter((j) => j.status === 'interview').length,
        declined: jobs.filter((j) => j.status === 'declined').length,
    }), [jobs]);

    // Calculate percentages
    const percentages = useMemo(() => {
        if (stats.total === 0) return { pending: 0, interview: 0, declined: 0 };
        return {
            pending: Math.round((stats.pending / stats.total) * 100),
            interview: Math.round((stats.interview / stats.total) * 100),
            declined: Math.round((stats.declined / stats.total) * 100),
        };
    }, [stats]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 text-center relative overflow-hidden"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />

                {/* Animated floating orbs */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-primary-500/20 rounded-full blur-2xl animate-pulse-slow" />
                <div className="absolute bottom-4 right-4 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl animate-pulse-slow" />

                <div className="relative">
                    {/* Avatar with glow */}
                    <div className="mx-auto h-28 w-28 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-6 ring-4 ring-white/20 dark:ring-slate-700/30">
                        <span className="text-5xl font-bold text-white">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {user?.name || 'User'}
                    </h1>

                    <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mt-2">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span>ID: {user?.userId?.slice(-8) || 'N/A'}</span>
                    </div>

                    {/* Member badge */}
                    <div className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
                        <svg className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-gradient">Active Member</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Applications',
                        value: stats.total,
                        icon: '📋',
                        gradient: 'from-primary-500 to-accent-500',
                        bgColor: 'bg-primary-500/5 dark:bg-primary-500/10'
                    },
                    {
                        label: 'Pending',
                        value: stats.pending,
                        icon: '⏳',
                        gradient: 'from-amber-500 to-orange-500',
                        bgColor: 'bg-amber-500/5 dark:bg-amber-500/10'
                    },
                    {
                        label: 'Interview',
                        value: stats.interview,
                        icon: '💼',
                        gradient: 'from-blue-500 to-cyan-500',
                        bgColor: 'bg-blue-500/5 dark:bg-blue-500/10'
                    },
                    {
                        label: 'Declined',
                        value: stats.declined,
                        icon: '❌',
                        gradient: 'from-red-500 to-rose-500',
                        bgColor: 'bg-red-500/5 dark:bg-red-500/10'
                    },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`text-center ${stat.bgColor} border-0 hover:scale-105 transition-transform`}>
                            <span className="text-4xl mb-3 block">{stat.icon}</span>
                            <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                {stat.value}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                                {stat.label}
                            </p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Progress Bars Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="overflow-hidden">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
                        Application Progress
                    </h2>

                    {/* Three separate progress bars */}
                    <div className="space-y-8">
                        {/* Pending Progress */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Pending</span>
                                </div>
                                <span className="text-2xl font-bold text-amber-500">{percentages.pending}%</span>
                            </div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentages.pending}%` }}
                                    transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                                </motion.div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                {stats.pending} of {stats.total} applications
                            </p>
                        </div>

                        {/* Interview Progress */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/30" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Interview</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-500">{percentages.interview}%</span>
                            </div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentages.interview}%` }}
                                    transition={{ delay: 0.7, duration: 1.2, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-lg relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                                </motion.div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                {stats.interview} of {stats.total} applications
                            </p>
                        </div>

                        {/* Declined Progress */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-500/30" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Declined</span>
                                </div>
                                <span className="text-2xl font-bold text-red-500">{percentages.declined}%</span>
                            </div>
                            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentages.declined}%` }}
                                    transition={{ delay: 0.9, duration: 1.2, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full shadow-lg relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                                </motion.div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                {stats.declined} of {stats.total} applications
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Quick Summary Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4"
            >
                <div className="glass-card p-5 text-center bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/10">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mx-auto mb-3 shadow-lg shadow-amber-500/50" />
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {percentages.pending}%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Pending</p>
                </div>
                <div className="glass-card p-5 text-center bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/10">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-3 shadow-lg shadow-blue-500/50" />
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {percentages.interview}%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Interview</p>
                </div>
                <div className="glass-card p-5 text-center bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-500/10">
                    <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-3 shadow-lg shadow-red-500/50" />
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {percentages.declined}%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Declined</p>
                </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Card className="bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 border-primary-500/10">
                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/25">
                            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                💡 Pro Tip
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Keep your job applications organized by regularly updating their status.
                                This helps you track your progress and follow up on pending applications!
                            </p>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Profile;
