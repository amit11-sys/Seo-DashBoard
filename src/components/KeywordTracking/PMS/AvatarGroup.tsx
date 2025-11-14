import React from "react";
import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";

const UserImage = () => (
  <>
    <Avatar.Group
      max={{
        count: 3,
        style: {
          color: "#f56a00",
          backgroundColor: "#fde3cf",
        },
        // ✅ size for "+N" indicator
        // size: 28,
      }}
    >
      <Avatar
        src="https://api.dicebear.com/7.x/miniavs/svg?seed=2"
        size={28}   // ✅ set size here
      />

      <Avatar
        style={{ backgroundColor: "#f56a00" }}
        size={28}   // ✅ set size here
      >
        K
      </Avatar>

      <Tooltip title="Ant User" placement="top">
        <Avatar
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
          size={28}   // ✅ set size here
        />
      </Tooltip>

      <Avatar
        style={{ backgroundColor: "#1677ff" }}
        icon={<AntDesignOutlined />}
        size={28}   // ✅ set size here
      />
    </Avatar.Group>
  </>
);

export default UserImage;
