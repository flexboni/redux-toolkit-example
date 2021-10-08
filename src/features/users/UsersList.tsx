import { useDispatch, useSelector } from "react-redux";
import { selectTotalUsers, selectAllUsers } from "./usersSlice";
import { updateUser } from "../articles/articlesSlice";

import styles from "./UsersList.module.css";

export const UsersList = () => {
  const count = useSelector(selectTotalUsers);
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  const handleUpdateUser = async (userData) => {
    const resultAction = await dispatch(updateUser(userData));
    if (updateUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload;
      showToast("success", `Updated ${user.name}`);
    } else {
      if (resultAction.payload) {
        // Since we passed in `MyKnownError` to `rejectValue` in `updateUser`, the type information will be available here.
        // Note: this would also be a good place to do any handling that relies on the `rejectedWithValue` payload, such as setting field errors
        showToast(
          "error",
          `Update failed: ${resultAction.payload.errorMessage}`
        );
      } else {
        showToast("error", `Update failed: ${resultAction.error.message}`);
      }
    }
  };

  return (
    <div>
      <div className={styles.row}>
        There are <span className={styles.value}>{count}</span> users.{" "}
        {count === 0 && `Why don't you fetch some more?`}
      </div>
      {users.map((user) => (
        <div key={user.id}>
          <div>{`${user.first_name} ${user.last_name}`}</div>
        </div>
      ))}
    </div>
  );
};
