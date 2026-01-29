import TopBar from "./components/TopBar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="bg-[#0f172a] bg-[radial-gradient(at_0%_0%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,242,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(0,242,255,0.15)_0px,transparent_50%)] min-h-screen h-full">
      <TopBar />
      <main className="pt-28 sm:pt-32 md:pt-36 px-6 md:px-15 lg:px-20 xl:px-25 2xl:px-30">
        {children}
      </main>
    </div>
  </>
);

export default Layout;