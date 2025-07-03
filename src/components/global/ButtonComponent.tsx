<<<<<<< Updated upstream
import React from 'react';
import { Button } from '../ui/button';

=======
import React from "react";
import { Button } from "../ui/button";
import { RiLoader2Line } from "react-icons/ri";
>>>>>>> Stashed changes

const ButtonComponent = ({
  Icon,
  children,
  onClick,
  disabled = false,
  loading = false,
}: any) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="bg-[#3B82F6] text-white hover:text-gray-700 flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        Icon && <Icon />
      )}
      {loading ? "Loading..." : children}
    </Button>
  );
};

export default ButtonComponent;
