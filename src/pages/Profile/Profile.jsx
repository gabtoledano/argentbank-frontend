import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserName } from "../../redux/slices/authSlice";
import Account from "../../components/Account/Account";

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
    dispatch(fetchUserProfile(token));
  }, [token, dispatch, navigate]);

  const handleEditClick = () => {
    setNewUserName(user.userName);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const result = await dispatch(
      updateUserName({ token, userName: newUserName }),
    );
    if (updateUserName.fulfilled.match(result)) {
      setIsEditing(false);
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
      <Account
        title="Argent Bank Checking (x8349)"
        amount="$2,082.79"
        description="Available Balance"
      />
      <Account
        title="Argent Bank Savings (x6712)"
        amount="$10,928.42"
        description="Available Balance"
      />
      <Account
        title="Argent Bank Credit Card (x8349)"
        amount="$184.30"
        description="Current Balance"
      />
    </main>
  );
}

export default Profile;
