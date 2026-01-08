import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { deleteJob } from '../../store/jobsSlice';
import { closeModal } from '../../store/uiSlice';
import Button from '../ui/Button';

const DeleteConfirm = ({ job }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.jobs);

    const handleDelete = async () => {
        try {
            await dispatch(deleteJob(job._id)).unwrap();
            toast.success('Job deleted successfully!');
            dispatch(closeModal());
        } catch (err) {
            toast.error(err || 'Failed to delete job');
        }
    };

    return (
        <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Delete Job?
            </h3>

            <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete the <strong className="text-slate-900 dark:text-white">{job?.position}</strong> position at <strong className="text-slate-900 dark:text-white">{job?.company}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => dispatch(closeModal())}
                    fullWidth
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    isLoading={isLoading}
                    fullWidth
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};

DeleteConfirm.propTypes = {
    job: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
    }).isRequired,
};

export default DeleteConfirm;
