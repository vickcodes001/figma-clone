// import { useSelf } from "@liveblocks/react";
// import { useOthers } from "@liveblocks/react";
import { Avatar } from "./Avatar";
import styles from "./index.module.css";
import { generateRandomName } from "@/lib/utils";
import { useMemo } from "react";

const ActiveUsers = ({ users = [], currentUser = null }) => {
    const hasMoreUsers = users.length > 3

    // const users = useOthers();
    // const currentUser = useSelf();
    // const hasMoreUsers = users.length > 3;
  
    const memorizedUsers = useMemo(() => {
      return (
        <div className="flex items-center justify-center gap-1 py-2">
        <div className="flex pl-3">
          {/* check for current user */}
          {currentUser && (
              <Avatar name="You" otherStyles="border-[3px] border-primary-green" />
          )}
          {/* we check for other users */}
          {users.slice(0, 3).map(({ connectionId }) => {
            return (
              <Avatar key={connectionId} name={generateRandomName()} otherStyles="-ml-3" />
            );
          })}
  
          {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
        </div>
      </div>
      )
    }, [users.length])

    return memorizedUsers;
  }

export default ActiveUsers;