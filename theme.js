const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark");
const localStorageTheme = localStorage.getItem("theme");

const themeToggle = document.querySelector("[data-theme-toggle]");


function detectThemeSetting({localStorageTheme, systemSettingDark}){
    if(localStorageTheme != null){
        return localStorageTheme;
    }
    if(systemSettingDark.matches){
        return "dark";
    }

    return "light";
}

themeToggle.addEventListener("click", ()=> {
    const Theme = currentTheme === "dark" ? "light" : "dark";

    const iconTheme = Theme === "dark" ? "dark_mode" : "light_mode";

    document.querySelector("html").setAttribute("data-theme", Theme);
    document.getElementById("icon").textContent = iconTheme;

    localStorage.setItem("theme" , Theme);
    currentTheme = Theme;
});

let currentTheme = detectThemeSetting({localStorageTheme, systemSettingDark});