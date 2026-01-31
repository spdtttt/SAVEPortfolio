import TopBar from "./components/TopBar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className="bg-[#0f172a] bg-[radial-gradient(at_0%_0%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(0,242,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(108,99,255,0.15)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(0,242,255,0.15)_0px,transparent_50%)] min-h-screen h-full">
      <TopBar />
      <main className="pt-28 sm:pt-32 md:pt-36 px-6 md:pl-15 lg:pl-20 xl:pl-25 2xl:pl-30 md:pr-6 lg:pr-8 xl:pr-10 2xl:pr-15">
        {children}
      </main>
    </div>
  </>
);

export default Layout;