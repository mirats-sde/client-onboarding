import React, { useState, useEffect, useDebugValue } from "react";
import ClientOnboarding from "./pages/client-onboarding/ClientOnboarding";
import BusinessInfo from "./pages/business-info/BusinessInfo";
import SalesAccountsInfo from "./pages/sales-accounts/SalesAccountsInfo";
import DocumentsLinks from "./pages/documents-links/DocumentsLinks";
import VendorOnboarding from "./pages/vendor-onboarding/VendorOnboarding";
import VendorBusinessInfo from "./pages/vendor-business-info/VendorBusinessInfo";
import VendorSalesAccountsInfo from "./pages/vendor-sales-accounts/VendorSalesAccounts";
// import DocumentsLinks from "./pages/documents-links/DocumentsLinks"
import VendorDocumentsLinks from "./pages/vendor-documents-links/VendorDocumentLinks";
import { doc, getDoc } from "firebase/firestore";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import { db } from "./firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

function BlogPost() {
  let { id } = useParams();
  return <div style={{ fontSize: "50px" }}>Now showing post {id}</div>;
}

function Home() {
  return <h3>home page </h3>;
}

function App() {
  return (
    <Router>
      <Switch>
        {/* <Route path="/page/:id">
          <BlogPost />
        </Route>
        <Route path="/">
          <Home />
        </Route> */}
        <Route path="/client-onboarding/:id/:sid">
          <ClientOnboarding />
        </Route>

        <Route path="/business-info/:id/:sid">
          <BusinessInfo />
        </Route>

        <Route path="/sales-accounts/:id/:sid">
          <SalesAccountsInfo />
        </Route>

        <Route path="/documents-links/:id/:sid">
          <DocumentsLinks />
        </Route>

        <Route path="/vendor-onboarding/:id/:sid">
          <VendorOnboarding />
        </Route>

        <Route path="/vendor-business-info/:id/:sid">
          <VendorBusinessInfo />
        </Route>

        <Route path="/vendor-documents-links/:id/:sid">
          <VendorDocumentsLinks />
        </Route>

        <Route path="/vendor-sales-accounts/:id/:sid">
          <VendorSalesAccountsInfo />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
