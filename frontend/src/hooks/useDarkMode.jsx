import { useState, useEffect} from "react";

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const html = window.document.documentElement;
    html.classList.remove(!isDarkMode ? 'dark' : 'light')
    html.classList.add(isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  },[isDarkMode])

  const toggleDarkMode = () =>{
    setIsDarkMode(!isDarkMode);
  }

  return [isDarkMode, toggleDarkMode];
}

export default useDarkMode;
