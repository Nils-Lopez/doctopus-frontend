import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import FileForm from "../../atoms/forms/FileForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faC,
  faCheckCircle,
  faCirclePlus,
  faCircleXmark,
  faPencil,
  faTrash,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import SelectForm from "../../atoms/forms/SelectForm";
import DocParentForm from "../../atoms/forms/docs/DocParentForm";
import { useApplication } from "../../../utils/hooks/Application";

const ApplicationDash = ({ applicationSettings, setApplicationSettings }) => {
  const { t, i18n } = useTranslation();

  //Global Settings States Values
  const [logoValue, setLogoValue] = useState("");
  const [titleEnValue, setTitleEnValue] = useState("");
  const [titleFrValue, setTitleFrValue] = useState("");
  const [taglineFrValue, setTaglineFrValue] = useState("");
  const [taglineEnValue, setTaglineEnValue] = useState("");
  const [fontSerifValue, setFontSerifValue] = useState("");
  const [fontSansSerifValue, setFontSansSerifValue] = useState("");
  const [primaryColorValue, setPrimaryColorValue] = useState("");
  const [secondaryColorValue, setSecondaryColorValue] = useState("");
  const [faviconValue, setFaviconValue] = useState("");
  const [htmlTitleValue, setHtmlTitleValue] = useState("");
  const [htmlMetaTagValue, setHtmlMetaTagValue] = useState("");

  //Homepage Settings States Values
  const [backgroundType, setBackgroundType] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [backgroundUrls, setBackgroundUrls] = useState([]);
  const [backgroundDocs, setBackgroundDocs] = useState([]);
  const [homePageDocsTypes, setHomePageDocsTypes] = useState("");
  const [homePageDocs, setHomePageDocs] = useState([]);
  const [homePageSubtitles, setHomePageSubtitles] = useState([]);
  const [subtitleEnValue, setSubtitleEnValue] = useState("");
  const [subtitleFrValue, setSubtitleFrValue] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  //Static Pages States Values
  const [staticPages, setStaticPages] = useState([]);
  const [staticPageComponents, setStaticPageComponents] = useState([]);
  const [pageTitleEnValue, setPageTitleEnValue] = useState("");
  const [pageTitleFrValue, setPageTitleFrValue] = useState("");
  const [componentType, setComponentType] = useState("");
  const [componentPosition, setComponentPosition] = useState(1);
  const [componentContentFrValue, setComponentContentFrValue] = useState("");
  const [componentContentEnValue, setComponentContentEnValue] = useState("");

  const { updateApp, responseUpdateApp } = useApplication();

  const handleUpdateAppSettings = (e) => {
    e.preventDefault();
    let bgUrl = [];
    if (backgroundType.value === "Document's pictures") {
      backgroundDocs.map((doc) => {
        bgUrl.push(doc.thumb);
      });
    }
    const newSettings = {
      slug: applicationSettings.slug,
      global: {
        primary: primaryColorValue,
        secondary: secondaryColorValue,
        metaTag: htmlMetaTagValue,
        htmlTitle: htmlTitleValue,
        title: [
          { lang: "en", content: titleEnValue },
          { lang: "fr", content: titleFrValue },
        ],
        tagline: [
          { lang: "en", content: taglineEnValue },
          { lang: "fr", content: taglineFrValue },
        ],
        fontSerif: fontSerifValue !== "" ? fontSerifValue.value : false,
        fontSansSerif:
          fontSansSerifValue !== "" ? fontSansSerifValue.value : false,
        logo: logoValue,
        favicon: faviconValue,
      },
      backgroundType: backgroundType.value,
      backgroundColor: backgroundColor,
      backgroundUrls: bgUrl[0] ? bgUrl : backgroundUrls,
      backgroundDocs: backgroundDocs,
      homePageDocs: homePageDocs,
      homePageDocsTypes: homePageDocsTypes.value,
      homePageSubtitles: homePageSubtitles,
      staticPages: staticPages,
    };
    updateApp(newSettings);
  };

  useEffect(() => {
    if (responseUpdateApp && responseUpdateApp.success) {
      setApplicationSettings(responseUpdateApp.data);
    }
  }, [responseUpdateApp]);

  useEffect(() => {
    setStaticPages(applicationSettings.staticPages);
    setHomePageSubtitles(applicationSettings.homePageSubtitles);
    setHomePageDocs(applicationSettings.homePageDocs);
    setBackgroundColor(applicationSettings.backgroundColor);
    setBackgroundUrls(applicationSettings.backgroundUrls);
    setBackgroundDocs(applicationSettings.backgroundDocs);
    setBackgroundType({
      value: applicationSettings.backgroundType,
      label: applicationSettings.backgroundType,
    });
    setHomePageDocsTypes({
      value: applicationSettings.homePageDocsTypes,
      label: applicationSettings.homePageDocsTypes,
    });
    setFaviconValue(applicationSettings.global.favicon);
    setLogoValue(applicationSettings.global.logo);
    setFontSerifValue({
      value: applicationSettings.global.fontSerif,
      label: applicationSettings.global.fontSerif,
    });
    setFontSansSerifValue({
      value: applicationSettings.global.fontSansSerif,
      label: applicationSettings.global.fontSansSerif,
    });
    setTaglineEnValue(getContent(applicationSettings.global.tagline, "en"));
    setTaglineFrValue(getContent(applicationSettings.global.tagline, "fr"));
    setTitleEnValue(getContent(applicationSettings.global.title, "en"));
    setTitleFrValue(getContent(applicationSettings.global.title, "fr"));
    setHtmlTitleValue(applicationSettings.global.htmlTitle);
    setHtmlMetaTagValue(applicationSettings.global.metaTag);
    setPrimaryColorValue(applicationSettings.global.primary);
    setSecondaryColorValue(applicationSettings.global.secondary);
  }, []);

  //Fonts panels (needs to be imported in css theme)

  const serifFonts = [
    {
      value: "Libre Baskerville",
      label: "Libre Baskerville",
    },
    {
      value: "Merriweather",
      label: "Merriweather",
    },
    {
      value: "Bitter",
      label: "Bitter",
    },
  ];

  const sansSerifFonts = [
    {
      value: "Dinot",
      label: "Dinot",
    },
    {
      value: "Roboto",
      label: "Roboto",
    },
    {
      value: "Oswald",
      label: "Oswald",
    },
  ];

  const backgroundTypes = [
    {
      value: "Picture",
      label: "Picture",
    },
    {
      value: "Document's pictures",
      label: "Document's pictures",
    },
    {
      value: "Color",
      label: "Color",
    },
  ];

  const homepageDocTypes = [
    {
      value: "Selected",
      label: "Selected",
    },
    {
      value: "Last books",
      label: "Last books",
    },
  ];

  const getContent = (value, lang) => {
    if (value) {
      return value.filter((obj) => obj.lang === lang)[0]
        ? value.filter((obj) => obj.lang === lang)[0].content
        : value.filter((obj) => obj.lang === "en")[0]
        ? value.filter((obj) => obj.lang === "en")[0].content
        : value.filter((obj) => obj.lang === "fr")[0].content;
    } else {
      return "Error";
    }
  };

  const componentTypes = [
    {
      value: "paragraph",
      label: "Paragraph",
    },
    {
      value: "title",
      label: "Title",
    },
  ];

  let componentPositions = [];

  if (staticPageComponents.length > 0) {
    staticPageComponents.map((c, i) =>
      componentPositions.push({
        value: (i + 1).toString(),
        label: (i + 1).toString(),
      })
    );
    componentPositions.push({
      value: (staticPageComponents.length + 1).toString(),
      label: (staticPageComponents.length + 1).toString(),
    });
  } else {
    componentPositions.push({
      value: (staticPageComponents.length + 1).toString(),
      label: (staticPageComponents.length + 1).toString(),
    });
  }

  console.log(staticPages);

  return (
    <div className="">
      <div>
        <h2 className="title is-4 has-text-left">Global settings</h2>

        <div className="field">
          <label className="label has-text-left">App title</label>
          <div className="columns">
            <div className="column">
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="fr"
                  value={titleFrValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setTitleFrValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="column">
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="en"
                  value={titleEnValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setTitleEnValue(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label has-text-left">Tag line</label>
          <div className="columns">
            <div className="column">
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="fr"
                  value={taglineFrValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setTaglineFrValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="column">
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="en"
                  value={taglineEnValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setTaglineEnValue(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="columns">
            <div className="column">
              <label className="label has-text-left">HTML Title</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={htmlTitleValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setHtmlTitleValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="column">
              <label className="label has-text-left">HTML Meta-tags</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={htmlMetaTagValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setHtmlMetaTagValue(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label has-text-left">Primary color</label>

              <div className="control has-icons-left">
                <span
                  className="icon is-left"
                  style={{ color: primaryColorValue }}>
                  <FontAwesomeIcon icon={faPencil} />
                </span>
                <input
                  type="text"
                  className="input"
                  value={primaryColorValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setPrimaryColorValue(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label has-text-left">Secondary color</label>

              <div className="control has-icons-left">
                <span
                  className="icon is-left"
                  style={{ color: secondaryColorValue }}>
                  <FontAwesomeIcon icon={faPencil} />
                </span>
                <input
                  type="text"
                  className="input"
                  value={secondaryColorValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setSecondaryColorValue(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label has-text-left">Logo</label>
              <FileForm setFile={setLogoValue} pdf={logoValue} />
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label has-text-left">Favicon</label>
              <FileForm setFile={setFaviconValue} pdf={faviconValue} />
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label has-text-left">Serif Font</label>

              <SelectForm
                selected={fontSerifValue}
                select={setFontSerifValue}
                options={serifFonts}
                applicationSettings={applicationSettings}
              />
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label has-text-left">Sans-serif Font</label>
              <SelectForm
                selected={fontSansSerifValue}
                select={setFontSansSerifValue}
                options={sansSerifFonts}
                applicationSettings={applicationSettings}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <hr />
        <h2 className="title is-4 has-text-left">Homepage settings</h2>
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label has-text-left">Background type</label>
              <SelectForm
                select={setBackgroundType}
                selected={backgroundType}
                options={backgroundTypes}
                applicationSettings={applicationSettings}
              />
            </div>
          </div>
          {backgroundType && backgroundType.value === "Color" ? (
            <div className="column">
              <div className="field">
                <label className="label has-text-left">Background color</label>

                <div className="control has-icons-left">
                  <span
                    className="icon is-left"
                    style={{ color: backgroundColor }}>
                    <FontAwesomeIcon icon={faPencil} />
                  </span>
                  <input
                    type="text"
                    className="input"
                    value={backgroundColor}
                    onChange={(e) => {
                      e.preventDefault();
                      setBackgroundColor(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {backgroundType && backgroundType.value === "Document's pictures" ? (
          <div className="field">
            <label className="label has-text-left mb--1">
              Background documents
            </label>
            <DocParentForm
              selectedDoc={backgroundDocs}
              selectDoc={setBackgroundDocs}
              hideRoles={true}
              location={"app-dash"}
            />
          </div>
        ) : backgroundType && backgroundType.value === "Picture" ? (
          <>
            <div className="field">
              <label className="label has-text-left">Picture Url</label>

              <input
                type="text"
                className="input"
                value={pictureUrl}
                onChange={(e) => {
                  e.preventDefault();
                  setPictureUrl(e.target.value);
                  setBackgroundUrls([e.target.value]);
                }}
              />
            </div>
          </>
        ) : null}
        <div className="field mt-4 pt-3">
          <label className="label has-text-left">Homepage Docs Type</label>
          <SelectForm
            select={setHomePageDocsTypes}
            selected={homePageDocsTypes}
            options={homepageDocTypes}
            applicationSettings={applicationSettings}
          />
        </div>
        {homepageDocTypes && homePageDocsTypes.value === "Selected" ? (
          <>
            <div className="field">
              <label className="label has-text-left mb--1">
                Homepage documents
              </label>
              <DocParentForm
                selectedDoc={homePageDocs}
                selectDoc={setHomePageDocs}
                hideRoles={true}
                location={"app-dash"}
              />
            </div>
          </>
        ) : null}
        <div className="field mt-4 pt-3">
          <label className="label has-text-left">Subtitles</label>
          {homePageSubtitles?.map((sub, i) => (
            <>
              <Fragment key={sub}>
                <div className="is-flex is-justify-content-start ">
                  <span className="tag is-medium">{i + 1}</span>
                  <span className="tag is-medium is-info mb-4 ml-3">
                    {getContent(sub.subtitle, "fr").substring(0, 17) + ".."}
                  </span>
                  <span className="tag is-medium is-info ml-3 mb-4">
                    {getContent(sub.subtitle, "en").substring(0, 17) + ".."}
                  </span>
                  <span
                    className="tag is-medium has-text-danger pointer ml-3"
                    onClick={() => {
                      setHomePageSubtitles(
                        homePageSubtitles.filter((s) => {
                          if (s !== sub) return s;
                        })
                      );
                    }}>
                    <FontAwesomeIcon icon={faXmarkCircle} />
                  </span>
                </div>
              </Fragment>
            </>
          ))}
          <div className="columns">
            <div className="column is-5">
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="fr"
                  value={subtitleFrValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setSubtitleFrValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="column is-5">
              <div className="control">
                <input
                  type="text"
                  className="input"
                  placeholder="fr"
                  value={subtitleEnValue}
                  onChange={(e) => {
                    e.preventDefault();
                    setSubtitleEnValue(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="column is-1">
              <h1
                className="title is-4 has-text-primary pt-2 mr-2 pointer"
                onClick={() => {
                  setHomePageSubtitles([
                    ...homePageSubtitles,
                    {
                      subtitle: [
                        { lang: "en", content: subtitleEnValue },
                        { lang: "fr", content: subtitleFrValue },
                      ],
                    },
                  ]);
                  setSubtitleEnValue("");
                  setSubtitleFrValue("");
                }}>
                <FontAwesomeIcon icon={faCirclePlus} />
              </h1>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h2 className="title is-4 has-text-left">Static pages</h2>
      {staticPages?.map((page) => {
        return (
          <Fragment key={JSON.stringify(page)}>
            <div className="tag is-large">
              {getContent(page.title, i18n.language)} ({page.components.length})
              <span
                className="has-text-info pointer ml-3"
                onClick={() => {
                  setStaticPageComponents(page.components);
                  setPageTitleEnValue(getContent(page.title, "en"));
                  setPageTitleFrValue(getContent(page.title, "fr"));
                  setStaticPages(
                    [...staticPages].filter((p) => {
                      if (p !== page) return p;
                    })
                  );
                }}>
                <FontAwesomeIcon icon={faPencil} />
              </span>
              <span
                className="has-text-danger pointer ml-3"
                onClick={() => {
                  setStaticPages(
                    [...staticPages].filter((p) => {
                      if (p !== page) return p;
                    })
                  );
                }}>
                <FontAwesomeIcon icon={faCircleXmark} />
              </span>
            </div>
          </Fragment>
        );
      })}
      <div className="field">
        <label className="label has-text-left">Page title</label>
        <div className="columns">
          <div className="column">
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="fr"
                value={pageTitleFrValue}
                onChange={(e) => {
                  e.preventDefault();
                  setPageTitleFrValue(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="en"
                value={pageTitleEnValue}
                onChange={(e) => {
                  e.preventDefault();
                  setPageTitleEnValue(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <label className="label mt-2">Components</label>
      <div className="is-flex is-justify-content-space-between mb-3 columns is-multiline">
        {staticPageComponents.map((component) => {
          return (
            <Fragment key={component}>
              <div className="tag is-large mt-1 mb-1">
                {component.type}
                <span
                  className="has-text-info pointer ml-3 "
                  onClick={() => {
                    setComponentContentEnValue(
                      getContent(component.content, "en")
                    );
                    setComponentContentFrValue(
                      getContent(component.content, "fr")
                    );
                    setComponentType({
                      value: component.type,
                      label: component.type,
                    });

                    setStaticPageComponents(
                      [...staticPageComponents].filter((c) => {
                        if (c !== component) return c;
                      })
                    );
                  }}>
                  <FontAwesomeIcon icon={faPencil} />
                </span>
                <span
                  className="has-text-danger pointer ml-3"
                  onClick={() => {
                    setStaticPageComponents(
                      [...staticPageComponents].filter((c) => {
                        if (c !== component) return c;
                      })
                    );
                  }}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label has-text-left">Component type</label>
            <SelectForm
              options={componentTypes}
              select={setComponentType}
              selected={componentType}
            />
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label has-text-left">Content</label>
        <div className="columns">
          <div className="column">
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="fr"
                value={componentContentFrValue}
                onChange={(e) => {
                  e.preventDefault();
                  setComponentContentFrValue(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="column">
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="en"
                value={componentContentEnValue}
                onChange={(e) => {
                  e.preventDefault();
                  setComponentContentEnValue(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="is-flex is-justify-content-end">
        <button
          className="button is-primary mt-3"
          onClick={() => {
            setStaticPageComponents([
              ...staticPageComponents,
              {
                position: staticPageComponents.length + 1,
                content: [
                  {
                    lang: "en",
                    content: componentContentEnValue,
                  },
                  {
                    lang: "fr",
                    content: componentContentFrValue,
                  },
                ],
                type: componentType.value,
              },
            ]);
          }}>
          <span>Add component</span>
        </button>
      </div>
      {staticPageComponents.length > 0 ? (
        <>
          <hr />
          <div className="is-flex is-justify-content-end">
            <button
              className="button is-primary mt-3"
              onClick={() => {
                setStaticPages([
                  ...staticPages,
                  {
                    title: [
                      {
                        lang: "en",
                        content: pageTitleEnValue,
                      },
                      {
                        lang: "fr",
                        content: pageTitleFrValue,
                      },
                    ],
                    components: staticPageComponents,
                  },
                ]);
                setPageTitleEnValue("");
                setPageTitleFrValue("");
                setStaticPageComponents([]);
                setComponentType("");
                setComponentContentEnValue("");
                setComponentContentFrValue("");
              }}>
              <span>Add page</span>
            </button>
          </div>
        </>
      ) : null}
      <div className="is-flex is-justify-content-center mt-3">
        <button
          className="button  is-primary"
          onClick={handleUpdateAppSettings}>
          <span><FontAwesomeIcon icon={faCheckCircle} className="mr-3" />
          {t("confirm")}</span>
        </button>
      </div>
      <div className="mb-6 pb-0"></div>
      {/* <hr />
        <h2 className="title is-4 has-text-left">
            Features settings
        </h2> */}
    </div>
  );
};

export default ApplicationDash;
