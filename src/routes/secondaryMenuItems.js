import Dashboard from "containers/CMS/Rehab/Dashboard/Dashboard";
import NewCases from "containers/CMS/Rehab/NewCases/NewCases";
import CallBacks from "containers/CMS/Rehab/CallBacks/CallBacks";
import Cases from "containers/CMS/Rehab/Cases/Cases";
import Templates from "containers/CMS/Admin/Templates/Templates";
import CaseAdmin from "containers/CMS/Admin/Case/CaseAdmin";

export const rehabMenuItems = [
  {
    title: "Dashboard",
    icon: "fa fa-bar-chart",
    path: "/cms/rehab/dashboard",
    component: Dashboard
  },
  {
    title: "New Cases",
    icon: "fa fa-edit",
    path: "/cms/rehab/newcases",
    component: NewCases
  },
  {
    title: "Cases",
    icon: "fa fa-file-o",
    path: "/cms/rehab/cases",
    component: Cases
  },
  {
    title: "Call Backs",
    icon: "fa fa-clock-o",
    path: "/cms/rehab/callbacks",
    component: CallBacks
  },
  {
    title: "Chases",
    icon: "fa fa-paper-plane",
    path: "/cms/rehab/chases",
    component: Dashboard
  }
];

export const adminMenuItems = [
  {
    title: "Case",
    icon: "fa fa-file-o",
    path: "/cms/admin/case",
    component: CaseAdmin
  },
  {
    title: "Users",
    icon: "fa fa-user",
    path: "/cms/admin/templates",
    component: Templates
  }
];
