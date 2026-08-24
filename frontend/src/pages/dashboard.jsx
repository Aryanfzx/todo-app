import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            setError('');
            const res = await apiClient.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to fetch tasks'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();

        try {
            setError('');

            const res = await apiClient.post('/tasks', {
                title,
                description,
                dueDate,
            });

            setTasks((current) => [...current, res.data]);

            setTitle('');
            setDescription('');
            setDueDate('');
            setShowModal(false);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to create task'
            );
        }
    };

    const handleToggleComplete = async (id, isCompleted) => {
        try {
            setError('');

            const res = await apiClient.put(`/tasks/${id}`, {
                isCompleted: !isCompleted,
            });

            setTasks((current) =>
                current.map((task) =>
                    task._id === id ? res.data : task
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to update task status'
            );
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            setError('');

            await apiClient.delete(`/tasks/${id}`);

            setTasks((current) =>
                current.filter((task) => task._id !== id)
            );
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to delete task'
            );
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
        (task) => task.isCompleted
    ).length;
    const pendingTasks = totalTasks - completedTasks;

    const filteredTasks = tasks.filter((task) => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'pending' && !task.isCompleted) ||
            (filter === 'completed' && task.isCompleted);

        const searchText = search.toLowerCase();

        const matchesSearch =
            task.title?.toLowerCase().includes(searchText) ||
            task.description?.toLowerCase().includes(searchText);

        return matchesFilter && matchesSearch;
    });

    const formatDate = (date) => {
        if (!date) return 'No date';

        return new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getInitials = () => {
        const token = localStorage.getItem('token');

        if (!token) return 'U';

        return 'U';
    };

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-mark">✓</div>
                    <span>TaskFlow</span>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => setFilter('all')}
                    >
                        <span>☷</span>
                        All Tasks
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => setFilter('completed')}
                    >
                        <span>✓</span>
                        Completed
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => setFilter('pending')}
                    >
                        <span>◷</span>
                        Pending
                    </button>
                </nav>

                <div className="sidebar-bottom">
                    <div className="user-card">
                        <div className="avatar">
                            {getInitials()}
                        </div>

                        <div className="user-info">
                            <strong>My Account</strong>
                            <span>Personal workspace</span>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <p className="eyebrow">WORKSPACE</p>
                        <h1>Dashboard</h1>
                    </div>

                    <button
                        className="primary-button"
                        onClick={() => setShowModal(true)}
                    >
                        <span>+</span>
                        New Task
                    </button>
                </header>

                {error && (
                    <div className="error-banner">
                        <span>!</span>
                        {error}
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}

                <section className="welcome-section">
                    <div>
                        <h2>Good to see you.</h2>
                        <p>
                            Stay organized and keep moving forward.
                        </p>
                    </div>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">◉</div>
                        <div>
                            <span>Total Tasks</span>
                            <strong>{totalTasks}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon pending-icon">◷</div>
                        <div>
                            <span>Pending</span>
                            <strong>{pendingTasks}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon completed-icon">✓</div>
                        <div>
                            <span>Completed</span>
                            <strong>{completedTasks}</strong>
                        </div>
                    </div>
                </section>

                <section className="tasks-section">
                    <div className="section-header">
                        <div>
                            <h2>Your Tasks</h2>
                            <p>
                                {filteredTasks.length} task
                                {filteredTasks.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="task-controls">
                            <div className="search-box">
                                <span>⌕</span>
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </div>

                            <select
                                value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value)
                                }
                                className="filter-select"
                            >
                                <option value="all">All</option>
                                <option value="pending">
                                    Pending
                                </option>
                                <option value="completed">
                                    Completed
                                </option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <div className="loading-spinner"></div>
                            <p>Loading your tasks...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">✓</div>
                            <h3>
                                {search
                                    ? 'No tasks found'
                                    : 'Nothing here yet'}
                            </h3>
                            <p>
                                {search
                                    ? 'Try a different search.'
                                    : 'Create your first task and get things moving.'}
                            </p>

                            {!search && (
                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        setShowModal(true)
                                    }
                                >
                                    + Create your first task
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="task-list">
                            {filteredTasks.map((task) => (
                                <article
                                    className={`task-card ${
                                        task.isCompleted
                                            ? 'completed'
                                            : ''
                                    }`}
                                    key={task._id}
                                >
                                    <button
                                        className={`task-check ${
                                            task.isCompleted
                                                ? 'checked'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleToggleComplete(
                                                task._id,
                                                task.isCompleted
                                            )
                                        }
                                        aria-label={
                                            task.isCompleted
                                                ? 'Mark as pending'
                                                : 'Mark as completed'
                                        }
                                    >
                                        {task.isCompleted && '✓'}
                                    </button>

                                    <div className="task-body">
                                        <div className="task-title-row">
                                            <h3>{task.title}</h3>

                                            <span
                                                className={`status-badge ${
                                                    task.isCompleted
                                                        ? 'done'
                                                        : 'pending'
                                                }`}
                                            >
                                                {task.isCompleted
                                                    ? 'Completed'
                                                    : 'Pending'}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p>
                                                {task.description}
                                            </p>
                                        )}

                                        <div className="task-meta">
                                            <span>
                                                ◷ Due{' '}
                                                {formatDate(
                                                    task.dueDate
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDeleteTask(
                                                task._id
                                            )
                                        }
                                        title="Delete task"
                                    >
                                        ×
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {showModal && (
                <div
                    className="modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="modal">
                        <div className="modal-header">
                            <div>
                                <p className="eyebrow">NEW TASK</p>
                                <h2>Create a task</h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask}>
                            <label>
                                Task title
                                <input
                                    type="text"
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    required
                                    autoFocus
                                />
                            </label>

                            <label>
                                Description
                                <textarea
                                    placeholder="Add some details..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    required
                                    rows="4"
                                />
                            </label>

                            <label>
                                Due date
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) =>
                                        setDueDate(e.target.value)
                                    }
                                    required
                                />
                            </label>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}