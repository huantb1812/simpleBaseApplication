import {
  addErrorHandler,
  getAppStatus,
  registerApplication,
  start,
} from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
addErrorHandler((err) => {
  console.log("LOI", err);
  console.log(err.appOrParcelName);
  console.log(getAppStatus(err.appOrParcelName));
});
window.addEventListener("popstate", (evt: any) => {
  if (evt.singleSpa) {
    console.log(
      "Huan: This event was fired by single-spa to forcibly trigger a re-render"
    );
    console.log(evt.singleSpaTrigger); // pushState | replaceState
  } else {
    console.log("Huan: This event was fired by native browser behavior");
  }
});
window.addEventListener('single-spa:before-routing-event', (evt:any) => {
  const {
    originalEvent,
    newAppStatuses,
    appsByNewStatus,
    totalAppChanges,
    oldUrl,
    newUrl,
    navigationIsCanceled,
    cancelNavigation,
  } = evt.detail;
  console.log(
    'original event that triggered this single-spa event',
    originalEvent,
  ); // PopStateEvent | HashChangeEvent | undefined
  console.log(
    'the new status for all applications after the reroute finishes',
    newAppStatuses,
  ); // { app1: MOUNTED, app2: NOT_MOUNTED }
  console.log(
    'the applications that changed, grouped by their status',
    appsByNewStatus,
  ); // { MOUNTED: ['app1'], NOT_MOUNTED: ['app2'] }
  console.log(
    'number of applications that changed status so far during this reroute',
    totalAppChanges,
  ); // 2
  console.log('the URL before the navigationEvent', oldUrl); // http://localhost:8080/old-route
  console.log('the URL after the navigationEvent', newUrl); // http://localhost:8080/new-route
  console.log('has the navigation been canceled', navigationIsCanceled); // false

  // The cancelNavigation function is only defined in the before-routing-event
  // evt.detail.cancelNavigation();
});
start();
