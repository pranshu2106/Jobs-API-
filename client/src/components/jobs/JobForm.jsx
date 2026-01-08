import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { createJob, updateJob } from '../../store/jobsSlice';
import { closeModal } from '../../store/uiSlice';
import { formatValidationErrors } from '../../utils/errorParser';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'interview', label: 'Interview' },
    { value: 'declined', label: 'Declined' },
];

const JobForm = ({ job = null, onSuccess }) => {
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.jobs);
    const isEditing = !!job;

    const [formData, setFormData] = useState({
        company: job?.company || '',
        position: job?.position || '',
        status: job?.status || 'pending',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (error) {
            const fieldErrors = formatValidationErrors(error);
            setErrors(fieldErrors);
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company.trim()) {
            newErrors.company = 'Company name is required';
        } else if (formData.company.length > 50) {
            newErrors.company = 'Company name must be less than 50 characters';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (isEditing) {
                await dispatch(updateJob({ jobId: job._id, jobData: formData })).unwrap();
                toast.success('Job updated successfully!');
            } else {
                await dispatch(createJob(formData)).unwrap();
                toast.success('Job created successfully!');
            }
            dispatch(closeModal());
            onSuccess?.();
        } catch (err) {
            toast.error(err || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                error={errors.company}
                required
            />

            <Input
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter job position"
                error={errors.position}
                required
            />

            <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                error={errors.status}
            />

            <div className="flex gap-4 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => dispatch(closeModal())}
                    fullWidth
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    fullWidth
                >
                    {isEditing ? 'Update Job' : 'Add Job'}
                </Button>
            </div>
        </form>
    );
};

JobForm.propTypes = {
    job: PropTypes.shape({
        _id: PropTypes.string,
        company: PropTypes.string,
        position: PropTypes.string,
        status: PropTypes.string,
    }),
    onSuccess: PropTypes.func,
};

export default JobForm;
