import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center mb-3 text-xs lg:text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="mx-1">
              <FaAngleRight className="h-[10px] lg:h-[13px]" />
            </span>
          )}
          {item.path ? (
            <Link
              to={item.path}
              className=" no-underline hover:text-[#18636F] hover:underline text-gray-600 font-light"
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
