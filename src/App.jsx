import "bulma-o-steps/bulma-steps.min.css";
import "./styles/App.css";
import Router from "./utils/router";
import React, { useState, useEffect } from "react";
import { useApplication } from "./utils/hooks/Application";

function App() {
  const [themePath, setThemePath] = useState(false);
  const [applicationSettings, setApplicationSettings] = useState(false);

  const { getApplication, responseGetApplication } = useApplication();

  useEffect(() => {
    if (themePath) {
      var head = document.head;
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = themePath;
      head.appendChild(link);
      return () => {
        head.removeChild(link);
      };
    } else {
      var head = document.head;
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = "/themes/origin.css";
      head.appendChild(link);
      return () => {
        head.removeChild(link);
      };
    }
  }, [themePath]);

  useEffect(() => {
    if (
      applicationSettings &&
      applicationSettings.global &&
      applicationSettings.global.title[0]
    ) {
      const settings = applicationSettings.global;
      if (settings.themePath) setThemePath(settings.themePath);
      if (settings.favicon) {
        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = settings.favicon;
      }
      const root = document.documentElement;
      if (settings.fontSerif)
        root?.style.setProperty("--serif", settings.fontSerif);
      if (settings.fontSansSerif)
        root?.style.setProperty("--sans-serif", settings.fontSansSerif);
      if (settings.primary)
        root?.style.setProperty("--primary", settings.primary);
      if (settings.secondary)
        root?.style.setProperty("--secondary", settings.secondary);
      if (settings.metaTagValue)
        document
          .querySelector('meta[name="description"]')
          .setAttribute("content", settings.metaTagValue);
      if (settings.htmlTitle) {
        document
          .querySelector('title')
          .setAttribute("content", settings.htmlTitle);
        document.title = settings.htmlTitle;
      }
      if (
        applicationSettings.backgroundColor &&
        applicationSettings.backgroundColor !== ""
      )
        root?.style.setProperty(
          "--bg-color",
          applicationSettings.backgroundColor
        );
      //if (applicationSettings.backgroundType === "Picture") root?.style.setProperty("--bg-image", 'url(' + applicationSettings.backgroundUrls[0] + ')');
    }
  }, [applicationSettings]);

  useEffect(() => {
    let appSlug = false;
    if (
      window.location.host === "localhost:3000" ||
      window.location.host ===
        "9936-2a02-1811-4c89-da00-4c43-38c8-e074-db21.ngrok-free.app"
    ) {
      appSlug = "contredanse";
    } else {
      appSlug = window.location.host.split(".")[0];
    }
    if (!applicationSettings || applicationSettings.slug !== appSlug) {
      getApplication(appSlug);
    }
  }, []);

  useEffect(() => {
    if (
      responseGetApplication &&
      responseGetApplication.success &&
      responseGetApplication.data !== applicationSettings
    ) {
      setApplicationSettings(responseGetApplication.data);
    }
  }, [responseGetApplication]);

  const [bg, setBg] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const bgUrls = [
      "https://imagesdoctopus.blob.core.windows.net/contredanse/Lara%20Barsaq%20-%20Fruit%20Tree%C2%A9Stanislav%20Dobak.jpg",
      "https://imagesdoctopus.blob.core.windows.net/contredanse/TheGoldbergVariations_(c)Kat_ja%20Illner_20221013-163700.jpg",
      "https://imagesdoctopus.blob.core.windows.net/contredanse/SIMPLE%C2%A9Franc%CC%A7oisDeclercq117888.jpg",
      "https://imagesdoctopus.blob.core.windows.net/contredanse/BRUSSELSDANCEEXPO_0914595.jpeg",
      "https://imagesdoctopus.blob.core.windows.net/contredanse/Weg%C2%A9DajanaLothert21510.jpg"
    ];
    if (!bg) {
      root.style.setProperty("--bg-image", 'url("' + bgUrls[Math.floor(Math.random() * bgUrls.length)] + '")');
      setBg(bgUrls[Math.floor(Math.random() * bgUrls.length)]);
    } 
  }, [bg]);

  return (
    <div className="App">
      {applicationSettings ? (
        <Router
          applicationSettings={applicationSettings}
          setApplicationSettings={setApplicationSettings}
        />
      ) : (
        <div className="loader mt-6 pt-6">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
      )}
    </div>
  );
}

export default App;
