import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

export default () => {
  const { siteConfig } = useDocusaurusContext();

  return (
    // @ts-expect-error
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />" />
  );
};
