"use client";

import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

interface SearchFormProps {
  initialType?: string;
  initialQuery?: string;
  action?: string;
}

export const SearchForm = ({ 
  initialType = "movies", 
  initialQuery = "", 
  action = "/search" 
}: SearchFormProps) => {
  const [type, setType] = useState(initialType);

  return (
    <form
      action={action}
      className="flex items-center gap-3 flex-wrap flex-grow sm:flex-grow-0"
    >
      <Input 
        as="select" 
        name="type" 
        value={type} 
        onChange={(e) => setType(e.target.value)}
        className="w-auto"
      >
        <option value="movies">Movies</option>
        <option value="shows">TV Shows</option>
      </Input>

      <Input
        name="q"
        type="text"
        defaultValue={initialQuery}
        placeholder={`Search ${type === "shows" ? "TV shows" : "movies"}...`}
        className="sm:w-80"
      />

      <Button type="submit">
        Search
      </Button>
    </form>
  );
};
