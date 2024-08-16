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
          .querySelector("title")
          .setAttribute("content", settings.htmlTitle);
        document.title = settings.htmlTitle;
      }
      if (
        applicationSettings.backgroundColor &&
        applicationSettings.backgroundColor !== ""
      )
      console.log("setting bg color")
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
  const [bgCreds, setBgCreds] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    console.log(applicationSettings)
    if (applicationSettings && applicationSettings.backgroundUrls && applicationSettings.backgroundUrls[0] && !applicationSettings.backgroundUrls[1]) {
        root.style.setProperty("--bg-image", `url("${applicationSettings.backgroundUrls[0]}")`);
    } else if (applicationSettings && applicationSettings.backgroundUrls && applicationSettings.backgroundUrls[0]) {
      const bgUrls = applicationSettings.backgroundUrls;
      const changeBackground = () => {
        let randomBg = bgUrls[Math.floor(Math.random() * bgUrls.length)];

        // Ensure the new background is different from the current one
        while (randomBg === bg) {
          randomBg = bgUrls[Math.floor(Math.random() * bgUrls.length)];
        }
        applicationSettings.backgroundDocs.map((doc) => {
          if (doc.thumb === randomBg) {
            setBgCreds(doc)
          }
        })
        root.style.setProperty("--bg-image", `url("${randomBg}")`);
        setBg(randomBg);
      };

      // Initial background change
      changeBackground();

      
    }
  }, [applicationSettings]);

  return (
    <div className="App">
      {applicationSettings ? (
        <Router
          applicationSettings={applicationSettings}
          setApplicationSettings={setApplicationSettings}
          bgCreds={bgCreds}
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
