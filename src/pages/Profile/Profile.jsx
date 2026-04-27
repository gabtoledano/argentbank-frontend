import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, updateUserName } from "../../redux/slices/authSlice";
import axios from "axios";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/user/profile",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        dispatch(setUser(response.data.body));
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, dispatch, navigate]);

  const handleEditClick = () => {
    setNewUserName(user.userName);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:3001/api/v1/user/profile",
        { userName: newUserName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(updateUserName(newUserName));
      setIsEditing(false);
    } catch {
      console.error("Erreur lors de la mise à jour du pseudo");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className="main bg-dark">
      <div className="header">
        {isEditing ? (
          <div className="edit-form">
            <h1>Welcome back</h1>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="edit-input"
            />
            <div className="edit-buttons">
              <button className="edit-button" onClick={handleSave}>
                Save
              </button>
              <button className="edit-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1>Welcome back</h1>
            <h1>
              {user.firstName} {user.lastName}!
            </h1>
            <p>{user.userName}</p>
            <button className="edit-button" onClick={handleEditClick}>
              Edit Name
            </button>
          </div>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
}

export default Profile;
