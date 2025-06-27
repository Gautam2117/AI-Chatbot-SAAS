import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

const Layout = ({ children, title, description }) => (
  <>
    <Helmet>
      <title>{title || "Botify – AI Chatbot SaaS"}</title>
      <meta name="description" content={description || "Botify: AI-powered customer service platform."} />
    </Helmet>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

export default Layout;
