import TopBar from "./components/TopBar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <TopBar />
    <main className="pt-26">{children}</main>
  </>
);

export default Layout;