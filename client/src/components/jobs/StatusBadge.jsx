import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            className: 'badge-pending',
            label: 'Pending',
            icon: (
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
            ),
        },
        interview: {
            className: 'badge-interviewed',
            label: 'Interview',
            icon: (
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            ),
        },
        declined: {
            className: 'badge-declined',
            label: 'Declined',
            icon: (
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            ),
        },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`badge ${config.className} inline-flex items-center gap-1`}>
            {config.icon}
            {config.label}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.oneOf(['pending', 'interview', 'declined']).isRequired,
};

export default StatusBadge;
