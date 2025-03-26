import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ 
            padding: '10px', 
            borderBottom: '1px solid #ddd', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
        }}>
            <div>
                <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
                {user && <Link to="/dashboard" style={{ marginRight: '20px' }}>Dashboard</Link>}
                {user && <Link to="/view-scheduled-interviews" style={{ marginRight: '20px' }}>View Interviews</Link>}
            </div>
            <div>
                {user ? (
                    <button 
                        onClick={logout} 
                        style={{
                            backgroundColor: '#d9534f', 
                            color: 'white', 
                            border: 'none', 
                            padding: '5px 10px', 
                            cursor: 'pointer',
                            borderRadius: '5px'
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link 
                            to="/login" 
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#0275d8', 
                                color: 'white', 
                                textDecoration: 'none', 
                                borderRadius: '5px',
                                marginRight: '10px'
                            }}
                        >
                            Login
                        </Link>

                        <Link 
                            to="/register" 
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#5cb85c', 
                                color: 'white', 
                                textDecoration: 'none', 
                                borderRadius: '5px'
                            }}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
