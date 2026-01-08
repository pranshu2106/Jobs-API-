import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const Card = ({
    children,
    className = '',
    hover = true,
    padding = 'md',
    onClick,
    ...props
}) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <motion.div
            whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
            onClick={onClick}
            className={`
        glass-card
        ${paddings[padding]}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hover: PropTypes.bool,
    padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
    onClick: PropTypes.func,
};

export default Card;
