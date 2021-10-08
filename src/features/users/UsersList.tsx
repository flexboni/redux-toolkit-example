import { useDispatch, useSelector } from "react-redux";
import { selectTotalUsers, selectAllUsers } from "./usersSlice";
import { updateUser } from "../articles/articlesSlice";

import styles from "./UsersList.module.css";

export const UsersList = () => {
  const count = useSelector(selectTotalUsers);
  const users = useSelector(selectAllUsers);

  // memoization(이하 메모이제이션), 즉 이전에 계산한 값을 메모리에 저장하여
  // 값이 변경됐을 경우에만 계산하도록 동작하는 것 개선하는 법
  // 하지만 성능 문제가 있을 수 있음. => createSelector 를 사용하면 된다.
  // const users = useSelector(
  //   (state) => state.users.filter(user => user.subscribed)
  // );

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
