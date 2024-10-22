import { FC } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface ActiveListProps {
  name: string;
}

const PersonDetail:FC<ActiveListProps> = ({name}) => {
  const icon = `${name[0] + name[1]}`.toUpperCase();

  return (
    <div
        className="flex items-center space-x-3 my-4"
      >
        <Avatar
          className="bg-slate-500"
        >
          <AvatarFallback
            className="flex justify-center items-center"
          >
            {icon}
          </AvatarFallback>
        </Avatar>
        <h3>{name}</h3>
      </div>
  );
};

export default PersonDetail;