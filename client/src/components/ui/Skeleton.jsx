import PropTypes from 'prop-types';

const Skeleton = ({ variant = 'text', width, height, className = '' }) => {
    const variants = {
        text: 'h-4 w-full',
        title: 'h-6 w-3/4',
        avatar: 'h-12 w-12 rounded-full',
        thumbnail: 'h-24 w-24 rounded-lg',
        card: 'h-32 w-full rounded-xl',
        button: 'h-10 w-24 rounded-lg',
        table: 'h-12 w-full',
    };

    const baseStyles = variants[variant] || variants.text;
    const customStyles = {
        width: width || undefined,
        height: height || undefined,
    };

    return (
        <div
            className={`skeleton ${baseStyles} ${className}`}
            style={customStyles}
            aria-hidden="true"
        />
    );
};

Skeleton.propTypes = {
    variant: PropTypes.oneOf(['text', 'title', 'avatar', 'thumbnail', 'card', 'button', 'table']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
};

// Skeleton group for common patterns
export const SkeletonCard = () => (
    <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-4">
            <Skeleton variant="avatar" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="title" />
                <Skeleton variant="text" width="60%" />
            </div>
        </div>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
    </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
    <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} variant="table" />
        ))}
    </div>
);

SkeletonTable.propTypes = {
    rows: PropTypes.number,
};

export default Skeleton;
