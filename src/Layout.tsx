import TopBar from "./components/TopBar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="bg-[#0f172a] bg-[radial-gradient(at_0%_0%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,242,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(0,242,255,0.15)_0px,transparent_50%)] h-screen">
      <TopBar />
      <main className="pt-28">
        {children}
      </main>
    </div>
  </>
);

export default Layout;