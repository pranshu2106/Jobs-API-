import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { openModal } from '../../store/uiSlice';
import StatusBadge from './StatusBadge';
import Card from '../ui/Card';

const JobCard = ({ job, index }) => {
    const dispatch = useDispatch();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="relative overflow-hidden">
                {/* Status accent bar */}
                <div
                    className={`absolute top-0 left-0 right-0 h-1 ${job.status === 'pending'
                        ? 'bg-amber-500'
                        : job.status === 'interview'
                            ? 'bg-blue-500'
                            : 'bg-red-500'
                        }`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-start gap-4">
                            {/* Company Avatar */}
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 dark:from-primary-500/10 dark:to-accent-500/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                    {job.company.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                                    {job.position}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 truncate">
                                    {job.company}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <StatusBadge status={job.status} />
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Applied {formatDate(job.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(openModal({ modal: 'editJob', jobId: job._id }))}
                            className="p-2 rounded-lg text-slate-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            aria-label="Edit job"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => dispatch(openModal({ modal: 'deleteJob', jobId: job._id }))}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label="Delete job"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

JobCard.propTypes = {
    job: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number,
};

export default JobCard;
