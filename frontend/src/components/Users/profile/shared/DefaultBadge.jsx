import React from 'react';
import { Chip } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const DefaultBadge = () => {
  return (
    <Chip
      icon={
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
      }
      value="Default"
      variant="ghost"
      color="green"
      size="sm"
    />
  );
};

export default DefaultBadge;