function ThemeRoute({ children }) {
    const theme = localStorage.getItem('theme');
    if (!theme) {
        localStorage.setItem('theme', process.env.REACT_APP_THEME);
    }
    window.document.documentElement.classList.add(theme);
    return children;
}

export default ThemeRoute;
