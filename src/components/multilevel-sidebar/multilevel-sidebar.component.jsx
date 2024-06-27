import React, { Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import { ArrowLeft } from "lucide-react";
import PropTypes from "prop-types";

import SidebarContent from "./sidebar-content/sidebar-content.component";

export default function MultilevelSidebar(props) {
  const { open, wrapperClassName, headerClassName, header, options, onToggle } =
    props;
  const [activeTab, setActiveTab] = useState([]);

  const handleBackdropClick = () => {
    const { onToggle, onClose, persist } = props;

    onToggle(false);
    onClose && onClose();
    if (!persist) {
      setTimeout(() => {
        setActiveTab([]);
      }, 501);
    }
  };

  const handleTabClick = (tabData) => {
    if (!!tabData.disabled) {
      return;
    }
    const { onItemClick } = props;

    if (tabData.children) {
      let data = [...activeTab];
      data.push(tabData.id);
      setActiveTab(data);
    }
    onItemClick && onItemClick(tabData);
  };

  const handleBackClick = (tabData) => {
    const { onBackClick } = props;

    if (tabData) {
      let data = [...activeTab];
      let index = data.findIndex((id) => id === tabData.id);
      data.splice(index, 1);
      setActiveTab(data);
    } else {
      setActiveTab([]);
    }
    onBackClick && onBackClick();
  };
  const getParentHeight = () => {
    let parent = document.querySelector("#sidebar-parent");
    return parent ? parent.scrollHeight : "100vh";
  };

  const renderSecondChildren = (parent, list) => {
    return (
      <SidebarContent
        {...props}
        sidebarProps={{
          className: classNames("sidebar-main second", {
            show: activeTab.includes(list.id),
            [wrapperClassName]: wrapperClassName,
          }),
          // style: { height: getParentHeight() }
        }}
        headerContent={
          <Fragment>
            <div
              className="first-back-btn flex"
              onClick={() => handleBackClick()}
            >
              <AngleLeft />
              <span>{parent.title}</span>
            </div>
            <div
              className="second-back-btn"
              onClick={() => handleBackClick(list)}
            >
              <AngleLeft />
              <span>{list.title}</span>
            </div>
          </Fragment>
        }
        options={list.children}
        handleTabClick={handleTabClick}
      />
    );
  };

  const renderFirstChildren = (list) => {
    const { wrapperClassName } = props;

    return (
      <SidebarContent
        onToggle={onToggle}
        {...props}
        sidebarProps={{
          className: classNames("sidebar-main second ", {
            show: activeTab.includes(list.id),
            [wrapperClassName]: wrapperClassName,
          }),
          // style: { height: getParentHeight() }
        }}
        headerContent={
          <div className="first-back-btn" onClick={() => handleBackClick()}>
            <AngleLeft />
            <span>{list.title}</span>
          </div>
        }
        options={list.children}
        handleTabClick={handleTabClick}
      >
        {(data) => data.children && renderSecondChildren(list, data)}
      </SidebarContent>
    );
  };

  return (
    <div id="react-sidebar" className="slidebar">
      <div
        className={classNames("sidebar-backdrop", { show: open })}
        onClick={handleBackdropClick}
      />
      <SidebarContent
        {...props}
        sidebarProps={{
          id: "sidebar-parent",
          className: classNames("sidebar-main", {
            show: open,
            [wrapperClassName]: wrapperClassName,
          }),
        }}
        headerContent={
          typeof header === "string" ? (
            <div
              className={`sidebar-header ${classNames({
                [headerClassName]: headerClassName,
              })}`}
            >
              {header}
            </div>
          ) : (
            <div
              className={classNames({
                [headerClassName]: headerClassName,
              })}
            >
              {header}
            </div>
          )
        }
        options={options}
        handleTabClick={handleTabClick}
      >
        {(list) => list.children && renderFirstChildren(list)}
      </SidebarContent>
    </div>
  );
}

MultilevelSidebar;

const AngleLeft = (props) => <ArrowLeft />;
