import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchJobs, setFilters } from '../store/jobsSlice';
import { openModal, closeModal } from '../store/uiSlice';
import JobTable from '../components/jobs/JobTable';
import JobCard from '../components/jobs/JobCard';
import JobForm from '../components/jobs/JobForm';
import DeleteConfirm from '../components/jobs/DeleteConfirm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { jobs, isLoading, count, filters } = useSelector((state) => state.jobs);
    const { modalOpen, selectedJobId } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);

    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    // Filter jobs based on search and status
    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch =
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.position.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                filters.status === 'all' || job.status === filters.status;
            return matchesSearch && matchesStatus;
        });
    }, [jobs, searchTerm, filters.status]);

    // Get current job for edit/delete
    const currentJob = useMemo(() => {
        return jobs.find((job) => job._id === selectedJobId);
    }, [jobs, selectedJobId]);

    // Stats
    const stats = useMemo(() => ({
        total: jobs.length,
        pending: jobs.filter((j) => j.status === 'pending').length,
        interview: jobs.filter((j) => j.status === 'interview').length,
        declined: jobs.filter((j) => j.status === 'declined').length,
    }), [jobs]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-slate-900 dark:text-white"
                    >
                        Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
                    </motion.h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Track and manage your job applications
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Button
                        onClick={() => dispatch(openModal({ modal: 'addJob' }))}
                        icon={(props) => (
                            <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                    >
                        Add Job
                    </Button>
                </motion.div>
            </div>

            {/* Stats Cards - Clickable to filter */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Jobs', value: stats.total, color: 'from-primary-500 to-accent-500', icon: '📊', status: 'all' },
                    { label: 'Pending', value: stats.pending, color: 'from-amber-500 to-orange-500', icon: '⏳', status: 'pending' },
                    { label: 'Interview', value: stats.interview, color: 'from-blue-500 to-cyan-500', icon: '💼', status: 'interview' },
                    { label: 'Declined', value: stats.declined, color: 'from-red-500 to-rose-500', icon: '❌', status: 'declined' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => dispatch(setFilters({ status: stat.status }))}
                        className={`glass-card p-6 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform ${filters.status === stat.status ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900' : ''
                            }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                    {stat.value}
                                </p>
                            </div>
                            <span className="text-3xl">{stat.icon}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters - Sticky */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 sticky top-4 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg"
            >
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass-input pl-12"
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Status Filter */}
                        <select
                            value={filters.status}
                            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                            className="glass-input flex-1 sm:w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="interview">Interview</option>
                            <option value="declined">Declined</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 ${viewMode === 'table'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                    }`}
                                aria-label="Table view"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                    }`}
                                aria-label="Grid view"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Jobs List */}
            {viewMode === 'table' ? (
                <JobTable jobs={filteredJobs} isLoading={isLoading} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredJobs.map((job, index) => (
                        <JobCard key={job._id} job={job} index={index} />
                    ))}
                    {filteredJobs.length === 0 && !isLoading && (
                        <div className="col-span-full glass-card p-12 text-center">
                            <p className="text-slate-600 dark:text-slate-400">
                                No jobs match your filters
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Results count */}
            {filteredJobs.length > 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    Showing {filteredJobs.length} of {count} jobs
                </p>
            )}

            {/* Add Job Modal */}
            <Modal
                isOpen={modalOpen === 'addJob'}
                onClose={() => dispatch(closeModal())}
                title="Add New Job"
            >
                <JobForm />
            </Modal>

            {/* Edit Job Modal */}
            <Modal
                isOpen={modalOpen === 'editJob'}
                onClose={() => dispatch(closeModal())}
                title="Edit Job"
            >
                {currentJob && <JobForm job={currentJob} />}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={modalOpen === 'deleteJob'}
                onClose={() => dispatch(closeModal())}
                title="Confirm Delete"
                size="sm"
            >
                {currentJob && <DeleteConfirm job={currentJob} />}
            </Modal>
        </div>
    );
};

export default Dashboard;
