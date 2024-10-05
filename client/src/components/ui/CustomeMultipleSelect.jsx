import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "./input";
import { MdCancel } from "react-icons/md";
import {
  IoSearchCircle,
  IoSearchCircleSharp,
  IoSearchSharp,
} from "react-icons/io5";

const CustomMultiSelector = ({ allContacts, onContactsChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    onContactsChange(selectedItems);
  }, [selectedItems, onContactsChange]);

  const handleAddItem = (e, contact) => {
    e.preventDefault();
    if (contact && !selectedItems.includes(contact.value)) {
      setSelectedItems([...selectedItems, contact.value]); // Store value for selected items
      setInputValue(""); // Clear the input field
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  // Filter contacts based on the input value using the label property
  const filteredContacts = allContacts.filter(
    (contact) =>
      contact.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedItems.includes(contact.value)
  );

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={(e) => handleAddItem(e)} className="flex mb-2">
        {/* <IoSearchSharp /> */}
        {/* <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            placeholder="Search for contacts..."
          /> */}
        <div className="flex items-center w-full">
          <IoSearchSharp className="text-gray-500 mr-2 absolute right-7" />{" "}
          {/* Search Icon */}
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-lg p-6 bg-[#2c2e3b] border-none flex-grow"
            placeholder="Search for contacts..."
          />
        </div>
        {/* <button
            type="submit"
            className="bg-blue-500 text-white rounded-r px-4 py-2"
          >
            Add
          </button> */}
      </form>

      <div className="flex flex-wrap">
        {selectedItems.map((item) => {
          const contact = allContacts.find((c) => c.value === item);
          const name = contact ? contact.label.split(" - ")[0] : item; // Find the contact by value
          return (
            <div
              key={item}
              className="flex items-center bg-purple-700 text-white/80 rounded-full px-2 py-1 mr-2 mb-2"
            >
              <span
                className=" font-semibold uppercase"
                style={{ fontSize: "11px" }}
              >
                {/* {contact ? contact.label : item} */}
                {name}
              </span>{" "}
              {/* Display the label */}
              <button
                onClick={() => handleRemoveItem(item)}
                className="ml-2 text-red-500 hover:text-red-200"
              >
                {/* &times; */}
                <MdCancel />
              </button>
            </div>
          );
        })}
      </div>

      <div>
        {filteredContacts.length === 0 ? (
          <p className="text-center text-lg leading-10 text-gray-600">
            No results found
          </p>
        ) : (
          <ul
            className="list-none rounded-lg bg-[#2d2c2e] border-none mb-2 p-2 text-white/60 hover:bg-[#212022] uppercase h-[150px] scrollbar-hidden overflow-y-auto"
            style={{ fontSize: "12px" }}
          >
            {filteredContacts.map((contact) => (
              <li
                key={contact.value}
                onClick={(e) => handleAddItem(e, contact)}
                className="cursor-pointer p-1 hover:text-white"
              >
                {contact.label} {/* Display the label */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default CustomMultiSelector;
