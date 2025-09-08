import React, { useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { get, map } from "lodash";

import i18n from "../../i18n";
import languages from "../../common/languages";

const LanguageDropdown = () => {
  const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || "en";
  const [selectedLang, setSelectedLang] = useState(currentLanguage);

  const changeLanguageAction = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
  };

  const [isLanguageDropdown, setIsLanguageDropdown] = useState(false);
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdown(!isLanguageDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isLanguageDropdown}
        toggle={toggleLanguageDropdown}
        className="ms-1 topbar-head-dropdown header-item"
      >
        <DropdownToggle
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
          tag="button"
        >
          <img
            src={get(languages, `${selectedLang}.flag`)}
            alt="Header Language"
            height="20"
            className="rounded"
          />
        </DropdownToggle>
        <DropdownMenu className="language py-2" style={{ zIndex: 9999 }}>
          {map(Object.keys(languages), (key) => (
            <DropdownItem
              key={key}
              onClick={() => changeLanguageAction(key)}
              className={selectedLang === key ? "active" : "none"}
            >
              <img
                src={get(languages, `${key}.flag`)}
                alt="Skote"
                className="me-2 rounded"
                height="18"
              />
              <span className="align-middle">
                {get(languages, `${key}.label`)}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default LanguageDropdown;
