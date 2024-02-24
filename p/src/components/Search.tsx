// Search.tsx
import React, { useState } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search tasks"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="btn btn-primary mt-2" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
